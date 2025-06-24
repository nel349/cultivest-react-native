import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bitcoin, Coins, Shield, TrendingUp, Star, ArrowRight, Zap, Award } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

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
    const devUserID = "6ed81d5d-d15b-41f1-825c-8eff55a1a9fd";
    const devUserName = "Norman E. Lopez";
    
    // Real JWT token from our test session
    const realToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWQ4MWQ1ZC1kMTViLTQxZjEtODI1Yy04ZWZmNTVhMWE5ZmQiLCJwaG9uZU51bWJlciI6IisxOTE1NDA4MjAzMCIsImlhdCI6MTc1MDcyNTIyMCwiZXhwIjoxNzUwODExNjIwfQ._mHDru0F7WvZMcegWagPihBElK_sFeAMUSF8zjWFlGU";
    
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
      color: '#F7931A',
      accessibilityLabel: 'Bitcoin Investment feature',
      accessibilityHint: 'Learn how to start investing in Bitcoin with just one dollar'
    },
    {
      icon: Coins,
      title: 'Multi-Chain Portfolio',
      description: 'Bitcoin + Algorand investments',
      color: '#00D4AA',
      accessibilityLabel: 'Multi-Chain Portfolio feature',
      accessibilityHint: 'Discover how to invest across Bitcoin and Algorand blockchains'
    },
    {
      icon: Award,
      title: 'Portfolio NFTs',
      description: 'Your investments become tradeable NFTs',
      color: '#8B5CF6',
      accessibilityLabel: 'Portfolio NFTs feature',
      accessibilityHint: 'Revolutionary NFT system that makes your portfolio tradeable and inheritable'
    },
    {
      icon: Shield,
      title: 'Custodial Security',
      description: 'Professional custody with self-custody opt-in',
      color: '#EF4444',
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
          colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
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
            <Bitcoin size={24} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={[styles.cryptoDecor, { top: 100 + insets.top, right: 30 }]}>
            <Coins size={20} color="rgba(255,255,255,0.2)" />
          </View>
          <View style={[styles.cryptoDecor, { top: 140 + insets.top, left: width - 60 }]}>
            <Award size={18} color="rgba(255,255,255,0.25)" />
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          accessible={false}
          showsVerticalScrollIndicator={false}
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
                <Bitcoin size={40} color="#F7931A" />
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
                  <Bitcoin size={60} color="#F7931A" />
                </View>
                <View style={styles.algorandIcon}>
                  <Coins size={50} color="#00D4AA" />
                </View>
                <View 
                  style={styles.nftBadge}
                  accessible={true}
                  accessibilityLabel="Portfolio NFT badge"
                >
                  <Award size={20} color="#8B5CF6" />
                  <Text style={styles.nftText}>NFT</Text>
                </View>
              </View>
              <Text 
                style={styles.illustrationText}
                accessible={true}
                accessibilityLabel="Your crypto investments become tradeable NFTs!"
              >
                Your crypto investments become tradeable NFTs!
              </Text>
            </View>
          </View>

          {/* Features Grid */}
          <View 
            style={styles.featuresContainer}
            accessible={false}
            accessibilityLabel="App features"
          >
            <Text 
              style={styles.featuresHeader}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Revolutionary features of Cultivest"
            >
              Revolutionary Features
            </Text>
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
                  <feature.icon size={24} color={feature.color} />
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
            <Text style={styles.valuePropsHeader}>Why Cultivest?</Text>
            <View style={styles.valuePropsList}>
              <View style={styles.valuePropItem}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.valuePropText}>First NFT-based portfolio tracking</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Zap size={16} color="#F59E0B" />
                <Text style={styles.valuePropText}>Multi-chain from day one</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Shield size={16} color="#3B82F6" />
                <Text style={styles.valuePropText}>Professional custody + self-custody opt-in</Text>
              </View>
              <View style={styles.valuePropItem}>
                <Star size={16} color="#8B5CF6" />
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
                colors={['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
                accessible={false}
              >
                <Text style={styles.primaryButtonText}>Start Your Crypto Journey</Text>
                <ArrowRight size={20} color="#3B82F6" />
              </LinearGradient>
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
        </ScrollView>
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
    padding: 20,
  },
  scrollContent: {
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: Math.min(18, width * 0.045),
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '600',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cryptoContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
    width: 120,
    height: 80,
  },
  bitcoinIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(247, 147, 26, 0.2)',
    borderRadius: 30,
    padding: 8,
  },
  algorandIcon: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    borderRadius: 25,
    padding: 6,
  },
  nftBadge: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nftText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  illustrationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 10,
  },
  featuresHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  valuePropsSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  valuePropsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  valuePropsList: {
    gap: 12,
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuePropText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 20,
  },
  primaryButton: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    maxWidth: 320,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  devButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  devButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});