import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  Leaf,
  ArrowUpRight,
  TreePine,
  Sprout,
  Flower,
  Star,
  Trophy,
  Zap,
  Target,
  DollarSign,
  Flame,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundingModal from '@/components/FundingModal';

const { width } = Dimensions.get('window');

// Import crypto icons
const cryptoIcons = {
  bitcoin: require('@/assets/images/crypto/bitcoin.png'),
  solana: require('@/assets/images/crypto/solana.png'),
  algorand: require('@/assets/images/crypto/algorand.png'),
  usdc: require('@/assets/images/crypto/usdc.png'),
  ethereum: require('@/assets/images/crypto/ethereum.png'),
};

interface DashboardData {
  userID: string;
  balance: number; // Total portfolio value in USD
  dailyYield: number;
  portfolio?: {
    tokenId: string;
    customName: string;
    positionCount: number;
    positions: any[];
  };
  investments: {
    bitcoin: {
      count: number;
      totalInvested: number;
      estimatedBTC: number;
      currentBalance: number;
    };
    solana: {
      count: number;
      totalInvested: number;
      estimatedSOL: number;
      currentBalance: number;
    };
    algorand: {
      count: number;
      totalInvested: number;
      currentBalance: {
        algo: number;
        usdca: number;
      };
    };
    summary: {
      totalInvested: number;
      positionCount: number;
      hasPortfolio: boolean;
      totalInvestedUSD: number;
      assetCount: number;
    };
  };
  balances: {
    btc: number;
    algo: number;
    usdca: number;
    sol: number;
  };
  moneyTree: {
    leaves: number;
    growthStage: string;
    nextMilestone: number;
    level: number;
  };
  analytics: {
    diversificationScore: number;
    isMultiChain: boolean;
    supportedChains: string[];
    activeChains: string[];
  };
}

