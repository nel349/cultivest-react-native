import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
}

interface LivePriceTickerProps {
  prices: PriceData[];
}

export function LivePriceTicker({ prices }: LivePriceTickerProps) {
  const [animatedValues] = useState(() => 
    prices.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate price updates
    const animations = animatedValues.map((animValue, index) => {
      return Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(100, animations).start();
  }, [prices]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Prices</Text>
      <View style={styles.tickerContainer}>
        {prices.map((price, index) => (
          <Animated.View
            key={price.symbol}
            style={[
              styles.priceCard,
              {
                transform: [{
                  scale: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.priceHeader}>
              <Text style={styles.symbol}>{price.symbol}</Text>
              <View style={[
                styles.changeIndicator,
                { backgroundColor: price.changePercent >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {price.changePercent >= 0 ? (
                  <TrendingUp size={12} color="#FFFFFF" />
                ) : (
                  <TrendingDown size={12} color="#FFFFFF" />
                )}
              </View>
            </View>
            
            <Text style={styles.price}>
              ${price.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: price.price < 1 ? 6 : 2,
              })}
            </Text>
            
            <Text style={[
              styles.change,
              { color: price.changePercent >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 24,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  priceCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  changeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});