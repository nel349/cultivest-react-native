import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Shield, ArrowRight, Leaf, Sprout, TreePine, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundingModal from '@/components/FundingModal';

const { width } = Dimensions.get('window');

export default function InvestScreen() {
  const [selectedPool, setSelectedPool] = useState('bitcoin-investment');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showFundingModal, setShowFundingModal] = useState(false);

  const investmentPools = [
    {
      id: 'bitcoin-investment',
      name: 'Bitcoin Investment ₿',
      apy: 'Market Returns',
      risk: 'High',
      description: 'Direct Bitcoin ownership - Digital gold for the future',
      tvl: 'Global Market',
      color: '#F7931A',
      icon: TrendingUp,
      bgColor: '#FFF8E1',
      isBitcoin: true
    },
    {
      id: 'stablecoin-pool',
      name: 'Stablecoins 🪙',
      apy: '4.5%',
      risk: 'Low',
      description: 'USDC, USDT, DAI - stable value with yield',
      tvl: '$12.4M',
      color: '#58CC02',
      icon: Leaf,
      bgColor: '#E8F5E8'
    },
    {
      id: 'ethereum-pool',
      name: 'Ethereum & L2s 🔥',
      apy: '6.2%',
      risk: 'Medium',
      description: 'ETH, MATIC, ARB - leading smart contracts',
      tvl: '$8.1M',
      color: '#00D4AA',
      icon: Sprout,
      bgColor: '#E0F7FA'
    },
    {
      id: 'altcoin-pool',
      name: 'Top Altcoins 🚀',
      apy: '8.8%',
      risk: 'High',
      description: 'SOL, ADA, DOT - high-growth potential',
      tvl: '$3.2M',
      color: '#FF9500',
      icon: TreePine,
      bgColor: '#FFF3E0'
    }
  ];

  const selectedPoolData = investmentPools.find(pool => pool.id === selectedPool);


  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userID = await AsyncStorage.getItem('user_id');
        const userName = await AsyncStorage.getItem('user_name');
        
        if (userID && userName) {
          setUserInfo({
            userID,
            name: userName
          });
          console.log('🔍 Invest screen loaded user info:', { userID, userName });
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };
    loadUserInfo();
  }, []);

  const handleInvestment = () => {
    // Open the FundingModal which handles amount selection, authentication, and both Bitcoin and other crypto
    setShowFundingModal(true);
  };

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
          <Text style={styles.title}>Bitcoin-First Investing ₿</Text>
          <Text style={styles.subtitle}>Pure Bitcoin or explore the broader crypto ecosystem</Text>
        </View>


        {/* Investment Options */}
        <View style={styles.poolsSection}>
          <Text style={styles.sectionTitle}>Bitcoin vs Crypto Ecosystem 📊</Text>
          
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


        {/* Invest Button */}
        <TouchableOpacity
          style={styles.investButton}
          onPress={handleInvestment}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.investButtonGradient}
          >
            <Text style={styles.investButtonText}>
              {selectedPoolData?.isBitcoin 
                ? 'Buy Bitcoin ₿'
                : `Buy ${selectedPoolData?.name || 'Crypto'} 🚀`
              }
            </Text>
            <ArrowRight size={20} color="#58CC02" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Funding Modal */}
      <FundingModal
        visible={showFundingModal}
        onClose={() => setShowFundingModal(false)}
        userID={userInfo?.userID}
        purchaseType={selectedPoolData?.isBitcoin ? 'bitcoin' : 'crypto'}
        onFundingInitiated={(transactionId) => {
          console.log('Funding initiated:', transactionId);
          const selectedPoolData = investmentPools.find(pool => pool.id === selectedPool);
          Alert.alert(
            selectedPoolData?.isBitcoin ? 'Bitcoin Purchase Started! ₿' : 'Crypto Purchase Started! 🚀',
            `Complete your payment with MoonPay. You'll receive ${selectedPoolData?.isBitcoin ? 'Bitcoin' : selectedPoolData?.name || 'cryptocurrency'} in your wallet.`,
            [
              {
                text: 'Got it!',
                onPress: () => {
                  setShowFundingModal(false);
                }
              }
            ]
          );
        }}
      />
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