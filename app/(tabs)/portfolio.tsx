import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  TrendingUp, ArrowUpRight, ArrowDownLeft, 
  Leaf, TreePine, Sprout, Flower, RefreshCw, Coins 
} from 'lucide-react-native';
import { router } from 'expo-router';
import { apiClient } from '@/utils/api';
import { UserInvestmentData } from '@/types/api';
import { NFTPortfolioCard } from '@/components/NFTPortfolioCard';
import { PositionNFTList } from '@/components/PositionNFTList';
import { useCelebrationCheck } from '@/hooks/useCelebrationCheck';

const { width } = Dimensions.get('window');

export default function PortfolioScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('1W');
  const [refreshing, setRefreshing] = useState(false);
  const [userInvestments, setUserInvestments] = useState<UserInvestmentData | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  // Use celebration check hook
  const { checkNow } = useCelebrationCheck({ userID });
  
  // Fallback portfolio data (for display when no NFT data available)
  const portfolioData = {
    totalValue: userInvestments?.portfolio ? 
      userInvestments.positions.reduce((sum, pos) => sum + (parseFloat(pos.purchaseValue) / 100), 0) 
      : 127.45,
    totalGain: 12.87,
    totalGainPercent: 11.2,
    dailyChange: 0.31,
    dailyChangePercent: 0.24
  };

  const timePeriods = ['1D', '1W', '1M', '3M', '1Y'];

  // Load user investment data
  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const currentUserID = await AsyncStorage.getItem('user_id');
      if (!currentUserID) {
        console.log('No user ID found');
        return;
      }

      // Set userID state for celebration hook
      setUserID(currentUserID);

      // Load user investments (NFT data)
      const investmentsResponse = await apiClient.getUserInvestments(currentUserID);
      if (investmentsResponse.success && investmentsResponse.data) {
        setUserInvestments(investmentsResponse.data as any);
        
        // Check for pending celebrations after loading portfolio
        setTimeout(() => {
          checkNow();
        }, 1000);
      }

    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  // Generate holdings from NFT positions
  const holdings = userInvestments?.positions?.map((position) => {
    const value = parseFloat(position.purchaseValue) / 100;
    const assetTypeMap = {
      '1': { name: 'Bitcoin Position ₿', color: '#FF9500', icon: Coins },
      '2': { name: 'Algorand Position ⚡', color: '#58CC02', icon: TreePine },
      '3': { name: 'USDC Position 💰', color: '#00D4AA', icon: Flower }
    };
    
    const theme = assetTypeMap[position.assetType as keyof typeof assetTypeMap] || assetTypeMap['2'];
    
    return {
      id: `nft-${position.tokenId}`,
      name: theme.name,
      amount: value,
      shares: parseFloat(position.holdings),
      apy: 'NFT',
      gain: 0, // TODO: Calculate gain when we have historical data
      gainPercent: 0,
      color: theme.color,
      icon: theme.icon,
      nftData: position
    };
  }) || [];

  const recentActivity = [
    {
      id: '1',
      type: 'yield',
      amount: 0.31,
      description: 'Daily staking rewards earned',
      date: '2 hours ago',
      icon: TrendingUp,
      color: '#58CC02'
    },
    {
      id: '2',
      type: 'yield',
      amount: 0.18,
      description: 'Portfolio growth from positions',
      date: '2 hours ago',
      icon: ArrowUpRight,
      color: '#00D4AA'
    },
    {
      id: '3',
      type: 'investment',
      amount: 25.00,
      description: 'New investment in Bitcoin',
      date: 'Yesterday',
      icon: Coins,
      color: '#FF9500'
    }
  ];

  return (
    <LinearGradient
      colors={['#89E5AB', '#58CC02', '#46A302']}
      style={styles.container}
    >
      {/* Floating Plant Decorations */}
      <View style={styles.decorationContainer}>
        <View style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}>
          <TreePine size={22} color="#FFFFFF" />
        </View>
        <View style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}>
          <Flower size={18} color="#FFFFFF" />
        </View>
        <View style={[styles.plantDecor, { top: 200, left: width - 80, opacity: 0.25 }]}>
          <Sprout size={20} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            tintColor="#FFFFFF"
            colors={['#58CC02']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Portfolio Overview 💼</Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw 
                size={20} 
                color="#FFFFFF" 
                style={refreshing ? styles.spinning : {}} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {userInvestments?.hasInvestments 
              ? 'Your crypto positions tracked with Portfolio NFTs!' 
              : 'Track your crypto investments'
            }
          </Text>
        </View>

        {/* Portfolio Value Card */}
        <View style={styles.portfolioCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F8F8']}
            style={styles.portfolioCardGradient}
          >
            <View style={styles.portfolioHeader}>
              <View style={styles.portfolioIcon}>
                <TreePine size={24} color="#58CC02" />
              </View>
              <Text style={styles.portfolioLabel}>Total Garden Value</Text>
            </View>
            
            <Text style={styles.portfolioValue}>
              ${portfolioData.totalValue.toFixed(2)}
            </Text>
            
            <View style={styles.portfolioGains}>
              <View style={styles.gainItem}>
                <TrendingUp size={16} color="#58CC02" />
                <Text style={styles.gainText}>
                  +${portfolioData.totalGain.toFixed(2)} ({portfolioData.totalGainPercent}%)
                </Text>
              </View>
              <View style={styles.gainItem}>
                <Text style={styles.dailyChangeLabel}>Today:</Text>
                <Text style={[
                  styles.dailyChangeValue,
                  { color: portfolioData.dailyChange >= 0 ? '#58CC02' : '#FF4444' }
                ]}>
                  {portfolioData.dailyChange >= 0 ? '+' : ''}${portfolioData.dailyChange.toFixed(2)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* NFT Portfolio Section */}
        {userInvestments?.portfolio && (
          <NFTPortfolioCard 
            portfolioNFT={{
              ...userInvestments.portfolio,
              positions: userInvestments.positions || []
            }}
            onPress={() => {
              // TODO: Navigate to NFT portfolio details
              console.log('NFT Portfolio pressed');
            }}
          />
        )}

        {/* Position NFTs Section */}
        {userInvestments?.hasInvestments && userInvestments.positions && (
          <PositionNFTList 
            positions={userInvestments.positions}
            onPositionPress={(position) => {
              // TODO: Navigate to position NFT details
              console.log('Position NFT pressed:', position.tokenId);
            }}
          />
        )}

        {/* Performance Section */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance 📈</Text>
          
          {/* Period Selector */}
          <View style={styles.periodButtons}>
            {timePeriods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Performance Placeholder */}
          <View style={styles.performancePlaceholder}>
            <View style={styles.placeholderIcon}>
              <TrendingUp size={32} color="#58CC02" />
            </View>
            <Text style={styles.placeholderTitle}>Performance Chart Coming Soon</Text>
            <Text style={styles.placeholderDescription}>
              Portfolio performance tracking and analytics will be available in a future update
            </Text>
          </View>
        </View>

        {/* Holdings Section */}
        <View style={styles.holdingsSection}>
          <Text style={styles.sectionTitle}>Your Holdings 💰</Text>
          
          {holdings.length > 0 ? (
            holdings.map((holding) => (
              <View key={holding.id} style={styles.holdingCard}>
                <View style={[styles.holdingIcon, { backgroundColor: holding.color }]}>
                  <holding.icon size={24} color="#FFFFFF" />
                </View>
                
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingName}>{holding.name}</Text>
                  <Text style={styles.holdingShares}>
                    {holding.shares.toFixed(2)} {holding.nftData ? 'NFT' : 'shares'} • {holding.apy} {holding.nftData ? 'Token' : 'APY'}
                  </Text>
                </View>
                
                <View style={styles.holdingValues}>
                  <Text style={styles.holdingAmount}>
                    ${holding.amount.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.holdingGain,
                    { color: holding.gain >= 0 ? '#58CC02' : '#FF4444' }
                  ]}>
                    {holding.gain >= 0 ? '+' : ''}${holding.gain.toFixed(2)} ({holding.gainPercent}%)
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Coins size={48} color="#58CC02" />
              </View>
              <Text style={styles.emptyStateTitle}>No Holdings Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Start investing in Bitcoin or Algorand to see your crypto portfolio here
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push('/(tabs)/invest')}
              >
                <Text style={styles.emptyStateButtonText}>Start Investing</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity 📊</Text>
                      <View style={styles.activityContainer}>
              {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                  <activity.icon size={20} color={activity.color} />
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                
                <View style={styles.activityAmount}>
                  <Text style={[
                    styles.activityAmountText,
                    { color: activity.type === 'yield' ? '#58CC02' : '#FF9500' }
                  ]}>
                    {activity.type === 'yield' ? '+' : ''}${activity.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    marginLeft: 12,
  },
  spinning: {
    transform: [{ rotate: '180deg' }],
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  portfolioCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  portfolioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  portfolioValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 16,
  },
  portfolioGains: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
  },
  dailyChangeLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  dailyChangeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  performanceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  periodButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  periodButtonTextActive: {
    color: '#58CC02',
  },
  holdingsSection: {
    marginBottom: 24,
  },
  holdingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  holdingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  holdingShares: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  holdingGain: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 24,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 2,
  },
  activityDate: {
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
  bottomSpacing: {
    height: 100,
  },
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#5A5A5A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  performancePlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontSize: 14,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 20,
  },
});