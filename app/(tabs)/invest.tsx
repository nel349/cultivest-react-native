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
  ArrowRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FundingModal from '@/components/FundingModal';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

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
      color: Colors.crypto.bitcoin,
      bgColor: Colors.background.tertiary,
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
      color: Colors.crypto.algorand,
      bgColor: Colors.background.tertiary,
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
      color: Colors.crypto.solana,
      bgColor: Colors.background.tertiary,
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
        colors={Colors.gradients.backgroundPrimary}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
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
              <ArrowLeft size={20} color={Colors.text.primary} />
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
                colors={Colors.gradients.primary}
                style={styles.investButtonGradient}
              >
                <Text style={styles.investButtonText}>
                  <Text>Buy </Text>
                  <Text style={styles.bitcoinBText}>₿</Text>
                  <Text>itcoin</Text>
                </Text>
                <ArrowRight size={20} color={Colors.brand.white} />
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
                colors={[Colors.crypto.solana, Colors.crypto.ethereum]}
                style={styles.investButtonGradient}
              >
                <Text
                  style={[styles.investButtonText, styles.secondaryButtonText]}
                >
                  Buy Crypto
                </Text>
                <Coins size={20} color={Colors.brand.white} />
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
                      <option.icon size={24} color={Colors.brand.white} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionSubtitle}>
                        {option.subtitle}
                      </Text>
                    </View>
                    {selectedAsset === option.id && (
                      <View style={styles.selectedBadge}>
                        <Target size={16} color={Colors.brand.green} />
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
              colors={[Colors.background.secondary, Colors.background.tertiary]}
              style={styles.statsCardGradient}
            >
              <View style={styles.statsHeader}>
                <Coins size={20} color={Colors.brand.green} />
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
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
    ...Shadow.sm,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: Typography.weight.medium,
    paddingHorizontal: Spacing.lg,
  },
  optionsSection: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  optionCard: {
    marginBottom: Spacing.base,
    borderRadius: 20,
    ...Shadow.md,
  },
  optionCardSelected: {
    ...Shadow.lg,
    borderWidth: 2,
    borderColor: Colors.brand.green,
  },
  optionCardContent: {
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand.green,
  },
  optionDescription: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.sm,
  },
  featuresContainer: {
    gap: Spacing.xs,
  },
  featureText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  statsCard: {
    marginBottom: Spacing.xl,
    borderRadius: 20,
    ...Shadow.md,
  },
  statsCardGradient: {
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  statsTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.green,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.semibold,
  },
  investButton: {
    borderRadius: 20,
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
    ...Shadow.lg,
  },
  investButtonGradient: {
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  investButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.white,
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  secondaryButtonText: {
    color: Colors.brand.white,
  },
  bitcoinBText: {
    color: Colors.crypto.bitcoin,
  },
});
