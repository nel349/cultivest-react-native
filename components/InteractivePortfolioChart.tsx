import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const chartWidth = width - 48;
const chartHeight = 200;

interface DataPoint {
  timestamp: number;
  value: number;
}

interface InteractivePortfolioChartProps {
  data: DataPoint[];
  currentValue: number;
  totalGain: number;
  gainPercent: number;
}

export function InteractivePortfolioChart({ 
  data, 
  currentValue, 
  totalGain, 
  gainPercent 
}: InteractivePortfolioChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('1W');
  const [animatedValue] = useState(new Animated.Value(0));
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  const periods = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
  ];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [data]);

  const generatePath = () => {
    if (data.length < 2) return '';

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: point.value, timestamp: point.timestamp };
    });

    const pathData = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      const prevPoint = points[index - 1];
      const cpx1 = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cpy1 = prevPoint.y;
      const cpx2 = point.x - (point.x - prevPoint.x) / 3;
      const cpy2 = point.y;
      return `${path} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
    }, '');

    return pathData;
  };

  const isPositive = totalGain >= 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.cardGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.currentValue}>
              ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.gainContainer}>
              <Text style={[styles.gain, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                {isPositive ? '+' : ''}${Math.abs(totalGain).toFixed(2)}
              </Text>
              <Text style={[styles.gainPercent, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                ({isPositive ? '+' : ''}{gainPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
          
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.value && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period.value)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.value && styles.periodButtonTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <Animated.View
            style={{
              opacity: animatedValue,
              transform: [{
                scaleY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              }],
            }}
          >
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
                  <Stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.05" />
                </SvgLinearGradient>
              </Defs>
              
              {/* Area under curve */}
              <Path
                d={`${generatePath()} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                fill="url(#gradient)"
              />
              
              {/* Main line */}
              <Path
                d={generatePath()}
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {data.map((point, index) => {
                const maxValue = Math.max(...data.map(d => d.value));
                const minValue = Math.min(...data.map(d => d.value));
                const valueRange = maxValue - minValue || 1;
                const x = (index / (data.length - 1)) * chartWidth;
                const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
                
                return (
                  <Circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={isPositive ? "#10B981" : "#EF4444"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          </Animated.View>
        </View>

        {/* Chart Info */}
        <View style={styles.chartInfo}>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.infoLabel}>Portfolio Value</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoDot, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.infoLabel}>Benchmark</Text>
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
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  gainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gain: {
    fontSize: 16,
    fontWeight: '700',
  },
  gainPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#1F2937',
  },
  chartContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chartInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});