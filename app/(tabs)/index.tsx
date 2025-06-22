import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Eye, EyeOff, Plus, TrendingUp, Leaf, DollarSign, 
  ArrowUpRight, ArrowDownLeft, Bell, Settings, TreePine, 
  Sprout, Flower, Star, Trophy, Zap, Target
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    userID: string;
    name: string;
    walletAddress?: string;
  } | null>(null);
  const [dashboardData, setDashboardData] = useState({
    // Real wallet balances
    balanceUSDCa: 0,
    balanceALGO: 0,
    totalBalanceUSD: 0,
    walletAddress: '',
    
    // Investment data (will be real later)
    dailyYield: 0,
    totalYieldEarned: 0,
    moneyTreeLevel: 1,
    weeklyGrowth: 0,
    investmentStreak: 0,
    plantsGrown: 0,
    nextMilestone: 50
  });

  // Load user info from storage
  const loadUserInfo = async () => {
    try {
      const userID = await AsyncStorage.getItem('user_id');
      const userName = await AsyncStorage.getItem('user_name');
      
      if (userID && userName) {
        setUserInfo({
          userID,
          name: userName
        });
        return userID;
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
    return null;
  };

  // Fetch wallet balance from backend
  const fetchWalletBalance = async (userID: string) => {
    try {
      console.log('🔍 Fetching wallet balance for user:', userID);
      
      // Fetch both database balance and live blockchain balance
      const [dbResponse, liveResponse] = await Promise.all([
        apiClient.getWalletBalance(userID, false), // Database balance
        apiClient.getWalletBalance(userID, true)   // Live blockchain balance
      ]);

      console.log('💾 Database balance response:', dbResponse);
      console.log('🔗 Live blockchain response:', liveResponse);

      if (dbResponse.success) {
        // Handle the actual API response structure
        const walletAddress = dbResponse.walletAddress || '';
        const dbBalance = dbResponse.balance?.databaseBalance || {};
        const liveBalance = dbResponse.balance?.onChainBalance || (liveResponse.success ? liveResponse.balance?.onChainBalance : null);
        
        // Use live balance if available, fallback to database
        const algoBalance = liveBalance?.algo || dbBalance.algo || 0;
        const usdcaBalance = liveBalance?.usdca || dbBalance.usdca || 0;
        
        console.log('💰 Parsed balances:', { algoBalance, usdcaBalance, walletAddress });
        
        setDashboardData(prev => ({
          ...prev,
          balanceUSDCa: usdcaBalance,
          balanceALGO: algoBalance,
          totalBalanceUSD: usdcaBalance + (algoBalance * 0.30), // Rough ALGO/USD rate
          walletAddress: walletAddress
        }));
        
        // Update user info with wallet address
        setUserInfo(prev => prev ? {
          ...prev,
          walletAddress: walletAddress
        } : null);
      } else {
        console.error('Failed to fetch wallet balance:', dbResponse.error);
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
      if (userInfo?.userID) {
        await fetchWalletBalance(userInfo.userID);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
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
      title: 'Plant Seeds',
      subtitle: 'Add more funds',
      icon: Plus,
      color: '#58CC02',
      bgColor: '#E8F5E8',
      onPress: () => router.push('/deposit')
    },
    {
      title: 'Grow Garden',
      subtitle: 'Invest & earn',
      icon: TrendingUp,
      color: '#00D4AA',
      bgColor: '#E0F7FA',
      onPress: () => router.push('/(tabs)/invest')
    },
    {
      title: 'Harvest',
      subtitle: 'Withdraw funds',
      icon: ArrowDownLeft,
      color: '#FF9500',
      bgColor: '#FFF3E0',
      onPress: () => router.push('/withdraw')
    },
    {
      title: 'Learn & Grow',
      subtitle: 'Financial tips',
      icon: Star,
      color: '#FFD900',
      bgColor: '#FFFDE7',
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
        colors={['#89E5AB', '#58CC02', '#46A302']}
        style={styles.gradient}
      >
        {/* Floating Plant Decorations */}
        <View style={styles.decorationContainer}>
          <View style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}>
            <Leaf size={20} color="#FFFFFF" />
          </View>
          <View style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}>
            <Flower size={16} color="#FFFFFF" />
          </View>
          <View style={[styles.plantDecor, { top: 200, left: width - 80, opacity: 0.25 }]}>
            <Sprout size={18} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
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
                <Bell size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Settings size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Money Tree Level Card */}
          <View style={styles.treeCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.treeCardGradient}
            >
              <View style={styles.treeHeader}>
                <View style={styles.treeIconContainer}>
                  <TreePine size={32} color="#58CC02" />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{dashboardData.moneyTreeLevel}</Text>
                  </View>
                </View>
                <View style={styles.treeInfo}>
                  <Text style={styles.treeTitle}>Your Money Tree</Text>
                  <Text style={styles.treeSubtitle}>Level {dashboardData.moneyTreeLevel} • {dashboardData.plantsGrown} plants grown</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(dashboardData.totalBalanceUSD / dashboardData.nextMilestone) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  ${dashboardData.totalBalanceUSD.toFixed(2)} / ${dashboardData.nextMilestone} to next level
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.balanceCardGradient}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Your Garden Value</Text>
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
                {balanceVisible ? `$${dashboardData.totalBalanceUSD.toFixed(2)}` : '••••••'}
              </Text>
              
              {/* Asset Breakdown */}
              {balanceVisible && (
                <View style={styles.assetsBreakdown}>
                  <View style={styles.assetItem}>
                    <View style={styles.assetIcon}>
                      <Text style={styles.assetSymbol}>💰</Text>
                    </View>
                    <Text style={styles.assetLabel}>USDCa</Text>
                    <Text style={styles.assetAmount}>${dashboardData.balanceUSDCa.toFixed(2)}</Text>
                  </View>
                  <View style={styles.assetItem}>
                    <View style={styles.assetIcon}>
                      <Text style={styles.assetSymbol}>⚡</Text>
                    </View>
                    <Text style={styles.assetLabel}>ALGO</Text>
                    <Text style={styles.assetAmount}>{dashboardData.balanceALGO.toFixed(2)}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.yieldContainer}>
                <View style={styles.yieldItem}>
                  <Zap size={16} color="#58CC02" />
                  <Text style={styles.yieldLabel}>Today's Growth</Text>
                  <Text style={styles.yieldValue}>+${dashboardData.dailyYield.toFixed(2)}</Text>
                </View>
                <View style={styles.yieldDivider} />
                <View style={styles.yieldItem}>
                  <Target size={16} color="#FF9500" />
                  <Text style={styles.yieldLabel}>Wallet</Text>
                  <Text style={styles.yieldValue}>
                    {dashboardData.walletAddress ? '✅' : '⏳'}
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
                    color={achievement.completed ? "#58CC02" : "#C0C0C0"} 
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
                    <action.icon size={24} color="#FFFFFF" />
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
                    { backgroundColor: activity.type === 'yield_credit' ? '#E8F5E8' : '#E0F7FA' }
                  ]}>
                    <activity.icon size={20} color="#58CC02" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                  </View>
                  <View style={styles.activityAmount}>
                    <Text style={[
                      styles.activityAmountText,
                      { color: activity.type === 'yield_credit' ? '#58CC02' : '#FF9500' }
                    ]}>
                      {activity.type === 'yield_credit' ? '+' : ''}${activity.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
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
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
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
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
  yieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yieldDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  yieldLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  yieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 'auto',
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
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 24,
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
});