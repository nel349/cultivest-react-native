import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bitcoin, Coins, Shield, TrendingUp, Star, ArrowRight, Zap, Award } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Colors, Gradients, Typography, Spacing, Shadows, createTextStyle, createButtonStyle } from '@/utils/DesignSystem';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Announce screen load for screen readers
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      'Welcome to Cultivest. The first Bitcoin and Algorand investment platform with Portfolio NFTs. Start investing with just one dollar.'
    );
  }, []);

  // Development bypass function
  const devBypass = async () => {
    // Using the user ID from our earlier backend test
    const devUserID = "045b5515-f334-436b-93b5-cc03fbcf8071";
    const devUserName = "Norman E. Lopez";
    
    // Real JWT token from our test session
    const realToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNDViNTUxNS1mMzM0LTQzNmItOTNiNS1jYzAzZmJjZjgwNzEiLCJwaG9uZU51bWJlciI6IisxOTE1NDA4MjAzNiIsImlhdCI6MTc1MTA5MzgzMCwiZXhwIjoxNzUxMTgwMjMwfQ.fx4-UxaqsIAEHY8p_bxeq9wuf1WdlOdQY3bczK1Wohw";
    
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
      color: Colors.bitcoin,
      accessibilityLabel: 'Bitcoin Investment feature',
      accessibilityHint: 'Learn how to start investing in Bitcoin with just one dollar'
    },
    {
      icon: Coins,
      title: 'Multi-Chain Portfolio',
      description: 'Bitcoin + Algorand investments',
      color: Colors.accentTeal,
      accessibilityLabel: 'Multi-Chain Portfolio feature',
      accessibilityHint: 'Discover how to invest across Bitcoin and Algorand blockchains'
    },
    {
      icon: Award,
      title: 'Portfolio NFTs',
      description: 'Your investments become tradeable NFTs',
      color: Colors.accentPurple,
      accessibilityLabel: 'Portfolio NFTs feature',
      accessibilityHint: 'Revolutionary NFT system that makes your portfolio tradeable and inheritable'
    },
    {
      icon: Shield,
      title: 'Custodial Security',
      description: 'Professional custody with self-custody opt-in',
      color: Colors.error,
      accessibilityLabel: 'Custodial Security feature',
      accessibilityHint: 'Secure professional custody with option to graduate to self-custody'
    }
  ];

  return (
    <TouchableWithoutFeedback 
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View 
        style={styles.container}
        accessibilityLabel="Cultivest welcome screen"
      >
        <LinearGradient
          colors={Gradients.auth}
          style={[styles.gradient, { paddingTop: insets.top }]}
          accessible={false}
        >
        {/* Decorative Crypto Icons - Hidden from screen readers */}
        <View 
          style={styles.decorationContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <View style={[styles.cryptoDecor, { top: 60 + insets.top, left: 20 }]}>
            <Bitcoin size={20} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={[styles.cryptoDecor, { top: 90 + insets.top, right: 30 }]}>
            <Coins size={16} color="rgba(255,255,255,0.2)" />
          </View>
          <View style={[styles.cryptoDecor, { top: 120 + insets.top, left: width - 60 }]}>
            <Award size={14} color="rgba(255,255,255,0.25)" />
          </View>
        </View>

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
              accessibilityLabel="Cultivest logo with Bitcoin icon"
            >
              <View style={styles.logoBackground}>
                <Bitcoin size={28} color={Colors.bitcoin} />
              </View>
            </View>
            
            <Text 
              style={styles.title}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Cultivest"
            >
              Cultivest
            </Text>
            <Text 
              style={styles.subtitle}
              accessible={true}
              accessibilityLabel="The first Bitcoin and Algorand investment platform with Portfolio NFTs"
            >
              The first Bitcoin + Algorand investment platform with Portfolio NFTs 🏆
            </Text>
            
            {/* Main Illustration */}
            <View 
              style={styles.illustrationContainer}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Bitcoin and NFT portfolio illustration showing multi-chain investments"
            >
              <View style={styles.cryptoContainer}>
                <View style={styles.bitcoinIcon}>
                  <Bitcoin size={36} color={Colors.bitcoin} />
                </View>
                <View style={styles.algorandIcon}>
                  <Coins size={30} color={Colors.accentTeal} />
                </View>
                <View 
                  style={styles.nftBadge}
                  accessible={true}
                  accessibilityLabel="Portfolio NFT badge"
                >
                  <Award size={14} color={Colors.accentPurple} />
                  <Text style={styles.nftText}>NFT</Text>
                </View>
              </View>
            </View>
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
                  style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}
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
                <Text 
                  style={styles.featureDescription}
                  accessible={true}
                >
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Value Propositions */}
          <View style={styles.valuePropsSection}>
            <View style={styles.valuePropsList}>
              <View style={styles.valuePropItem}>
                <TrendingUp size={12} color={Colors.success} />
                <Text style={styles.valuePropText}>First NFT-based portfolio tracking</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Zap size={12} color={Colors.warning} />
                <Text style={styles.valuePropText}>Multi-chain from day one</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Shield size={12} color={Colors.secondaryBlue} />
                <Text style={styles.valuePropText}>Professional custody + self-custody opt-in</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Star size={12} color={Colors.accentPurple} />
                <Text style={styles.valuePropText}>Tradeable, inheritable portfolios</Text>
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
                colors={Gradients.buttonSecondary}
                style={styles.buttonGradient}
                accessible={false}
              >
                <Text style={styles.primaryButtonText}>Start Your Crypto Journey</Text>
                <ArrowRight size={16} color={Colors.secondaryBlue} />
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
              <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
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
                <Text style={styles.devButtonText}>🚀 DEV: Skip to Dashboard</Text>
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
  },
  gradient: {
    flex: 1,
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
    padding: Spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoContainer: {
    marginBottom: Spacing.sm,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    ...Shadows.buttonShadow,
  },
  title: {
    ...createTextStyle('display2', Colors.textInverse),
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...createTextStyle('bodySmall', 'rgba(255,255,255,0.95)'),
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '600',
    paddingHorizontal: Spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  cryptoContainer: {
    position: 'relative',
    alignItems: 'center',
    width: 90,
    height: 60,
  },
  bitcoinIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(247, 147, 26, 0.2)',
    borderRadius: 20,
    padding: 6,
  },
  algorandIcon: {
    position: 'absolute',
    top: 8,
    right: 0,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    borderRadius: 18,
    padding: 4,
  },
  nftBadge: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -20 }],
    backgroundColor: Colors.accentPurple,
    borderRadius: 15,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
    ...Shadows.subtleShadow,
  },
  nftText: {
    ...createTextStyle('captionBold', Colors.textInverse),
    marginLeft: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.tiny,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Spacing.radiusMedium,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadows.cardShadow,
    minHeight: 85,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  featureTitle: {
    ...createTextStyle('labelSmall', Colors.textPrimary),
    marginBottom: 3,
    textAlign: 'center',
  },
  featureDescription: {
    ...createTextStyle('caption', Colors.textSecondary),
    textAlign: 'center',
    fontWeight: '500',
  },
  valuePropsSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Spacing.radiusMedium,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.cardShadow,
  },
  valuePropsList: {
    gap: Spacing.xs,
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuePropText: {
    ...createTextStyle('labelSmall', Colors.textSecondary),
    marginLeft: Spacing.sm,
    flex: 1,
  },
  ctaSection: {
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: Spacing.radiusLarge,
    marginBottom: Spacing.sm,
    ...Shadows.buttonShadow,
    width: '100%',
    maxWidth: 280,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.radiusLarge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  primaryButtonText: {
    ...createTextStyle('buttonMedium', Colors.secondaryBlue),
  },
  secondaryButton: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: Spacing.radiusMedium,
  },
  secondaryButtonText: {
    ...createTextStyle('labelMedium', 'rgba(255,255,255,0.95)'),
    textAlign: 'center',
  },
  disclaimer: {
    ...createTextStyle('caption', 'rgba(255,255,255,0.9)'),
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: Spacing.md,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  devButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Spacing.radiusSmall,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  devButtonText: {
    ...createTextStyle('labelMedium', Colors.textInverse),
    textAlign: 'center',
  },
});