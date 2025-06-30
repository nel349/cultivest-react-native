import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  AccessibilityInfo,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Bitcoin,
  Coins,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  Zap,
  Award,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Import crypto icons and logo
const cryptoIcons = {
  bitcoin: require('@/assets/images/crypto/bitcoin.png'),
  algorand: require('@/assets/images/crypto/algorand.png'),
  solana: require('@/assets/images/crypto/solana.png'),
  usdc: require('@/assets/images/crypto/usdc.png'),
};

const cultivestLogo = require('@/assets/images/cultivest-logo.png');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(false);
  // const [isVoiceGuideActive, setIsVoiceGuideActive] = useState(false);
  
  // Announce screen load for screen readers
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      'Welcome to Cultivest. The first Bitcoin and Algorand investment platform with Portfolio NFTs. Start investing with just one dollar.'
    );
  }, []);

  // Development bypass function
  const devBypass = async () => {
    // Using the user ID from our earlier backend test
    const devUserID = '045b5515-f334-436b-93b5-cc03fbcf8071';
    const devUserName = 'Norman E. Lopez';

    // Real JWT token from our test session
    const realToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNDViNTUxNS1mMzM0LTQzNmItOTNiNS1jYzAzZmJjZjgwNzEiLCJwaG9uZU51bWJlciI6IisxOTE1NDA4MjAzNiIsImlhdCI6MTc1MTA5MzgzMCwiZXhwIjoxNzUxMTgwMjMwfQ.fx4-UxaqsIAEHY8p_bxeq9wuf1WdlOdQY3bczK1Wohw';

    try {
      await AsyncStorage.setItem('auth_token', realToken);
      await AsyncStorage.setItem('user_id', devUserID);
      await AsyncStorage.setItem('user_name', devUserName);

      console.log('🚀 Dev bypass: Logged in as:', devUserName, devUserID);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Dev bypass failed:', error);
    }
  };

  const features = [
    {
      icon: Bitcoin,
      title: 'Bitcoin Investment',
      description: 'Start with $1 in Bitcoin via MoonPay',
      color: Colors.crypto.bitcoin,
      accessibilityLabel: 'Bitcoin Investment feature',
      accessibilityHint:
        'Learn how to start investing in Bitcoin with just one dollar',
    },
    {
      icon: Coins,
      title: 'Multi-Chain Portfolio',
      description: 'Bitcoin + Algorand investments',
      color: Colors.crypto.algorand,
      accessibilityLabel: 'Multi-Chain Portfolio feature',
      accessibilityHint:
        'Discover how to invest across Bitcoin and Algorand blockchains',
    },
    {
      icon: Award,
      title: 'Portfolio NFTs',
      description: 'Your investments become tradeable NFTs',
      color: Colors.brand.green,
      accessibilityLabel: 'Portfolio NFTs feature',
      accessibilityHint:
        'Revolutionary NFT system that makes your portfolio tradeable and inheritable',
    },
    {
      icon: Shield,
      title: 'Custodial Security',
      description: 'Professional custody with self-custody opt-in',
      color: Colors.status.error,
      accessibilityLabel: 'Custodial Security feature',
      accessibilityHint:
        'Secure professional custody with option to graduate to self-custody',
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={styles.container}
        accessibilityLabel="Cultivest welcome screen"
      >
        <LinearGradient
          colors={Colors.gradients.backgroundPrimary}
          style={[styles.gradient, { paddingTop: insets.top }]}
          accessible={false}
        >
          {/* Bolt.new Badge - Top Right */}
          <TouchableOpacity
            style={[styles.boltBadge, { top: 20 + insets.top, right: 20 }]}
            onPress={() => Linking.openURL('https://bolt.new/')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Built with Bolt.new"
            accessibilityHint="Opens Bolt.new website in browser"
          >
            <Image
              source={require('@/assets/images/bolt/white_circle_360x360.png')}
              style={styles.boltBadgeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>


          <View
            style={styles.content}
            accessible={false}
            accessibilityLabel="Welcome screen content"
          >
            {/* Hero Section */}
            <View
              style={styles.heroSection}
              accessible={true}
              accessibilityLabel="Cultivest app introduction"
            >
              <View
                style={styles.logoContainer}
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Cultivest logo"
              >
                <View style={styles.logoBackground}>
                  <Image 
                    source={cultivestLogo} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* <Text
                style={styles.title}
                accessible={true}
                accessibilityRole="header"
                accessibilityLabel="Cultivest"
              >
                Cultivest
              </Text> */}
              <Text
                style={styles.subtitle}
                accessible={true}
                accessibilityLabel="The first Bitcoin and Algorand investment platform with Portfolio NFTs"
              >
                The first Bitcoin + Algorand investment platform with Portfolio
                NFTs 🏆
              </Text>


            </View>

            {/* Features Grid */}
            <View
              style={styles.featuresContainer}
              accessible={false}
              accessibilityLabel="App features"
            >
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={styles.featureCard}
                  accessible={true}
                  accessibilityRole="summary"
                  accessibilityLabel={feature.accessibilityLabel}
                  accessibilityHint={feature.accessibilityHint}
                >
                  <View
                    style={[
                      styles.featureIcon,
                      { backgroundColor: feature.color + '20' },
                    ]}
                    accessible={true}
                    accessibilityRole="image"
                    accessibilityLabel={`${feature.title} icon`}
                  >
                    <feature.icon size={16} color={feature.color} />
                  </View>
                  <Text
                    style={styles.featureTitle}
                    accessible={true}
                    accessibilityRole="header"
                  >
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription} accessible={true}>
                    {feature.description}
                  </Text>
                </View>
              ))}
            </View>

            {/* Value Propositions */}
            <View style={styles.valuePropsSection}>
              <View style={styles.valuePropsList}>
                <View style={styles.valuePropItem}>
                  <TrendingUp size={12} color={Colors.brand.green} />
                  <Text style={styles.valuePropText}>
                    First NFT-based portfolio tracking
                  </Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Zap size={12} color={Colors.status.warning} />
                  <Text style={styles.valuePropText}>
                    Multi-chain from day one
                  </Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Shield size={12} color={Colors.status.info} />
                  <Text style={styles.valuePropText}>
                    Professional custody + self-custody opt-in
                  </Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Star size={12} color={Colors.brand.green} />
                  <Text style={styles.valuePropText}>
                    Tradeable, inheritable portfolios
                  </Text>
                </View>
              </View>
            </View>

            {/* CTA Section */}
            <View
              style={styles.ctaSection}
              accessible={false}
              accessibilityLabel="Get started section"
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/(auth)/signup')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Start Your Crypto Journey"
                accessibilityHint="Navigate to sign up screen to create your Cultivest account and start investing in Bitcoin and Algorand"
                accessibilityState={{ disabled: false }}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.buttonGradient}
                  accessible={false}
                >
                  <Text style={styles.primaryButtonText}>
                    Start Your Crypto Journey
                  </Text>
                  <ArrowRight size={16} color={Colors.brand.white} />
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/login')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Sign In to Existing Account"
                accessibilityHint="Navigate to login screen if you already have a Cultivest account"
                accessibilityState={{ disabled: false }}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>

              <Text
                style={styles.disclaimer}
                accessible={true}
                accessibilityLabel="Professional custody, Portfolio NFTs, Start with just 1 dollar"
                accessibilityHint="Important features and investment information"
              >
                🏆 Professional Custody • Portfolio NFTs • Start with just $1
              </Text>

              {/* Development Bypass Button */}
              {__DEV__ && (
                <TouchableOpacity
                  style={styles.devButton}
                  onPress={devBypass}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Developer bypass button"
                  accessibilityHint="Skip authentication and go directly to dashboard. Development only."
                >
                  <Text style={styles.devButtonText}>
                    🚀 DEV: Skip to Dashboard
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
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
  boltBadge: {
    position: 'absolute',
    width: Math.min(50, width * 0.12),
    height: Math.min(50, width * 0.12),
    zIndex: 10,
    ...Shadow.md,
  },
  boltBadgeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cryptoDecor: {
    position: 'absolute',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoContainer: {
    // marginBottom: Spacing.md,
  },
  logoBackground: {
    width: 150,
    height: 150,
    // borderRadius: 40,
    // backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: Colors.border.accent,
    // shadowColor: '#000000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.4,
    // shadowRadius: 4,
    // elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: Typography.weight.black,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * 16,
    // marginBottom: Spacing.base,
    fontWeight: Typography.weight.medium,
    paddingHorizontal: Spacing.lg,
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  cryptoContainer: {
    position: 'relative',
    alignItems: 'center',
    width: 140,
    height: 100,
    marginVertical: 0,
  },
  bitcoinIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: Colors.background.secondary,
    borderRadius: 28,
    padding: 14,
    borderWidth: 3,
    borderColor: Colors.crypto.bitcoin,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  algorandIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.background.secondary,
    borderRadius: 28,
    padding: 14,
    borderWidth: 3,
    borderColor: Colors.crypto.algorand,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  nftBadge: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -35 }],
    backgroundColor: Colors.brand.green,
    borderRadius: 20,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background.secondary,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  nftText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.heavy,
    color: Colors.brand.white,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  cryptoIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadow.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    lineHeight: Typography.lineHeight.normal * 10,
    textAlign: 'center',
    fontWeight: Typography.weight.medium,
  },
  valuePropsSection: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  valuePropsList: {
    gap: Spacing.sm,
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuePropText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    fontWeight: Typography.weight.medium,
    flex: 1,
  },
  ctaSection: {
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 20,
    marginBottom: Spacing.base,
    width: '100%',
    maxWidth: 320,
    ...Shadow.lg,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.white,
  },
  secondaryButton: {
    marginBottom: Spacing.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * 12,
    fontWeight: Typography.weight.medium,
    paddingHorizontal: Spacing.base,
  },
  devButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  devButtonText: {
    fontSize: Typography.size.sm,
    color: Colors.brand.green,
    fontWeight: Typography.weight.semibold,
    textAlign: 'center',
  },
});
