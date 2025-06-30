import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  TrendingUp, ArrowUpRight, ArrowDownLeft, 
  RefreshCw, Coins 
} from 'lucide-react-native';
import { router } from 'expo-router';
import { apiClient } from '@/utils/api';
import { UserInvestmentData } from '@/types/api';
import { NFTPortfolioCard } from '@/components/NFTPortfolioCard';
import { PositionNFTList } from '@/components/PositionNFTList';
import { useCelebrationCheck } from '@/hooks/useCelebrationCheck';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';
import { getCurrentUser } from '@/utils/auth';

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
      const { userId } = await getCurrentUser();
      if (!userId) {
        console.log('No user ID found');
        return;
      }

      // Set userID state for celebration hook
      setUserID(userId);

      // Load user investments (NFT data)
      const investmentsResponse = await apiClient.getUserInvestments(userId);
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
      '2': { name: 'Algorand Position ⚡', color: '#58CC02', icon: TrendingUp },
      '3': { name: 'USDC Position 💰', color: '#00D4AA', icon: ArrowUpRight }
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
      color: Colors.brand.green
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
      colors={Colors.gradients.backgroundPrimary}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            tintColor={Colors.text.primary}
            colors={[Colors.brand.green]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Portfolio Overview</Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw 
                size={20} 
                color={Colors.text.primary} 
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
          <View style={styles.portfolioCardContent}>
            <View style={styles.portfolioHeader}>
              <View style={styles.portfolioIcon}>
                <TrendingUp size={24} color={Colors.brand.green} />
              </View>
              <Text style={styles.portfolioLabel}>Total Garden Value</Text>
            </View>
            
            <Text style={styles.portfolioValue}>
              ${portfolioData.totalValue.toFixed(2)}
            </Text>
            
            <View style={styles.portfolioGains}>
              <View style={styles.gainItem}>
                <TrendingUp size={16} color={Colors.brand.green} />
                <Text style={styles.gainText}>
                  +${portfolioData.totalGain.toFixed(2)} ({portfolioData.totalGainPercent}%)
                </Text>
              </View>
              <View style={styles.gainItem}>
                <Text style={styles.dailyChangeLabel}>Today:</Text>
                <Text style={[
                  styles.dailyChangeValue,
                  { color: portfolioData.dailyChange >= 0 ? Colors.brand.green : Colors.status.error }
                ]}>
                  {portfolioData.dailyChange >= 0 ? '+' : ''}${portfolioData.dailyChange.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
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
          <Text style={styles.sectionTitle}>Performance</Text>
          
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
              <TrendingUp size={32} color={Colors.brand.green} />
            </View>
            <Text style={styles.placeholderTitle}>Performance Chart Coming Soon</Text>
            <Text style={styles.placeholderDescription}>
              Portfolio performance tracking and analytics will be available in a future update
            </Text>
          </View>
        </View>

        {/* Holdings Section */}
        <View style={styles.holdingsSection}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
          
          {holdings.length > 0 ? (
            holdings.map((holding) => (
              <View key={holding.id} style={styles.holdingCard}>
                <View style={[styles.holdingIcon, { backgroundColor: holding.color }]}>
                  <holding.icon size={24} color={Colors.text.primary} />
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
                    { color: holding.gain >= 0 ? Colors.brand.green : Colors.status.error }
                  ]}>
                    {holding.gain >= 0 ? '+' : ''}${holding.gain.toFixed(2)} ({holding.gainPercent}%)
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Coins size={48} color={Colors.brand.green} />
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
          <Text style={styles.sectionTitle}>Recent Activity</Text>
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
                    { color: activity.type === 'yield' ? Colors.brand.green : '#FF9500' }
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  refreshButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.md,
  },
  spinning: {
    transform: [{ rotate: '180deg' }],
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: Typography.weight.medium,
  },
  portfolioCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Spacing.lg,
    ...Shadow.md,
  },
  portfolioCardContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
  },
  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  portfolioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  portfolioLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
  },
  portfolioValue: {
    fontSize: Typography.size.title,
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  portfolioGains: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gainItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gainText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
    marginLeft: Spacing.xs,
  },
  dailyChangeLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    marginRight: Spacing.xs,
  },
  dailyChangeValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
  performanceSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.md,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Spacing.sm,
  },
  periodButtonActive: {
    backgroundColor: Colors.brand.green,
  },
  periodButtonText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.tertiary,
  },
  periodButtonTextActive: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
  },
  performancePlaceholder: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadow.sm,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  placeholderTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  placeholderDescription: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  holdingsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  holdingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  holdingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  holdingShares: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingAmount: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  holdingGain: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  emptyState: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadow.sm,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  emptyStateTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyStateDescription: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: Colors.brand.green,
    borderRadius: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  activitySection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  activityContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
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
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  activityDate: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityAmountText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  bottomSpacing: {
    height: Spacing['4xl'],
  },
});