interface UserInfo {
  name: string;
  walletAddress: string;
  userID: string;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setIsLoading] = useState(true);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userID: '',
    balance: 0,
    dailyYield: 0,
    investments: {
      bitcoin: {
        count: 0,
        totalInvested: 0,
        estimatedBTC: 0,
        currentBalance: 0,
      },
      solana: {
        count: 0,
        totalInvested: 0,
        estimatedSOL: 0,
        currentBalance: 0,
      },
      algorand: {
        count: 0,
        totalInvested: 0,
        currentBalance: {
          algo: 0,
          usdca: 0,
        },
      },
      summary: {
        totalInvested: 0,
        positionCount: 0,
        hasPortfolio: false,
        totalInvestedUSD: 0,
        assetCount: 0,
      },
    },
    balances: {
      btc: 0,
      algo: 0,
      usdca: 0,
      sol: 0,
    },
    moneyTree: {
      leaves: 0,
      growthStage: 'seedling',
      nextMilestone: 10,
      level: 1,
    },
    analytics: {
      diversificationScore: 0,
      isMultiChain: false,
      supportedChains: ['Bitcoin', 'Solana', 'Algorand'],
      activeChains: [],
    },
  });

  // Load user info from storage with retry logic
  const loadUserInfo = async (retryCount = 0): Promise<string | null> => {
    try {
      // Check multiple possible keys
      const userDataStr = await AsyncStorage.getItem('userData');
      const userIdStr = await AsyncStorage.getItem('user_id');
      const userNameStr = await AsyncStorage.getItem('user_name');
      const authTokenStr = await AsyncStorage.getItem('auth_token');

      console.log('🔍 Dashboard: Loading user info attempt', retryCount + 1, {
        hasUserData: !!userDataStr,
        hasUserId: !!userIdStr,
        hasUserName: !!userNameStr,
        hasAuthToken: !!authTokenStr
      });

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);

        setUserInfo({
          name: userData.name || userNameStr || 'User',
          walletAddress: userData.walletAddress || '',
          userID: userData.userID || userData.userId || userIdStr || '',
        });
        return userData.userID || userData.userId || userIdStr;
      } else if (userIdStr) {
        // Fallback: use individual stored values
        setUserInfo({
          name: userNameStr || 'User',
          walletAddress: '',
          userID: userIdStr,
        });
        return userIdStr;
      } else if (retryCount < 2) {
        // Retry up to 2 times with a small delay for AsyncStorage timing issues
        console.log('⏳ Dashboard: No user data found, retrying in 500ms...');
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadUserInfo(retryCount + 1);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }

    return null;
  };

  // Fetch dashboard data from backend
  const fetchDashboardData = async (userID: string) => {
    console.log(`📊 Fetching dashboard data for user: ${userID}`);
    try {
      // Get both dashboard data AND live wallet balance for reconciliation
      const [dashboardResponse, walletResponse] = await Promise.all([
        apiClient.getDashboardData(userID),
        apiClient.getWalletBalance(userID, true) // Live balance
      ]);
      
      if (dashboardResponse.success && dashboardResponse.data) {
        console.log('✅ Dashboard response received');
        
        // Process and enhance the data
        const rawData = dashboardResponse.data as DashboardData;
        
                 // Get live wallet balances for reconciliation
         let liveBalances = { btc: 0, algo: 0, usdca: 0, sol: 0 };
         if (walletResponse.success && walletResponse.balance?.onChainBalance) {
           const balance = walletResponse.balance.onChainBalance;
           liveBalances = {
             btc: balance.btc || 0,
             algo: balance.algo || 0,
             usdca: balance.usdca || 0,
             sol: (balance as any).sol || 0 // SOL might not be in the type yet
           };
           console.log('✅ Live wallet balances:', liveBalances);
         }
        
        // Check if backend investment data is empty (after migration/reset)
        const hasInvestmentData = rawData.balance > 0 || rawData.portfolio || rawData.investments.summary.totalInvestedUSD > 0;
        
        if (!hasInvestmentData) {
          console.log('🧹 No investment data - showing wallet-only mode');
          // Create wallet-only dashboard state
          const walletOnlyData: DashboardData = {
            userID: rawData.userID,
            balance: 0, // No tracked investments
            dailyYield: 0,
            investments: {
              bitcoin: { count: 0, totalInvested: 0, estimatedBTC: 0, currentBalance: 0 },
              solana: { count: 0, totalInvested: 0, estimatedSOL: 0, currentBalance: 0 },
              algorand: { count: 0, totalInvested: 0, currentBalance: { algo: 0, usdca: 0 } },
              summary: { totalInvested: 0, positionCount: 0, hasPortfolio: false, totalInvestedUSD: 0, assetCount: 0 }
            },
            balances: liveBalances, // Use live balances
            moneyTree: { leaves: 0, growthStage: 'seedling', nextMilestone: 10, level: 1 },
            analytics: { 
              diversificationScore: 0, 
              isMultiChain: false, 
              supportedChains: ['Bitcoin', 'Solana', 'Algorand'], 
              activeChains: [
                ...(liveBalances.btc > 0 ? ['Bitcoin'] : []),
                ...(liveBalances.sol > 0 ? ['Solana'] : []),
                ...((liveBalances.algo > 0 || liveBalances.usdca > 0) ? ['Algorand'] : [])
              ]
            }
          };
          setDashboardData(walletOnlyData);
          console.log('✅ Dashboard set to wallet-only mode with live balances');
          return;
        }
        
        // If we have investment data, enhance it with live balances
        let enhancedData = { 
          ...rawData,
          balances: liveBalances // Always use live balances for accuracy
        };
        
        if (rawData.portfolio?.positions && rawData.portfolio.positions.length > 0) {
          // Calculate actual investment totals from portfolio positions
          const bitcoinPositions = rawData.portfolio.positions.filter(p => p.assetTypeName === 'Bitcoin');
          const solanaPositions = rawData.portfolio.positions.filter(p => p.assetTypeName === 'Solana');
          const algorandPositions = rawData.portfolio.positions.filter(p => p.assetTypeName === 'Algorand');
          
          const bitcoinInvested = bitcoinPositions.reduce((sum, pos) => sum + parseFloat(pos.purchaseValue), 0);
          const solanaInvested = solanaPositions.reduce((sum, pos) => sum + parseFloat(pos.purchaseValue), 0);
          const algorandInvested = algorandPositions.reduce((sum, pos) => sum + parseFloat(pos.purchaseValue), 0);
          
          // Calculate estimated holdings (simplified conversion)
          const bitcoinHoldings = bitcoinPositions.reduce((sum, pos) => sum + parseFloat(pos.holdings), 0) / 100000000; // Convert satoshis to BTC
          const solanaHoldings = solanaPositions.reduce((sum, pos) => sum + parseFloat(pos.holdings), 0) / 1000000000; // Convert lamports to SOL
          
          enhancedData = {
            ...enhancedData,
            investments: {
              ...rawData.investments,
              bitcoin: {
                count: bitcoinPositions.length,
                totalInvested: bitcoinInvested,
                estimatedBTC: bitcoinHoldings,
                currentBalance: bitcoinInvested // Simplified - would need real-time prices
              },
              solana: {
                count: solanaPositions.length,
                totalInvested: solanaInvested,
                estimatedSOL: solanaHoldings,
                currentBalance: solanaInvested // Simplified - would need real-time prices
              },
              algorand: {
                count: algorandPositions.length,
                totalInvested: algorandInvested,
                currentBalance: {
                  algo: 0, // Would need to parse from holdings
                  usdca: algorandInvested // Simplified
                }
              }
            },
            analytics: {
              ...rawData.analytics,
              activeChains: [
                ...(liveBalances.btc > 0 ? ['Bitcoin'] : []),
                ...(liveBalances.sol > 0 ? ['Solana'] : []),
                ...((liveBalances.algo > 0 || liveBalances.usdca > 0) ? ['Algorand'] : [])
              ],
              isMultiChain: [
                liveBalances.btc > 0 ? 1 : 0,
                liveBalances.sol > 0 ? 1 : 0,
                (liveBalances.algo > 0 || liveBalances.usdca > 0) ? 1 : 0
              ].filter(x => x).length > 1
            }
          };
        }
        
        setDashboardData(enhancedData);
        
        console.log('✅ Dashboard data reconciled:', {
          investmentBalance: enhancedData.balance,
          liveWalletBalances: liveBalances,
          portfolioPositions: enhancedData.portfolio?.positionCount || 0,
          activeChains: enhancedData.analytics.activeChains,
          reconciliationMode: hasInvestmentData ? 'investment+wallet' : 'wallet-only'
        });
        
      } else {
        console.error('❌ Failed to fetch dashboard data:', dashboardResponse.error);
        Alert.alert('API Error', `Dashboard data failed: ${dashboardResponse.error}`);
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      Alert.alert('Network Error', `Failed to connect to API: ${error}`);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const userID = await loadUserInfo();
      if (userID) {
        console.log('✅ Dashboard: User ID loaded:', userID);
        await fetchDashboardData(userID);
      } else {
        console.log('⚠️ Dashboard: No user ID found, user may need to login');
        // Could redirect to login here if needed
        // router.replace('/(auth)/welcome');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const userID = await AsyncStorage.getItem('user_id');
      if (userID) {
        // Refresh all dashboard data including wallet balance, investments, and portfolio
        await fetchDashboardData(userID);

        // TODO: Add investment/portfolio data refresh here when needed
        // Example: await fetchInvestmentData(userID);
        // Example: await fetchPortfolioData(userID);

        console.log('✅ Dashboard data refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Buy Bitcoin',
      subtitle: 'Digital gold investment',
      icon: TrendingUp,
      color: '#F7931A',
      bgColor: '#FFF8E1',
      onPress: () => router.push('/(tabs)/invest'),
    },
    {
      title: 'Other Crypto',
      subtitle: 'ETH, SOL, USDC & more',
      icon: Plus,
      color: '#58CC02',
      bgColor: '#E8F5E8',
      onPress: () => {
        setShowFundingModal(true);
      },
    },
    {
      title: 'Portfolio View',
      subtitle: 'View positions',
      icon: ArrowUpRight,
      color: '#00D4AA',
      bgColor: '#E0F7FA',
      onPress: () => router.push('/(tabs)/portfolio'),
    },
    {
      title: 'Learn & Grow',
      subtitle: 'Financial tips',
      icon: Star,
      color: '#FFD900',
      bgColor: '#FFFDE7',
      onPress: () => router.push('/education'),
    },
  ];

  const achievements = [
    { icon: Sprout, title: 'First Seed', completed: true },
    { icon: TreePine, title: 'Growing Tree', completed: true },
    { icon: Flower, title: 'First Bloom', completed: true },
    { icon: Trophy, title: 'Week Streak', completed: false },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'yield_credit',
      amount: 0.31,
      description: 'Daily garden growth',
      timestamp: '2 hours ago',
      status: 'completed',
      icon: Leaf,
    },
    {
      id: '2',
      type: 'investment',
      amount: 25.0,
      description: 'Planted new seeds',
      timestamp: 'Yesterday',
      status: 'completed',
      icon: Sprout,
    },
    {
      id: '3',
      type: 'yield_credit',
      amount: 0.28,
      description: 'Daily garden growth',
      timestamp: '1 day ago',
      status: 'completed',
      icon: Leaf,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#89E5AB', '#58CC02', '#46A302']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Floating Plant Decorations */}
        <View style={styles.decorationContainer}>
          <View
            style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}
          >
            <Leaf size={20} color="#FFFFFF" />
          </View>
          <View
            style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}
          >
            <Flower size={16} color="#FFFFFF" />
          </View>
          <View
            style={[
              styles.plantDecor,
              { top: 200, left: width - 80, opacity: 0.25 },
            ]}
          >
            <Sprout size={18} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning! 🌅</Text>
              <Text style={styles.userName} numberOfLines={2}>
                Keep growing, {userInfo?.name || 'Gardener'}
              </Text>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.balanceCardGradient}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Portfolio Value</Text>
                <TouchableOpacity
                  onPress={() => setBalanceVisible(!balanceVisible)}
                  style={styles.eyeButton}
                >
                  {balanceVisible ? (
                    <Eye size={20} color="#58CC02" />
                  ) : (
                    <EyeOff size={20} color="#58CC02" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.balanceAmount}>
                {balanceVisible
                  ? (() => {
                      // Calculate total wallet value from live balances
                      const totalWalletValue = (dashboardData.balances.btc * 97000) + 
                                              dashboardData.balances.usdca + 
                                              (dashboardData.balances.sol * 95) + 
                                              (dashboardData.balances.algo * 0.4);
                      
                      const totalValue = dashboardData.balance + totalWalletValue;
                      
                      if (totalValue > 0) {
                        return `$${totalValue.toFixed(2)}`;
                      } else {
                        return '$0.00';
                      }
                    })()
                  : '••••••'}
              </Text>

              {/* Wallet Crypto Section - DETAILED */}
              {balanceVisible && (() => {
                const totalWalletValue = (dashboardData.balances.btc * 97000) + 
                                        dashboardData.balances.usdca + 
                                        (dashboardData.balances.sol * 95) + 
                                        (dashboardData.balances.algo * 0.4);
                
                if (totalWalletValue > 0) {
                  return (
                    <View style={styles.walletSection}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleProfessional}>Wallet Crypto</Text>
                        <Text style={styles.sectionValueProfessional}>${totalWalletValue.toFixed(2)}</Text>
                      </View>
                      <Text style={styles.sectionSubtitleProfessional}>Direct transfers & deposits</Text>
                      
                      {/* Wallet Crypto Cards */}
                      <View style={styles.assetsBreakdown}>
                                                 {/* Bitcoin Wallet */}
                         {dashboardData.balances.btc > 0 && (
                           <TouchableOpacity style={styles.cryptoCard}>
                             <View style={styles.cryptoCardHeader}>
                               <View style={[styles.cryptoIcon, { backgroundColor: '#FFF8E1' }]}>
                                 <Image source={cryptoIcons.bitcoin} style={styles.cryptoIconImage} />
                               </View>
                              <View style={styles.cryptoInfo}>
                                <Text style={styles.cryptoName}>Bitcoin</Text>
                                <Text style={styles.cryptoSymbol}>BTC</Text>
                              </View>
                              <View style={styles.cryptoValue}>
                                <Text style={styles.cryptoBalance}>
                                  {dashboardData.balances.btc.toFixed(8)} BTC
                                </Text>
                                <Text style={styles.cryptoUSD}>
                                  ${(dashboardData.balances.btc * 97000).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <View style={styles.cryptoChart}>
                                <View
                                  style={[
                                    styles.chartFill,
                                    {
                                      width: `${totalWalletValue > 0 
                                        ? ((dashboardData.balances.btc * 97000) / totalWalletValue) * 100 
                                        : 0
                                      }%`,
                                      backgroundColor: '#F7931A',
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.chartPercentage}>
                                {totalWalletValue > 0 
                                  ? ((dashboardData.balances.btc * 97000) / totalWalletValue * 100).toFixed(1)
                                  : '0.0'
                                }%
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                                                 {/* USDC Wallet */}
                         {dashboardData.balances.usdca > 0 && (
                           <TouchableOpacity style={styles.cryptoCard}>
                             <View style={styles.cryptoCardHeader}>
                               <View style={[styles.cryptoIcon, { backgroundColor: '#E3F2FD' }]}>
                                 <Image source={cryptoIcons.usdc} style={styles.cryptoIconImage} />
                               </View>
                              <View style={styles.cryptoInfo}>
                                <Text style={styles.cryptoName}>USD Coin</Text>
                                <Text style={styles.cryptoSymbol}>USDC</Text>
                              </View>
                              <View style={styles.cryptoValue}>
                                <Text style={styles.cryptoBalance}>
                                  {dashboardData.balances.usdca.toFixed(2)} USDC
                                </Text>
                                <Text style={styles.cryptoUSD}>
                                  ${dashboardData.balances.usdca.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <View style={styles.cryptoChart}>
                                <View
                                  style={[
                                    styles.chartFill,
                                    {
                                      width: `${totalWalletValue > 0 
                                        ? (dashboardData.balances.usdca / totalWalletValue) * 100 
                                        : 0
                                      }%`,
                                      backgroundColor: '#2196F3',
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.chartPercentage}>
                                {totalWalletValue > 0 
                                  ? (dashboardData.balances.usdca / totalWalletValue * 100).toFixed(1)
                                  : '0.0'
                                }%
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                                                 {/* Solana Wallet */}
                         {dashboardData.balances.sol > 0 && (
                           <TouchableOpacity style={styles.cryptoCard}>
                             <View style={styles.cryptoCardHeader}>
                               <View style={[styles.cryptoIcon, { backgroundColor: '#E8F5E8' }]}>
                                 <Image source={cryptoIcons.solana} style={styles.cryptoIconImage} />
                               </View>
                              <View style={styles.cryptoInfo}>
                                <Text style={styles.cryptoName}>Solana</Text>
                                <Text style={styles.cryptoSymbol}>SOL</Text>
                              </View>
                              <View style={styles.cryptoValue}>
                                <Text style={styles.cryptoBalance}>
                                  {dashboardData.balances.sol.toFixed(4)} SOL
                                </Text>
                                <Text style={styles.cryptoUSD}>
                                  ${(dashboardData.balances.sol * 95).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <View style={styles.cryptoChart}>
                                <View
                                  style={[
                                    styles.chartFill,
                                    {
                                      width: `${totalWalletValue > 0 
                                        ? ((dashboardData.balances.sol * 95) / totalWalletValue) * 100 
                                        : 0
                                      }%`,
                                      backgroundColor: '#58CC02',
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.chartPercentage}>
                                {totalWalletValue > 0 
                                  ? ((dashboardData.balances.sol * 95) / totalWalletValue * 100).toFixed(1)
                                  : '0.0'
                                }%
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                                                 {/* Algorand Wallet */}
                         {dashboardData.balances.algo > 0 && (
                           <TouchableOpacity style={styles.cryptoCard}>
                             <View style={styles.cryptoCardHeader}>
                               <View style={[styles.cryptoIcon, { backgroundColor: '#E8F5E8' }]}>
                                 <Image source={cryptoIcons.algorand} style={styles.cryptoIconImage} />
                               </View>
                              <View style={styles.cryptoInfo}>
                                <Text style={styles.cryptoName}>Algorand</Text>
                                <Text style={styles.cryptoSymbol}>ALGO</Text>
                              </View>
                              <View style={styles.cryptoValue}>
                                <Text style={styles.cryptoBalance}>
                                  {dashboardData.balances.algo.toFixed(4)} ALGO
                                </Text>
                                <Text style={styles.cryptoUSD}>
                                  ${(dashboardData.balances.algo * 0.4).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <View style={styles.cryptoChart}>
                                <View
                                  style={[
                                    styles.chartFill,
                                    {
                                      width: `${totalWalletValue > 0 
                                        ? ((dashboardData.balances.algo * 0.4) / totalWalletValue) * 100 
                                        : 0
                                      }%`,
                                      backgroundColor: '#58CC02',
                                    },
                                  ]}
                                />
                              </View>
                              <Text style={styles.chartPercentage}>
                                {totalWalletValue > 0 
                                  ? ((dashboardData.balances.algo * 0.4) / totalWalletValue * 100).toFixed(1)
                                  : '0.0'
                                }%
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                }
                return null;
              })()}

              {/* Cultivest Investments Section - DETAILED */}
              {balanceVisible && dashboardData.balance > 0 && (
                <View style={styles.investmentSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitleProfessional}>Cultivest Investments</Text>
                    <Text style={styles.sectionValueProfessional}>${dashboardData.balance.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.sectionSubtitleProfessional}>Tracked through the app</Text>
                  
                  {dashboardData.portfolio && (
                    <Text style={styles.portfolioTextProfessional}>
                      Portfolio NFT #{dashboardData.portfolio.tokenId} • {dashboardData.portfolio.positionCount} positions
                    </Text>
                  )}

                  {/* Detailed Investment Cards */}
                  <View style={styles.assetsBreakdown}>
                    {/* Bitcoin Position */}
                     <TouchableOpacity style={styles.cryptoCard}>
                       <View style={styles.cryptoCardHeader}>
                         <View style={[styles.cryptoIcon, { backgroundColor: '#FFF8E1' }]}>
                           <Image source={cryptoIcons.bitcoin} style={styles.cryptoIconImage} />
                         </View>
                        <View style={styles.cryptoInfo}>
                          <Text style={styles.cryptoName}>Bitcoin</Text>
                          <Text style={styles.cryptoSymbol}>BTC</Text>
                        </View>
                        <View style={styles.cryptoValue}>
                          <Text style={styles.cryptoBalance}>
                            {dashboardData.investments.bitcoin.estimatedBTC.toFixed(8)} BTC
                          </Text>
                          <Text style={styles.cryptoUSD}>
                            ${dashboardData.investments.bitcoin.totalInvested.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View style={styles.cryptoChart}>
                          <View
                            style={[
                              styles.chartFill,
                              {
                                width: `${(() => {
                                  const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                       dashboardData.investments.solana.totalInvested + 
                                                       dashboardData.investments.algorand.totalInvested;
                                  return totalInvested > 0 
                                    ? (dashboardData.investments.bitcoin.totalInvested / totalInvested) * 100 
                                    : 0;
                                })()}%`,
                                backgroundColor: '#F7931A',
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartPercentage}>
                          {(() => {
                            const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                 dashboardData.investments.solana.totalInvested + 
                                                 dashboardData.investments.algorand.totalInvested;
                            return totalInvested > 0 
                              ? ((dashboardData.investments.bitcoin.totalInvested / totalInvested) * 100).toFixed(1)
                              : '0.0';
                          })()}%
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* USDC Position */}
                     <TouchableOpacity style={styles.cryptoCard}>
                       <View style={styles.cryptoCardHeader}>
                         <View style={[styles.cryptoIcon, { backgroundColor: '#E3F2FD' }]}>
                           <Image source={cryptoIcons.usdc} style={styles.cryptoIconImage} />
                         </View>
                        <View style={styles.cryptoInfo}>
                          <Text style={styles.cryptoName}>USD Coin</Text>
                          <Text style={styles.cryptoSymbol}>USDC</Text>
                        </View>
                        <View style={styles.cryptoValue}>
                          <Text style={styles.cryptoBalance}>
                            {dashboardData.investments.algorand.currentBalance.usdca.toFixed(2)} USDC
                          </Text>
                          <Text style={styles.cryptoUSD}>
                            ${dashboardData.investments.algorand.totalInvested.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View style={styles.cryptoChart}>
                          <View
                            style={[
                              styles.chartFill,
                              {
                                width: `${(() => {
                                  const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                       dashboardData.investments.solana.totalInvested + 
                                                       dashboardData.investments.algorand.totalInvested;
                                  return totalInvested > 0 
                                    ? (dashboardData.investments.algorand.totalInvested / totalInvested) * 100 
                                    : 0;
                                })()}%`,
                                backgroundColor: '#2196F3',
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartPercentage}>
                          {(() => {
                            const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                 dashboardData.investments.solana.totalInvested + 
                                                 dashboardData.investments.algorand.totalInvested;
                            return totalInvested > 0 
                              ? ((dashboardData.investments.algorand.totalInvested / totalInvested) * 100).toFixed(1)
                              : '0.0';
                          })()}%
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Solana Position */}
                    <TouchableOpacity style={styles.cryptoCard}>
                      <View style={styles.cryptoCardHeader}>
                        <View style={[styles.cryptoIcon, { backgroundColor: '#E8F5E8' }]}>
                          <Image source={cryptoIcons.solana} style={styles.cryptoIconImage} />
                        </View>
                        <View style={styles.cryptoInfo}>
                          <Text style={styles.cryptoName}>Solana</Text>
                          <Text style={styles.cryptoSymbol}>SOL</Text>
                        </View>
                        <View style={styles.cryptoValue}>
                          <Text style={styles.cryptoBalance}>
                            {dashboardData.investments.solana.estimatedSOL.toFixed(4)} SOL
                          </Text>
                          <Text style={styles.cryptoUSD}>
                            ${dashboardData.investments.solana.totalInvested.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View style={styles.cryptoChart}>
                          <View
                            style={[
                              styles.chartFill,
                              {
                                width: `${(() => {
                                  const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                       dashboardData.investments.solana.totalInvested + 
                                                       dashboardData.investments.algorand.totalInvested;
                                  return totalInvested > 0 
                                    ? (dashboardData.investments.solana.totalInvested / totalInvested) * 100 
                                    : 0;
                                })()}%`,
                                backgroundColor: '#58CC02',
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartPercentage}>
                          {(() => {
                            const totalInvested = dashboardData.investments.bitcoin.totalInvested + 
                                                 dashboardData.investments.solana.totalInvested + 
                                                 dashboardData.investments.algorand.totalInvested;
                            return totalInvested > 0 
                              ? ((dashboardData.investments.solana.totalInvested / totalInvested) * 100).toFixed(1)
                              : '0.0';
                          })()}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Multi-Chain Yield Indicator */}
              <View style={styles.yieldContainer}>
                <View style={styles.yieldItem}>
                  <Target size={16} color="#FF9500" />
                  <Text style={styles.yieldLabel}>Multi-Chain</Text>
                  <Text style={styles.yieldValue}>
                    {dashboardData.analytics.activeChains.length === 3
                      ? '✅✅✅'
                      : dashboardData.analytics.activeChains.length === 2
                      ? '✅✅⏳'
                      : dashboardData.analytics.activeChains.length === 1
                      ? '✅⏳⏳'
                      : '⏳⏳⏳'}
                  </Text>
                </View>
              </View>

              {/* Empty State */}
              {balanceVisible && dashboardData.balance === 0 && (() => {
                const totalWalletValue = (dashboardData.balances.btc * 97000) + 
                                        dashboardData.balances.usdca + 
                                        (dashboardData.balances.sol * 95) + 
                                        (dashboardData.balances.algo * 0.4);
                
                if (totalWalletValue === 0) {
                  return (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyTitle}>Ready to Start</Text>
                      <Text style={styles.emptySubtitle}>Buy crypto or make your first investment</Text>
                    </View>
                  );
                }
                return null;
              })()}
            </LinearGradient>
          </View>

          {/* Achievements Row */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Your Achievements 🏆</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.achievementsScroll}
            >
              {achievements.map((achievement, index) => (
                <View
                  key={index}
                  style={[
                    styles.achievementBadge,
                    achievement.completed
                      ? styles.achievementCompleted
                      : styles.achievementLocked,
                  ]}
                >
                  <achievement.icon
                    size={24}
                    color={achievement.completed ? '#58CC02' : '#C0C0C0'}
                  />
                  <Text
                    style={[
                      styles.achievementText,
                      achievement.completed
                        ? styles.achievementTextCompleted
                        : styles.achievementTextLocked,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickActionCard,
                    { backgroundColor: action.bgColor },
                  ]}
                  onPress={action.onPress}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <action.icon size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityContainer}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'yield_credit'
                            ? '#E8F5E8'
                            : '#E0F7FA',
                      },
                    ]}
                  >
                    <activity.icon size={20} color="#58CC02" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityTimestamp}>
                      {activity.timestamp}
                    </Text>
                  </View>
                  <View style={styles.activityAmount}>
                    <Text
                      style={[
                        styles.activityAmountText,
                        {
                          color:
                            activity.type === 'yield_credit'
                              ? '#58CC02'
                              : '#FF9500',
                        },
                      ]}
                    >
                      {activity.type === 'yield_credit' ? '+' : ''}$
                      {activity.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Funding Modal */}
        <FundingModal
          visible={showFundingModal}
          onClose={() => setShowFundingModal(false)}
          userID={userInfo?.userID || ''}
                      onFundingInitiated={() => {
              console.log('Funding initiated');
            // Could add transaction tracking here
            Alert.alert(
              'Crypto Purchase Started! 💳',
              'Complete your payment with MoonPay. You can choose from various cryptocurrencies to diversify your portfolio.',
              [
                {
                  text: 'Got it!',
                  onPress: () => {
                    // Refresh balance after a short delay
                    setTimeout(() => {
                      if (userInfo?.userID) {
                        fetchDashboardData(userInfo.userID);
                      }
                    }, 3000);
                  },
                },
              ]
            );
          }}
        />


      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  plantDecor: {
    position: 'absolute',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flexWrap: 'wrap',
  },

  treeCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  treeCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  treeIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  levelBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#58CC02',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  treeInfo: {
    flex: 1,
  },
  treeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  treeSubtitle: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    textAlign: 'center',
  },
  balanceCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#5A5A5A',
    fontWeight: '600',
  },
  eyeButton: {
    padding: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 16,
  },
  assetsBreakdown: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assetBottomRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 44, // Align with text above (icon width + margin)
    minHeight: 20,
    gap: 8,
  },
  assetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetSymbol: {
    fontSize: 16,
  },
  assetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
  },
  assetAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  assetAmountContainer: {
    flex: 1,
  },
  assetUsdValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5A5A5A',
    marginTop: 2,
  },
  assetPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5A5A',
    marginLeft: 8,
  },
  // Bitcoin-specific emphasis styles
  bitcoinAsset: {
    flexDirection: 'column',
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F7931A',
  },
  // Standard asset styles
  standardAsset: {
    flexDirection: 'column',
    paddingVertical: 8,
  },
  bitcoinIcon: {
    backgroundColor: '#F7931A',
  },
  bitcoinSymbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bitcoinLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F7931A',
  },
  bitcoinAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F7931A',
  },
  bitcoinUsdValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D68910',
    marginTop: 2,
  },
  bitcoinPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F7931A',
  },
  yieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  yieldItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yieldDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  yieldLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '600',
    flex: 1,
  },
  yieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'right',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  achievementsScroll: {
    paddingLeft: 0,
  },
  achievementBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    padding: 8,
  },
  achievementCompleted: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: '#58CC02',
  },
  achievementLocked: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  achievementText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementTextCompleted: {
    color: '#2E7D32',
  },
  achievementTextLocked: {
    color: 'rgba(255,255,255,0.7)',
  },
  quickActionsSection: {
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 100,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 12,
  },
  activityContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 2,
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityAmountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cryptoCard: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  cryptoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cryptoIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cryptoSymbol: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  cryptoValue: {
    alignItems: 'flex-end',
  },
  cryptoBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cryptoUSD: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5A5A5A',
    marginTop: 2,
  },
  cryptoChart: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  chartFill: {
    height: '100%',
    backgroundColor: '#58CC02',
  },
  chartPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  balanceSubtitle: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    marginTop: 4,
  },
  walletSection: {
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleProfessional: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  sectionValueProfessional: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  sectionSubtitleProfessional: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '400',
    marginBottom: 8,
  },
  investmentSection: {
    marginBottom: 16,
  },
  portfolioTextProfessional: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '400',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
    textAlign: 'center',
  },
});
