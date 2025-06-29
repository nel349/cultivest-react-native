import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, RefreshCw, TrendingUp, Zap } from 'lucide-react-native';

interface BalanceData {
  total: number;
  bitcoin: { amount: number; value: number; change: number };
  algorand: { amount: number; value: number; change: number };
  usdc: { amount: number; value: number; change: number };
  solana: { amount: number; value: number; change: number };
}

interface RealTimeBalanceCardProps {
  balance: BalanceData;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function RealTimeBalanceCard({
  balance,
  isVisible,
  onToggleVisibility,
  onRefresh,
  isRefreshing,
}: RealTimeBalanceCardProps) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [refreshRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Pulse animation for balance updates
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    pulse.start();
  }, [balance.total]);

  useEffect(() => {
    if (isRefreshing) {
      const rotation = Animated.loop(
        Animated.timing(refreshRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();
    } else {
      refreshRotation.setValue(0);
    }
  }, [isRefreshing]);

  const rotateInterpolate = refreshRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const assets = [
    {
      symbol: '₿',
      name: 'Bitcoin',
      amount: balance.bitcoin.amount,
      value: balance.bitcoin.value,
      change: balance.bitcoin.change,
      color: '#F7931A',
    },
    {
      symbol: '⚡',
      name: 'ALGO',
      amount: balance.algorand.amount,
      value: balance.algorand.value,
      change: balance.algorand.change,
      color: '#00D4AA',
    },
    {
      symbol: '💵',
      name: 'USDC',
      amount: balance.usdc.amount,
      value: balance.usdc.value,
      change: balance.usdc.change,
      color: '#2775CA',
    },
    {
      symbol: '🌟',
      name: 'SOL',
      amount: balance.solana.amount,
      value: balance.solana.value,
      change: balance.solana.change,
      color: '#9945FF',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.cardGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.label}>Total Portfolio Value</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onRefresh}
              disabled={isRefreshing}
            >
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <RefreshCw size={20} color="#58CC02" />
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onToggleVisibility}
            >
              {isVisible ? (
                <Eye size={20} color="#58CC02" />
              ) : (
                <EyeOff size={20} color="#58CC02" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Balance */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Text style={styles.totalBalance}>
            {isVisible ? `$${balance.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
          </Text>
        </Animated.View>

        {/* Asset Breakdown */}
        {isVisible && (
          <View style={styles.assetsContainer}>
            {assets.map((asset, index) => (
              <View key={asset.name} style={styles.assetRow}>
                <View style={styles.assetLeft}>
                  <View style={[styles.assetIcon, { backgroundColor: `${asset.color}20` }]}>
                    <Text style={[styles.assetSymbol, { color: asset.color }]}>
                      {asset.symbol}
                    </Text>
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetAmount}>
                      {asset.amount.toFixed(asset.name === 'Bitcoin' ? 8 : 2)} {asset.name === 'Bitcoin' ? 'BTC' : asset.name}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.assetRight}>
                  <Text style={styles.assetValue}>
                    ${asset.value.toFixed(2)}
                  </Text>
                  <View style={styles.assetChange}>
                    <TrendingUp 
                      size={12} 
                      color={asset.change >= 0 ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={[
                      styles.assetChangeText,
                      { color: asset.change >= 0 ? '#10B981' : '#EF4444' }
                    ]}>
                      {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Performance Indicator */}
        <View style={styles.performanceContainer}>
          <View style={styles.performanceItem}>
            <Zap size={16} color="#F59E0B" />
            <Text style={styles.performanceLabel}>24h Performance</Text>
            <Text style={styles.performanceValue}>+2.34%</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBalance: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 24,
  },
  assetsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetSymbol: {
    fontSize: 18,
    fontWeight: '700',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  assetAmount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  assetChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assetChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  performanceContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
});