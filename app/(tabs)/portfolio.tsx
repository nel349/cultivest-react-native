import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Wallet, Calendar, ArrowUpRight } from 'lucide-react-native';

export default function PortfolioScreen() {
  const [timeframe, setTimeframe] = useState('1W');

  const portfolioData = {
    totalValue: 127.45,
    totalGain: 12.87,
    gainPercentage: 11.2,
    positions: [
      {
        id: '1',
        name: 'USDCa Yield Pool',
        amount: 102.45,
        apy: 2.5,
        dailyYield: 0.007,
        status: 'active',
        startDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'ALGO Staking',
        amount: 25.00,
        apy: 4.2,
        dailyYield: 0.003,
        status: 'active',
        startDate: '2024-01-20'
      }
    ],
    recentYields: [
      { date: '2024-01-25', amount: 0.31 },
      { date: '2024-01-24', amount: 0.29 },
      { date: '2024-01-23', amount: 0.28 },
      { date: '2024-01-22', amount: 0.30 },
      { date: '2024-01-21', amount: 0.27 }
    ]
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color="#8B9DC3" />
          </TouchableOpacity>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1A2332', '#2A3441']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
              <View style={styles.gainIndicator}>
                <TrendingUp size={16} color="#00D4AA" />
                <Text style={styles.gainText}>
                  +${portfolioData.totalGain.toFixed(2)} ({portfolioData.gainPercentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
            <Text style={styles.totalValue}>
              ${portfolioData.totalValue.toFixed(2)}
            </Text>
            
            {/* Timeframe Selector */}
            <View style={styles.timeframeSelector}>
              {timeframes.map((tf) => (
                <TouchableOpacity
                  key={tf}
                  style={[
                    styles.timeframeButton,
                    timeframe === tf && styles.timeframeButtonActive
                  ]}
                  onPress={() => setTimeframe(tf)}
                >
                  <Text style={[
                    styles.timeframeText,
                    timeframe === tf && styles.timeframeTextActive
                  ]}>
                    {tf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Active Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Positions</Text>
          {portfolioData.positions.map((position) => (
            <TouchableOpacity key={position.id} style={styles.positionCard}>
              <LinearGradient
                colors={['#1A2332', '#2A3441']}
                style={styles.positionCardGradient}
              >
                <View style={styles.positionHeader}>
                  <View style={styles.positionInfo}>
                    <Text style={styles.positionName}>{position.name}</Text>
                    <Text style={styles.positionDate}>
                      Since {new Date(position.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.positionStats}>
                    <Text style={styles.positionAmount}>
                      ${position.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.positionApy}>
                      {position.apy}% APY
                    </Text>
                  </View>
                </View>
                
                <View style={styles.positionFooter}>
                  <View style={styles.dailyYield}>
                    <Text style={styles.dailyYieldLabel}>Daily Yield</Text>
                    <Text style={styles.dailyYieldAmount}>
                      +${position.dailyYield.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.positionStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Yields */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Yields</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <LinearGradient
            colors={['#1A2332', '#2A3441']}
            style={styles.yieldsCard}
          >
            {portfolioData.recentYields.map((yield_, index) => (
              <View
                key={yield_.date}
                style={[
                  styles.yieldItem,
                  index < portfolioData.recentYields.length - 1 && styles.yieldItemBorder
                ]}
              >
                <View style={styles.yieldLeft}>
                  <View style={styles.yieldIcon}>
                    <TrendingUp size={16} color="#00D4AA" />
                  </View>
                  <View>
                    <Text style={styles.yieldDate}>
                      {new Date(yield_.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.yieldDescription}>Daily yield earned</Text>
                  </View>
                </View>
                <Text style={styles.yieldAmount}>
                  +${yield_.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={['#00D4AA', '#00B4D8']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionText}>Add Funds</Text>
                <ArrowUpRight size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={['#1A2332', '#2A3441']}
                style={[styles.quickActionGradient, styles.secondaryAction]}
              >
                <Text style={[styles.quickActionText, styles.secondaryActionText]}>
                  Withdraw
                </Text>
                <ArrowUpRight size={16} color="#8B9DC3" />
              </LinearGradient>
            </TouchableOpacity>
          </div>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A2332',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8B9DC3',
    fontWeight: '500',
  },
  gainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gainText: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#0D1421',
    borderRadius: 12,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeframeButtonActive: {
    backgroundColor: '#00D4AA',
  },
  timeframeText: {
    fontSize: 14,
    color: '#8B9DC3',
    fontWeight: '600',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  positionCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  positionCardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  positionInfo: {
    flex: 1,
  },
  positionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  positionDate: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  positionStats: {
    alignItems: 'flex-end',
  },
  positionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  positionApy: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: '600',
  },
  positionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyYield: {
    flex: 1,
  },
  dailyYieldLabel: {
    fontSize: 12,
    color: '#8B9DC3',
    marginBottom: 2,
  },
  dailyYieldAmount: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  positionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D4AA',
  },
  statusText: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  yieldsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  yieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  yieldItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  yieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  yieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D4AA20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  yieldDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  yieldDescription: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  yieldAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionText: {
    color: '#8B9DC3',
  },
  bottomSpacing: {
    height: 100,
  },
});