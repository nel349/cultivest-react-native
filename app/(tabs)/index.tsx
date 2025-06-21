import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Eye, EyeOff, Plus, TrendingUp, Leaf, DollarSign, 
  ArrowUpRight, ArrowDownLeft, Bell, Settings 
} from 'lucide-react-native';
import { BalanceCard } from '@/components/BalanceCard';
import { MoneyTreeCard } from '@/components/MoneyTreeCard';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { RecentActivity } from '@/components/RecentActivity';
import { YieldSummary } from '@/components/YieldSummary';

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    balance: 127.45,
    dailyYield: 0.31,
    totalYieldEarned: 12.87,
    moneyTreeLeaves: 8,
    weeklyGrowth: 2.4,
    investmentStreak: 12
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    {
      title: 'Add Funds',
      subtitle: 'Deposit via MoonPay',
      icon: Plus,
      color: '#00D4AA',
      onPress: () => router.push('/deposit')
    },
    {
      title: 'Invest',
      subtitle: '2.5% APY USDCa',
      icon: TrendingUp,
      color: '#00B4D8',
      onPress: () => router.push('/(tabs)/invest')
    },
    {
      title: 'Withdraw',
      subtitle: 'To bank account',
      icon: ArrowUpRight,
      color: '#8B5CF6',
      onPress: () => router.push('/withdraw')
    },
    {
      title: 'Learn',
      subtitle: 'Earn badges',
      icon: Leaf,
      color: '#F59E0B',
      onPress: () => router.push('/education')
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'yield_credit',
      amount: 0.31,
      description: 'Daily yield earned',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'investment',
      amount: 25.00,
      description: 'Invested in USDCa Pool',
      timestamp: 'Yesterday',
      status: 'completed'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 50.00,
      description: 'MoonPay deposit',
      timestamp: '2 days ago',
      status: 'completed'
    }
  ];

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332', '#0D1421']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>Sarah</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color="#8B9DC3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color="#8B9DC3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={dashboardData.balance}
          dailyYield={dashboardData.dailyYield}
          balanceVisible={balanceVisible}
          onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
        />

        {/* Money Tree & Yield Summary */}
        <View style={styles.summaryRow}>
          <MoneyTreeCard
            leaves={dashboardData.moneyTreeLeaves}
            weeklyGrowth={dashboardData.weeklyGrowth}
          />
          <YieldSummary
            totalYieldEarned={dashboardData.totalYieldEarned}
            investmentStreak={dashboardData.investmentStreak}
          />
        </View>

        {/* Quick Actions */}
        <QuickActionsGrid actions={quickActions} />

        {/* Recent Activity */}
        <RecentActivity transactions={recentTransactions} />

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#8B9DC3',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A2332',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  bottomSpacing: {
    height: 100,
  },
});