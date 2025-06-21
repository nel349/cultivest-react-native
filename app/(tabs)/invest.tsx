import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Shield, Info, ArrowRight } from 'lucide-react-native';

export default function InvestScreen() {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('usdca-pool');

  const investmentPools = [
    {
      id: 'usdca-pool',
      name: 'USDCa Yield Pool',
      apy: '2.5%',
      risk: 'Low',
      description: 'Stable returns from USDCa lending',
      tvl: '$2.4M',
      color: '#00D4AA'
    },
    {
      id: 'algo-pool',
      name: 'ALGO Staking',
      apy: '4.2%',
      risk: 'Medium',
      description: 'Algorand consensus rewards',
      tvl: '$1.8M',
      color: '#00B4D8'
    }
  ];

  const quickAmounts = [1, 5, 10, 25, 50];

  const calculateYield = (amount: number, apy: number) => {
    return (amount * apy / 100 / 365).toFixed(4);
  };

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Invest</Text>
          <Text style={styles.subtitle}>
            Start earning yields on your stablecoins
          </Text>
        </View>

        {/* Investment Pools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Investment Pool</Text>
          {investmentPools.map((pool) => (
            <TouchableOpacity
              key={pool.id}
              style={[
                styles.poolCard,
                selectedPool === pool.id && styles.poolCardSelected
              ]}
              onPress={() => setSelectedPool(pool.id)}
            >
              <LinearGradient
                colors={['#1A2332', '#2A3441']}
                style={styles.poolCardGradient}
              >
                <View style={styles.poolHeader}>
                  <View style={styles.poolInfo}>
                    <Text style={styles.poolName}>{pool.name}</Text>
                    <Text style={styles.poolDescription}>{pool.description}</Text>
                  </View>
                  <View style={styles.poolStats}>
                    <Text style={[styles.poolApy, { color: pool.color }]}>
                      {pool.apy} APY
                    </Text>
                    <Text style={styles.poolRisk}>{pool.risk} Risk</Text>
                  </View>
                </View>
                <View style={styles.poolFooter}>
                  <Text style={styles.poolTvl}>TVL: {pool.tvl}</Text>
                  <View style={styles.poolBadge}>
                    <Shield size={12} color="#00D4AA" />
                    <Text style={styles.poolBadgeText}>GENIUS Act</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Investment Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Amount</Text>
          
          <LinearGradient
            colors={['#1A2332', '#2A3441']}
            style={styles.amountCard}
          >
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountTextInput}
                value={investmentAmount}
                onChangeText={setInvestmentAmount}
                placeholder="0.00"
                placeholderTextColor="#8B9DC3"
                keyboardType="numeric"
              />
              <Text style={styles.currencyLabel}>USD</Text>
            </View>
            
            <View style={styles.quickAmounts}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setInvestmentAmount(amount.toString())}
                >
                  <Text style={styles.quickAmountText}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Investment Summary */}
        {investmentAmount && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Summary</Text>
            
            <LinearGradient
              colors={['#1A2332', '#2A3441']}
              style={styles.summaryCard}
            >
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Investment Amount</Text>
                <Text style={styles.summaryValue}>${investmentAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Expected Daily Yield</Text>
                <Text style={styles.summaryValue}>
                  ${calculateYield(parseFloat(investmentAmount) || 0, 2.5)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>APY</Text>
                <Text style={[styles.summaryValue, { color: '#00D4AA' }]}>2.5%</Text>
              </View>
              
              <View style={styles.riskDisclaimer}>
                <Info size={16} color="#F59E0B" />
                <Text style={styles.disclaimerText}>
                  Investments carry risk. Past performance doesn't guarantee future results.
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Invest Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.investButton,
              !investmentAmount && styles.investButtonDisabled
            ]}
            disabled={!investmentAmount}
          >
            <LinearGradient
              colors={investmentAmount ? ['#00D4AA', '#00B4D8'] : ['#666', '#666']}
              style={styles.investButtonGradient}
            >
              <Text style={styles.investButtonText}>
                Invest ${investmentAmount || '0.00'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B9DC3',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  poolCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  poolCardSelected: {
    borderColor: '#00D4AA',
  },
  poolCardGradient: {
    borderRadius: 14,
    padding: 20,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  poolInfo: {
    flex: 1,
  },
  poolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  poolDescription: {
    fontSize: 14,
    color: '#8B9DC3',
  },
  poolStats: {
    alignItems: 'flex-end',
  },
  poolApy: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  poolRisk: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  poolFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poolTvl: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  poolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  poolBadgeText: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '600',
  },
  amountCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    padding: 0,
  },
  currencyLabel: {
    fontSize: 16,
    color: '#8B9DC3',
    fontWeight: '600',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: '#2A3441',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8B9DC3',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riskDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F59E0B20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
    lineHeight: 16,
  },
  investButton: {
    borderRadius: 12,
  },
  investButtonDisabled: {
    opacity: 0.5,
  },
  investButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  investButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
  },
});