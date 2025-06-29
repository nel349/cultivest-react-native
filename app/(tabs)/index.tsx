import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Eye, EyeOff, Plus, TrendingUp, Leaf, 
  ArrowUpRight, Bell, Settings, TreePine, 
  Sprout, Flower, Star, Trophy, Zap, Target
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundingModal from '@/components/FundingModal';
import { Colors, Gradients, Typography, Spacing, Shadows, createTextStyle } from '@/utils/DesignSystem';

const { width } = Dimensions.get('window');

interface DashboardData {
  balanceBTC: number;
  balanceUSDCa: number;
  balanceALGO: number;
  balanceSOL: number;
  totalBalanceUSD: number;
  // USD values for each asset
  btcValueUSD: number;
  usdcaValueUSD: number;
  algoValueUSD: number;
  solValueUSD: number;
  addresses: {
    bitcoin: string;
    algorand: string;
    solana: string;
  };
  portfolioAllocation: {
    bitcoinPercentage: number;
    algorandPercentage: number;
    usdcPercentage: number;
    solanaPercentage: number;
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
    balanceBTC: 0,
    balanceUSDCa: 0,
    balanceALGO: 0,
    balanceSOL: 0,
    totalBalanceUSD: 0,
    btcValueUSD: 0,
    usdcaValueUSD: 0,
    algoValueUSD: 0,
    solValueUSD: 0,
    addresses: {
      bitcoin: '',
      algorand: '',
      solana: ''
    },
    portfolioAllocation: {
      bitcoinPercentage: 0,
      algorandPercentage: 0,
      usdcPercentage: 0,
      solanaPercentage: 0
    }
  });

  // Load user info from storage
  const loadUserInfo = async (): Promise<string | null> => {
    try {
      // Check multiple possible keys
      const userDataStr = await AsyncStorage.getItem('userData');
      const userIdStr = await AsyncStorage.getItem('user_id');
      const authTokenStr = await AsyncStorage.getItem('auth_token');
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);

        setUserInfo({
          name: userData.name || 'User',
          walletAddress: userData.walletAddress || '',
          userID: userData.userID || userData.userId || userIdStr || ''
        });
        return userData.userID || userData.userId || userIdStr;
      } else if (userIdStr) {
        // Fallback: just use userID if no full userData
        setUserInfo({
          name: 'User',
          walletAddress: '',
          userID: userIdStr
        });
        return userIdStr;
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }

    return null;
  };

  // Fetch wallet balance from backend
  const fetchWalletBalance = async (userID: string) => {
    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
      
      // Get database balance
      const dbResult = await apiClient.getWalletBalance(userID, false);
      
      // Get live balance
      const liveResult = await apiClient.getWalletBalance(userID, true);
      
      // Get live crypto prices 
      const pricesResult = await apiClient.request('/prices');

      if (dbResult?.success) {
        // Handle the updated multi-chain API response structure
        const addresses = {
          bitcoin: dbResult.addresses?.bitcoin || '',
          algorand: dbResult.addresses?.algorand || '',
          solana: (dbResult.addresses as any)?.solana || ''
        };
        const dbBalance = dbResult.balance?.databaseBalance || { btc: 0, algo: 0, usdca: 0, sol: 0 };
        const liveBalance = dbResult.balance?.onChainBalance || (liveResult?.success ? liveResult.balance?.onChainBalance : null) || { btc: 0, algo: 0, usdca: 0, sol: 0 };
        
        // Use live balance if available, fallback to database
        const btcBalance = liveBalance.btc || dbBalance.btc || 0;
        const algoBalance = liveBalance.algo || dbBalance.algo || 0;
        const usdcaBalance = liveBalance.usdca || dbBalance.usdca || 0;
        const solBalance = (liveBalance as any).sol || (dbBalance as any).sol || 0;
        
        // Get live cryptocurrency prices with fallbacks
        let btcPriceUSD = 97000;  // Fallback price
        let algoPriceUSD = 0.40;  // Fallback price
        let solPriceUSD = 95;     // Fallback price
        
        if (pricesResult?.success && (pricesResult as any).prices) {
          btcPriceUSD = (pricesResult as any).prices.bitcoin?.usd || btcPriceUSD;
          algoPriceUSD = (pricesResult as any).prices.algorand?.usd || algoPriceUSD;
          solPriceUSD = (pricesResult as any).prices.solana?.usd || solPriceUSD;
          console.log('✅ Using live prices:', { 
            BTC: `$${btcPriceUSD.toLocaleString()}`, 
            ALGO: `$${algoPriceUSD.toFixed(4)}`,
            SOL: `$${solPriceUSD.toFixed(2)}`
          });
        } else {
          console.log('⚠️ Using fallback prices due to API error');
        }
        
        const btcValueUSD = btcBalance * btcPriceUSD;
        const algoValueUSD = algoBalance * algoPriceUSD;
        const usdcValueUSD = usdcaBalance * 1.0;
        const solValueUSD = solBalance * solPriceUSD;
        const totalValueUSD = btcValueUSD + algoValueUSD + usdcValueUSD + solValueUSD;
        
        // Calculate portfolio allocation percentages
        const bitcoinPercentage = totalValueUSD > 0 ? (btcValueUSD / totalValueUSD) * 100 : 0;
        const algorandPercentage = totalValueUSD > 0 ? (algoValueUSD / totalValueUSD) * 100 : 0;
        const usdcPercentage = totalValueUSD > 0 ? (usdcValueUSD / totalValueUSD) * 100 : 0;
        const solanaPercentage = totalValueUSD > 0 ? (solValueUSD / totalValueUSD) * 100 : 0;
        
        console.log('💰 Parsed multi-chain balances:', { 
          btcBalance, algoBalance, usdcaBalance, solBalance,
          btcValueUSD, algoValueUSD, usdcValueUSD, solValueUSD, totalValueUSD,
          addresses 
        });
        
        setDashboardData(prev => ({
          ...prev,
          balanceBTC: btcBalance,
          balanceUSDCa: usdcaBalance,
          balanceALGO: algoBalance,
          balanceSOL: solBalance,
          totalBalanceUSD: totalValueUSD,
          btcValueUSD: btcValueUSD,
          usdcaValueUSD: usdcValueUSD,
          algoValueUSD: algoValueUSD,
          solValueUSD: solValueUSD,
          addresses: addresses,
          portfolioAllocation: {
            bitcoinPercentage: bitcoinPercentage,
            algorandPercentage: algorandPercentage,
            usdcPercentage: usdcPercentage,
            solanaPercentage: solanaPercentage
          }
        }));
        
        // Update user info with wallet addresses
        setUserInfo(prev => prev ? {
          ...prev,
          walletAddress: addresses.algorand || addresses.bitcoin || addresses.solana || ''
        } : null);
      } else {
        console.error('Failed to fetch wallet balance:', dbResult?.error || 'Database request failed');
        console.error('Failed to fetch wallet balance:', dbResult?.error);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      Alert.alert('Error', 'Failed to load wallet balance. Please try again.');
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const userID = await loadUserInfo();
      if (userID) {
        await fetchWalletBalance(userID);
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
        await fetchWalletBalance(userID);
        
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
      color: Colors.bitcoin,
      bgColor: Colors.backgroundSecondary,
      onPress: () => router.push('/(tabs)/invest')
    },
    {
      title: 'Other Crypto',
      subtitle: 'ETH, SOL, USDC & more',
      icon: Plus,
      color: Colors.primaryGreen,
      bgColor: Colors.successLight,
      onPress: () => {
        setShowFundingModal(true);
      }
    },
    {
      title: 'Portfolio View',
      subtitle: 'View positions',
      icon: ArrowUpRight,
      color: Colors.accentTeal,
      bgColor: Colors.infoLight,
      onPress: () => router.push('/(tabs)/portfolio')
    },
    {
      title: 'Learn & Grow',
      subtitle: 'Financial tips',
      icon: Star,
      color: Colors.accentGold,
      bgColor: Colors.warningLight,
      onPress: () => router.push('/education')
    }
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
      icon: Leaf
    },
    {
      id: '2',
      type: 'investment',
      amount: 25.00,
      description: 'Planted new seeds',
      timestamp: 'Yesterday',
      status: 'completed',
      icon: Sprout
    },
    {
      id: '3',
      type: 'yield_credit',
      amount: 0.28,
      description: 'Daily garden growth',
      timestamp: '1 day ago',
      status: 'completed',
      icon: Leaf
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={Gradients.primary}
        style={styles.gradient}
      >
        {/* Floating Plant Decorations */}
        <View style={styles.decorationContainer}>
          <View style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}>
            <Leaf size={20} color={Colors.white} />
          </View>
          <View style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}>
            <Flower size={16} color={Colors.white} />
          </View>
          <View style={[styles.plantDecor, { top: 200, left: width - 80, opacity: 0.25 }]}>
            <Sprout size={18} color={Colors.white} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.white} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning! 🌅</Text>
              <Text style={styles.userName}>
                Keep growing, {userInfo?.name || 'Gardener'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={24} color={Colors.white} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Settings size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={Gradients.card}
              style={styles.balanceCardGradient}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Portfolio Value</Text>
                <TouchableOpacity
                  onPress={() => setBalanceVisible(!balanceVisible)}
                  style={styles.eyeButton}
                >
                  {balanceVisible ? (
                    <Eye size={20} color={Colors.primaryGreen} />
                  ) : (
                    <EyeOff size={20} color={Colors.primaryGreen} />
                  )}
                </TouchableOpacity>
              </View>
              
              <Text style={styles.balanceAmount}>
                {balanceVisible ? `$${dashboardData.totalBalanceUSD.toFixed(2)}` : '••••••'}
              </Text>
              
              {/* Multi-Chain Asset Breakdown */}
              {balanceVisible && (
                <View style={styles.assetsBreakdown}>
                  <View style={[styles.assetItem, styles.bitcoinAsset]}>
                    <View style={styles.assetTopRow}>
                      <View style={[styles.assetIcon, styles.bitcoinIcon]}>
                        <Text style={[styles.assetSymbol, styles.bitcoinSymbol]}>₿</Text>
                      </View>
                      <Text style={[styles.assetLabel, styles.bitcoinLabel]}>Bitcoin</Text>
                    </View>
                    <View style={styles.assetBottomRow}>
                      <View style={styles.assetAmountContainer}>
                        <Text style={[styles.assetAmount, styles.bitcoinAmount]}>
                          {dashboardData.balanceBTC.toFixed(8)} BTC
                        </Text>
                        <Text style={[styles.assetUsdValue, styles.bitcoinUsdValue]}>
                          ${dashboardData.btcValueUSD.toFixed(2)}
                        </Text>
                      </View>
                      <Text style={[styles.assetPercentage, styles.bitcoinPercentage]}>
                        {dashboardData.portfolioAllocation.bitcoinPercentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.assetItem, styles.standardAsset]}>
                    <View style={styles.assetTopRow}>
                      <View style={styles.assetIcon}>
                        <Text style={styles.assetSymbol}>💰</Text>
                      </View>
                      <Text style={styles.assetLabel}>USDCa</Text>
                    </View>
                    <View style={styles.assetBottomRow}>
                      <View style={styles.assetAmountContainer}>
                        <Text style={styles.assetAmount}>
                          {dashboardData.balanceUSDCa.toFixed(2)} USDC
                        </Text>
                        <Text style={styles.assetUsdValue}>
                          ${dashboardData.usdcaValueUSD.toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.assetPercentage}>
                        {dashboardData.portfolioAllocation.usdcPercentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.assetItem, styles.standardAsset]}>
                    <View style={styles.assetTopRow}>
                      <View style={styles.assetIcon}>
                        <Text style={styles.assetSymbol}>⚡</Text>
                      </View>
                      <Text style={styles.assetLabel}>ALGO</Text>
                    </View>
                    <View style={styles.assetBottomRow}>
                      <View style={styles.assetAmountContainer}>
                        <Text style={styles.assetAmount}>
                          {dashboardData.balanceALGO.toFixed(2)} ALGO
                        </Text>
                        <Text style={styles.assetUsdValue}>
                          ${dashboardData.algoValueUSD.toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.assetPercentage}>
                        {dashboardData.portfolioAllocation.algorandPercentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.assetItem, styles.standardAsset]}>
                    <View style={styles.assetTopRow}>
                      <View style={styles.assetIcon}>
                        <Text style={styles.assetSymbol}>🌟</Text>
                      </View>
                      <Text style={styles.assetLabel}>SOL</Text>
                    </View>
                    <View style={styles.assetBottomRow}>
                      <View style={styles.assetAmountContainer}>
                        <Text style={styles.assetAmount}>
                          {dashboardData.balanceSOL.toFixed(2)} SOL
                        </Text>
                        <Text style={styles.assetUsdValue}>
                          ${dashboardData.solValueUSD.toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.assetPercentage}>
                        {dashboardData.portfolioAllocation.solanaPercentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              
              <View style={styles.yieldContainer}>
                <View style={styles.yieldItem}>
                  <Target size={16} color={Colors.accentOrange} />
                  <Text style={styles.yieldLabel}>Multi-Chain</Text>
                  <Text style={styles.yieldValue}>
                    {dashboardData.addresses.bitcoin && dashboardData.addresses.algorand && dashboardData.addresses.solana ? '✅✅✅' : 
                     dashboardData.addresses.bitcoin && dashboardData.addresses.algorand ? '✅✅⏳' :
                     dashboardData.addresses.bitcoin && dashboardData.addresses.solana ? '✅⏳✅' :
                     dashboardData.addresses.algorand && dashboardData.addresses.solana ? '⏳✅✅' :
                     dashboardData.addresses.bitcoin || dashboardData.addresses.algorand || dashboardData.addresses.solana ? '✅⏳⏳' : '⏳⏳⏳'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Achievements Row */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Your Achievements 🏆</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
              {achievements.map((achievement, index) => (
                <View key={index} style={[
                  styles.achievementBadge,
                  achievement.completed ? styles.achievementCompleted : styles.achievementLocked
                ]}>
                  <achievement.icon 
                    size={24} 
                    color={achievement.completed ? Colors.primaryGreen : Colors.gray300} 
                  />
                  <Text style={[
                    styles.achievementText,
                    achievement.completed ? styles.achievementTextCompleted : styles.achievementTextLocked
                  ]}>
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions 🚀</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
                  onPress={action.onPress}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <action.icon size={24} color={Colors.white} />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Garden Activity 🌱</Text>
            <View style={styles.activityContainer}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, 
                    { backgroundColor: activity.type === 'yield_credit' ? Colors.successLight : Colors.infoLight }
                  ]}>
                    <activity.icon size={20} color={Colors.primaryGreen} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                  </View>
                  <View style={styles.activityAmount}>
                    <Text style={[
                      styles.activityAmountText,
                      { color: activity.type === 'yield_credit' ? Colors.primaryGreen : Colors.accentOrange }
                    ]}>
                      {activity.type === 'yield_credit' ? '+' : ''}${activity.amount.toFixed(2)}
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
            onFundingInitiated={(transactionId) => {
              console.log('Funding initiated:', transactionId);
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
                          fetchWalletBalance(userInfo.userID);
                        }
                      }, 3000);
                    }
                  }
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
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...createTextStyle('bodyMedium', 'rgba(255,255,255,0.9)'),
  },
  userName: {
    ...createTextStyle('heading3', Colors.white),
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  notificationText: {
    ...createTextStyle('captionBold', Colors.white),
  },
  balanceCard: {
    marginBottom: Spacing.lg,
    borderRadius: Spacing.radiusXLarge,
    ...Shadows.cardShadow,
  },
  balanceCardGradient: {
    borderRadius: Spacing.radiusXLarge,
    padding: Spacing.cardPadding,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    ...createTextStyle('labelMedium', Colors.textSecondary),
  },
  eyeButton: {
    padding: Spacing.tiny,
  },
  balanceAmount: {
    ...createTextStyle('display1', Colors.textPrimary),
    marginBottom: Spacing.md,
  },
  assetsBreakdown: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: Spacing.radiusMedium,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  assetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.tiny,
  },
  assetBottomRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 44, // Align with text above (icon width + margin)
    minHeight: 20,
    gap: Spacing.sm,
  },
  assetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  assetSymbol: {
    ...createTextStyle('labelMedium'),
  },
  assetLabel: {
    ...createTextStyle('labelMedium', Colors.textPrimary),
    flex: 1,
  },
  assetAmount: {
    ...createTextStyle('labelMedium', Colors.textPrimary),
  },
  assetAmountContainer: {
    flex: 1,
  },
  assetUsdValue: {
    ...createTextStyle('caption', Colors.textSecondary),
    marginTop: 2,
  },
  assetPercentage: {
    ...createTextStyle('caption', Colors.textSecondary),
    marginLeft: Spacing.sm,
  },
  // Bitcoin-specific emphasis styles
  bitcoinAsset: {
    flexDirection: 'column',
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    borderRadius: Spacing.radiusSmall,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.bitcoin,
  },
  // Standard asset styles
  standardAsset: {
    flexDirection: 'column',
    paddingVertical: Spacing.sm,
  },
  bitcoinIcon: {
    backgroundColor: Colors.bitcoin,
  },
  bitcoinSymbol: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bitcoinLabel: {
    ...createTextStyle('labelMedium', Colors.bitcoin),
  },
  bitcoinAmount: {
    ...createTextStyle('labelMedium', Colors.bitcoin),
  },
  bitcoinUsdValue: {
    ...createTextStyle('caption', '#D68910'),
    marginTop: 2,
  },
  bitcoinPercentage: {
    ...createTextStyle('labelSmall', Colors.bitcoin),
  },
  yieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  yieldItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  yieldLabel: {
    ...createTextStyle('caption', Colors.textSecondary),
    flex: 1,
  },
  yieldValue: {
    ...createTextStyle('labelMedium', Colors.textPrimary),
    textAlign: 'right',
  },
  achievementsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...createTextStyle('heading4', Colors.white),
    marginBottom: Spacing.md,
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
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  achievementCompleted: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: Colors.primaryGreen,
  },
  achievementLocked: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  achievementText: {
    ...createTextStyle('caption'),
    textAlign: 'center',
    marginTop: Spacing.tiny,
  },
  achievementTextCompleted: {
    color: Colors.textPrimary,
  },
  achievementTextLocked: {
    color: 'rgba(255,255,255,0.7)',
  },
  quickActionsSection: {
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    borderRadius: Spacing.radiusLarge,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.cardShadow,
    minHeight: 120,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionTitle: {
    ...createTextStyle('labelMedium', Colors.textPrimary),
    marginBottom: Spacing.tiny,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    ...createTextStyle('caption', Colors.textSecondary),
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: Spacing.lg,
  },
  activityContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Spacing.radiusLarge,
    padding: Spacing.md,
    ...Shadows.cardShadow,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundTertiary,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    ...createTextStyle('labelMedium', Colors.textPrimary),
    marginBottom: 2,
  },
  activityTimestamp: {
    ...createTextStyle('caption', Colors.textSecondary),
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityAmountText: {
    ...createTextStyle('labelMedium'),
  },
});