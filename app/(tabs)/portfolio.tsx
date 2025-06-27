import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, 
  Leaf, TreePine, Sprout, Flower, Calendar, DollarSign, RefreshCw 
} from 'lucide-react-native';
import { apiClient } from '@/utils/api';
import { UserInvestmentData, DashboardData } from '@/types/api';
import { NFTPortfolioCard } from '@/components/NFTPortfolioCard';
import { PositionNFTList } from '@/components/PositionNFTList';

const { width } = Dimensions.get('window');

export default function PortfolioScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('1W');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInvestments, setUserInvestments] = useState<UserInvestmentData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
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
      setLoading(true);
      const userID = await AsyncStorage.getItem('user_id');
      if (!userID) {
        console.log('No user ID found');
        setLoading(false);
        return;
      }

      // Load user investments (NFT data)
      const investmentsResponse = await apiClient.getUserInvestments(userID);
      if (investmentsResponse.success && investmentsResponse.data) {
        setUserInvestments(investmentsResponse.data as any);
      }

      // Load dashboard data for additional insights
      const dashboardResponse = await apiClient.getDashboardData(userID);
      if (dashboardResponse.success && (dashboardResponse as any).dashboard) {
        setDashboardData((dashboardResponse as any).dashboard);
      }
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  // Generate holdings from NFT positions
  const holdings = userInvestments?.positions?.map((position, index) => {
    const value = parseFloat(position.purchaseValue) / 100;
    const assetTypeMap = {
      '1': { name: 'Bitcoin Garden ₿', color: '#FF9500', icon: Sprout },
      '2': { name: 'Algorand Forest 🌲', color: '#58CC02', icon: TreePine },
      '3': { name: 'USDC Flowers 💐', color: '#00D4AA', icon: Flower }
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
  }) || [
    // Fallback data when no NFT positions
    {
      id: 'stable-garden',
      name: 'Stable Garden 🌿',
      amount: 85.20,
      shares: 85.20,
      apy: '2.5%',
      gain: 7.40,
      gainPercent: 9.5,
      color: '#58CC02',
      icon: Leaf
    },
    {
      id: 'growth-sprouts',
      name: 'Growth Sprouts 🌱',
      amount: 42.25,
      shares: 40.12,
      apy: '4.2%',
      gain: 5.47,
      gainPercent: 14.9,
      color: '#00D4AA',
      icon: Sprout
    }
  ];

  const recentHarvests = [
    {
      id: '1',
      type: 'yield',
      amount: 0.31,
      description: 'Daily yield from Stable Garden',
      date: '2 hours ago',
      icon: Leaf,
      color: '#58CC02'
    },
    {
      id: '2',
      type: 'yield',
      amount: 0.18,
      description: 'Daily yield from Growth Sprouts',
      date: '2 hours ago',
      icon: Sprout,
      color: '#00D4AA'
    },
    {
      id: '3',
      type: 'plant',
      amount: 25.00,
      description: 'New seeds planted in Stable Garden',
      date: 'Yesterday',
      icon: Leaf,
      color: '#58CC02'
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
            <Text style={styles.title}>Your Garden Portfolio 🌻</Text>
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
              ? 'Your digital garden is growing with NFT certificates!' 
              : 'Watch your investments bloom'
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

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Performance 📈</Text>
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
        </View>

        {/* Holdings Section */}
        <View style={styles.holdingsSection}>
          <Text style={styles.sectionTitle}>Your Gardens 🌱</Text>
          
          {holdings.map((holding) => (
            <View key={holding.id} style={styles.holdingCard}>
              <View style={[styles.holdingIcon, { backgroundColor: holding.color }]}>
                <holding.icon size={24} color="#FFFFFF" />
              </View>
              
              <View style={styles.holdingInfo}>
                <Text style={styles.holdingName}>{holding.name}</Text>
                <Text style={styles.holdingShares}>
                  {holding.shares.toFixed(2)} shares • {holding.apy} APY
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
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions 🚀</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#E8F5E8' }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#58CC02' }]}>
                <ArrowUpRight size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Plant More</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF9500' }]}>
                <ArrowDownLeft size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Harvest</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Harvests 🌾</Text>
          <View style={styles.activityContainer}>
            {recentHarvests.map((activity) => (
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
  periodSelector: {
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
});