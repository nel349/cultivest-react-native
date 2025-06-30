import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  TrendingUp,
  Zap,
  Coins,
  Target,
  Leaf,
  Sprout,
  ArrowRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundingModal from '@/components/FundingModal';

export default function InvestScreen() {
  const insets = useSafeAreaInsets();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<
    'bitcoin' | 'algorand' | 'other-crypto'
  >('bitcoin');
  const [fundingPurchaseType, setFundingPurchaseType] = useState<'bitcoin' | 'crypto'>('bitcoin');

  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userID = await AsyncStorage.getItem('user_id');
        const userName = await AsyncStorage.getItem('user_name');

        if (userID && userName) {
          setUserInfo({
            userID,
            name: userName,
          });
          console.log('🔍 Invest screen loaded user info:', {
            userID,
            userName,
          });
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };
    loadUserInfo();
  }, []);

  const investmentOptions = [
    {
      id: 'bitcoin',
      title: 'Bitcoin Investment ₿',
      subtitle: 'Digital gold - Store of value',
      icon: TrendingUp,
      color: '#F7931A',
      bgColor: '#FFF8E1',
      description:
        "Start with Bitcoin, the world's most trusted cryptocurrency",
      features: [
        '✓ Direct Bitcoin ownership',
        '✓ Portfolio NFT tracking',
        '✓ Start from $1',
      ],
      isPrimary: true,
    },
    {
      id: 'algorand',
      title: 'Algorand Ecosystem ⚡',
      subtitle: 'Fast, green blockchain',
      icon: Zap,
      color: '#00D4AA',
      bgColor: '#E0F7FA',
      description: "Invest in Algorand's sustainable and scalable blockchain",
      features: [
        '✓ Carbon-negative blockchain',
        '✓ Portfolio NFT host',
        '✓ USDC support',
      ],
      isPrimary: true,
    },
    {
      id: 'other-crypto',
      title: 'Other Cryptocurrencies 🚀',
      subtitle: 'Ethereum, Solana & More',
      icon: Coins,
      color: '#9945FF',
      bgColor: '#F3E8FF',
      description: 'Access 50+ cryptocurrencies through MoonPay integration',
      features: [
        '✓ Ethereum, Solana, USDC',
        '✓ Instant purchase',
        '✓ Secure custody',
      ],
      isPrimary: false,
    },
  ];

  const handleInvestment = () => {
    // Set purchase type based on selected asset
    if (selectedAsset === 'bitcoin') {
      setFundingPurchaseType('bitcoin');
    } else {
      setFundingPurchaseType('crypto');
    }
    setShowFundingModal(true);
  };

  const selectedOption = investmentOptions.find(
    (option) => option.id === selectedAsset
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={['#89E5AB', '#58CC02', '#46A302']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Floating Plant Decorations */}
        <View style={styles.decorationContainer}>
          <View
            style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}
          >
            <Leaf size={20} color="#FFFFFF" />
          </View>
          <View
            style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}
          >
            <Sprout size={16} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#2E7D32" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Start Investing</Text>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Grow Your Digital Garden 🌱</Text>
            <Text style={styles.subtitle}>
              Bitcoin-first investing with Portfolio NFTs
            </Text>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.quickButtonsContainer}>
            <TouchableOpacity
              style={[styles.investButton, styles.primaryButton]}
              onPress={handleInvestment}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F0F0F0']}
                style={styles.investButtonGradient}
              >
                <Text style={styles.investButtonText}>
                  <Text>Buy </Text>
                  <Text style={styles.bitcoinBText}>₿</Text>
                  <Text>itcoin</Text>
                </Text>
                <ArrowRight size={20} color="#58CC02" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.investButton, styles.secondaryButton]}
              onPress={() => {
                setSelectedAsset('other-crypto');
                setFundingPurchaseType('crypto'); // Always crypto for "Buy Crypto" button
                setShowFundingModal(true);
              }}
            >
              <LinearGradient
                colors={['#9945FF', '#7C3AED']}
                style={styles.investButtonGradient}
              >
                <Text
                  style={[styles.investButtonText, styles.secondaryButtonText]}
                >
                  Buy Crypto
                </Text>
                <Coins size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Investment Options */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>
              Choose Your Investment Path 🚀
            </Text>

            {investmentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedAsset === option.id && styles.optionCardSelected,
                ]}
                onPress={() =>
                  setSelectedAsset(
                    option.id as 'bitcoin' | 'algorand' | 'other-crypto'
                  )
                }
              >
                <View
                  style={[
                    styles.optionCardContent,
                    { backgroundColor: option.bgColor },
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: option.color },
                      ]}
                    >
                      <option.icon size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionSubtitle}>
                        {option.subtitle}
                      </Text>
                    </View>
                    {selectedAsset === option.id && (
                      <View style={styles.selectedBadge}>
                        <Target size={16} color="#58CC02" />
                      </View>
                    )}
                  </View>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>

                  <View style={styles.featuresContainer}>
                    {option.features.map((feature, index) => (
                      <Text key={index} style={styles.featureText}>
                        {feature}
                      </Text>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.statsCardGradient}
            >
              <View style={styles.statsHeader}>
                <Coins size={20} color="#58CC02" />
                <Text style={styles.statsTitle}>Why Cultivest?</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>$1</Text>
                  <Text style={styles.statLabel}>Minimum</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>24/7</Text>
                  <Text style={styles.statLabel}>Trading</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>Secure</Text>
                  <Text style={styles.statLabel}>Custody</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Funding Modal */}
        <FundingModal
          visible={showFundingModal}
          onClose={() => setShowFundingModal(false)}
          userID={userInfo?.userID || ''}
          purchaseType={fundingPurchaseType}
          onFundingInitiated={() => {
            console.log('Funding initiated');
            Alert.alert(
              'Investment Started! 🚀',
              `You can now purchase ${selectedOption?.title.toLowerCase()} through MoonPay. Your digital garden is growing!`,
              [
                {
                  text: 'Got it!',
                  onPress: () => {
                    setShowFundingModal(false);
                    // Could navigate back to dashboard
                    router.push('/(tabs)');
                  },
                },
              ]
            );
          }}
        />
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
    alignItems: 'center',
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
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
    paddingHorizontal: 20,
  },
  optionsSection: {
    marginBottom: 24,
    marginTop: 8,
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
  optionCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionCardSelected: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  optionCardContent: {
    borderRadius: 20,
    padding: 20,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 12,
  },
  featuresContainer: {
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#58CC02',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '600',
  },
  investButton: {
    borderRadius: 20,
    marginBottom: 16,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
  quickButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  bitcoinBText: {
    color: '#F7931A',
  },
});
