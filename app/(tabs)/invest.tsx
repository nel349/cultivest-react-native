import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Shield, Info, ArrowRight, Leaf, Sprout, TreePine, Star, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function InvestScreen() {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('usdca-pool');

  const investmentPools = [
    {
      id: 'usdca-pool',
      name: 'Stable Garden 🌿',
      apy: '2.5%',
      risk: 'Low',
      description: 'Steady growth from stable yields',
      tvl: '$2.4M',
      color: '#58CC02',
      icon: Leaf,
      bgColor: '#E8F5E8'
    },
    {
      id: 'algo-pool',
      name: 'Growth Sprouts 🌱',
      apy: '4.2%',
      risk: 'Medium',
      description: 'Higher yields with moderate risk',
      tvl: '$1.8M',
      color: '#00D4AA',
      icon: Sprout,
      bgColor: '#E0F7FA'
    },
    {
      id: 'premium-pool',
      name: 'Money Tree Forest 🌳',
      apy: '6.8%',
      risk: 'High',
      description: 'Premium yields for experienced gardeners',
      tvl: '$960K',
      color: '#FF9500',
      icon: TreePine,
      bgColor: '#FFF3E0'
    }
  ];

  const quickAmounts = ['$25', '$50', '$100'];

  const selectedPoolData = investmentPools.find(pool => pool.id === selectedPool);

  const calculateEstimate = () => {
    const amount = parseFloat(investmentAmount) || 0;
    const apy = parseFloat(selectedPoolData?.apy || '0') / 100;
    const dailyRate = apy / 365;
    return {
      daily: amount * dailyRate,
      monthly: amount * (apy / 12),
      yearly: amount * apy
    };
  };

  const estimates = calculateEstimate();

  return (
    <LinearGradient
      colors={['#89E5AB', '#58CC02', '#46A302']}
      style={styles.container}
    >
      {/* Floating Plant Decorations */}
      <View style={styles.decorationContainer}>
        <View style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}>
          <Leaf size={20} color="#FFFFFF" />
        </View>
        <View style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}>
          <Sprout size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.plantDecor, { top: 200, left: width - 80, opacity: 0.25 }]}>
          <TreePine size={18} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Grow Your Garden 🌱</Text>
          <Text style={styles.subtitle}>Plant seeds and watch your wealth bloom</Text>
        </View>

        {/* Investment Amount Card */}
        <View style={styles.amountCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F8F8']}
            style={styles.amountCardGradient}
          >
            <Text style={styles.amountLabel}>How much would you like to plant?</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={investmentAmount}
                onChangeText={setInvestmentAmount}
                placeholder="0"
                placeholderTextColor="#C0C0C0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.quickAmountsContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setInvestmentAmount(amount.substring(1))}
                >
                  <Text style={styles.quickAmountText}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Garden Selection */}
        <View style={styles.poolsSection}>
          <Text style={styles.sectionTitle}>Choose Your Garden 🌻</Text>
          
          {investmentPools.map((pool) => (
            <TouchableOpacity
              key={pool.id}
              style={[
                styles.poolCard,
                selectedPool === pool.id && styles.poolCardSelected
              ]}
              onPress={() => setSelectedPool(pool.id)}
            >
              <View style={[styles.poolCardContent, { backgroundColor: pool.bgColor }]}>
                <View style={styles.poolHeader}>
                  <View style={[styles.poolIcon, { backgroundColor: pool.color }]}>
                    <pool.icon size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.poolInfo}>
                    <Text style={styles.poolName}>{pool.name}</Text>
                    <Text style={styles.poolDescription}>{pool.description}</Text>
                  </View>
                  <View style={styles.poolStats}>
                    <Text style={styles.poolApy}>{pool.apy}</Text>
                    <Text style={styles.poolApyLabel}>APY</Text>
                  </View>
                </View>
                
                <View style={styles.poolDetails}>
                  <View style={styles.poolDetail}>
                    <Shield size={16} color="#5A5A5A" />
                    <Text style={styles.poolDetailText}>Risk: {pool.risk}</Text>
                  </View>
                  <View style={styles.poolDetail}>
                    <TrendingUp size={16} color="#5A5A5A" />
                    <Text style={styles.poolDetailText}>TVL: {pool.tvl}</Text>
                  </View>
                </View>

                {selectedPool === pool.id && (
                  <View style={styles.selectedIndicator}>
                    <Star size={16} color="#58CC02" />
                    <Text style={styles.selectedText}>Selected Garden</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Growth Estimates */}
        {investmentAmount && (
          <View style={styles.estimatesCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.estimatesCardGradient}
            >
              <View style={styles.estimatesHeader}>
                <Zap size={20} color="#58CC02" />
                <Text style={styles.estimatesTitle}>Growth Forecast</Text>
              </View>
              
              <View style={styles.estimatesGrid}>
                <View style={styles.estimateItem}>
                  <Text style={styles.estimateLabel}>Daily</Text>
                  <Text style={styles.estimateValue}>+${estimates.daily.toFixed(3)}</Text>
                </View>
                <View style={styles.estimateItem}>
                  <Text style={styles.estimateLabel}>Monthly</Text>
                  <Text style={styles.estimateValue}>+${estimates.monthly.toFixed(2)}</Text>
                </View>
                <View style={styles.estimateItem}>
                  <Text style={styles.estimateLabel}>Yearly</Text>
                  <Text style={styles.estimateValue}>+${estimates.yearly.toFixed(2)}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Invest Button */}
        <TouchableOpacity
          style={[
            styles.investButton,
            (!investmentAmount || parseFloat(investmentAmount) <= 0) && styles.investButtonDisabled
          ]}
          disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.investButtonGradient}
          >
            <Text style={styles.investButtonText}>
              Plant ${investmentAmount || '0'} Seeds 🌱
            </Text>
            <ArrowRight size={20} color="#58CC02" />
          </LinearGradient>
        </TouchableOpacity>

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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  amountCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dollarSign: {
    fontSize: 36,
    fontWeight: '700',
    color: '#58CC02',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
    minWidth: 120,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#58CC02',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
  },
  poolsSection: {
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
  poolCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poolCardSelected: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  poolCardContent: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  poolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  poolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  poolInfo: {
    flex: 1,
  },
  poolName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  poolDescription: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  poolStats: {
    alignItems: 'flex-end',
  },
  poolApy: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E7D32',
  },
  poolApyLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '600',
  },
  poolDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poolDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  poolDetailText: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#58CC02',
  },
  estimatesCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  estimatesCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  estimatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  estimatesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  estimatesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estimateItem: {
    alignItems: 'center',
  },
  estimateLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
    marginBottom: 4,
  },
  estimateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  investButton: {
    marginHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  investButtonDisabled: {
    opacity: 0.5,
  },
  investButtonGradient: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  investButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  bottomSpacing: {
    height: 100,
  },
});