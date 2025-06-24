import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Leaf, Sprout, TreePine, Flower, Star, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Announce screen load for screen readers
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      'Welcome to Cultivest. Grow your wealth, one seed at a time. Start with just one dollar.'
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
      icon: Sprout,
      title: 'Plant Your First Dollar',
      description: 'Start with just $1 and watch it grow',
      color: '#58CC02',
      accessibilityLabel: 'Plant Your First Dollar feature',
      accessibilityHint: 'Learn how to start investing with just one dollar'
    },
    {
      icon: TreePine,
      title: 'Grow Your Garden',
      description: 'Earn 2-5% APY on stablecoins',
      color: '#00D4AA',
      accessibilityLabel: 'Grow Your Garden feature',
      accessibilityHint: 'Discover how to earn 2 to 5 percent annual percentage yield on stablecoins'
    },
    {
      icon: Flower,
      title: 'Daily Blooms',
      description: 'See your earnings flower every day',
      color: '#FF9500',
      accessibilityLabel: 'Daily Blooms feature',
      accessibilityHint: 'Track your daily earnings and watch them grow'
    },
    {
      icon: Star,
      title: 'Level Up',
      description: 'Unlock achievements as you grow',
      color: '#FFD900',
      accessibilityLabel: 'Level Up feature',
      accessibilityHint: 'Earn achievements and level up as your investments grow'
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
          colors={['#89E5AB', '#58CC02', '#46A302']}
          style={[styles.gradient, { paddingTop: insets.top }]}
          accessible={false}
        >
        {/* Decorative Plants - Hidden from screen readers */}
        <View 
          style={styles.decorationContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <View style={[styles.plantDecor, { top: 60 + insets.top, left: 20 }]}>
            <Leaf size={24} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={[styles.plantDecor, { top: 100 + insets.top, right: 30 }]}>
            <Sprout size={20} color="rgba(255,255,255,0.2)" />
          </View>
          <View style={[styles.plantDecor, { top: 140 + insets.top, left: width - 60 }]}>
            <Flower size={18} color="rgba(255,255,255,0.25)" />
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
              accessibilityLabel="Cultivest logo with leaf icon"
            >
              <View style={styles.logoBackground}>
                <Leaf size={40} color="#FFFFFF" />
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
              accessibilityLabel="Grow your wealth, one seed at a time"
            >
              Grow your wealth, one seed at a time 🌱
            </Text>
            
            {/* Main Illustration */}
            <View 
              style={styles.illustrationContainer}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel="Money tree illustration showing plus 3 cents daily earnings"
            >
              <View style={styles.treeContainer}>
                <TreePine size={80} color="#2E7D32" />
                <View 
                  style={styles.coinBadge}
                  accessible={true}
                  accessibilityLabel="Plus 3 cents daily earnings badge"
                >
                  <Text style={styles.coinText}>+$0.03</Text>
                </View>
              </View>
              <Text 
                style={styles.illustrationText}
                accessible={true}
                accessibilityLabel="Your money tree is ready to grow!"
              >
                Your money tree is ready to grow!
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
              accessibilityLabel="Key features of Cultivest"
            >
              Key Features
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
                  style={[styles.featureIcon, { backgroundColor: feature.color }]}
                  accessible={true}
                  accessibilityRole="image"
                  accessibilityLabel={`${feature.title} icon`}
                >
                  <feature.icon size={24} color="#FFFFFF" />
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
              accessibilityLabel="Start Growing Today"
              accessibilityHint="Navigate to sign up screen to create your Cultivest account"
              accessibilityState={{ disabled: false }}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
                accessible={false}
              >
                <Text style={styles.primaryButtonText}>Start Growing Today</Text>
                <ArrowRight size={20} color="#58CC02" />
              </LinearGradient>
            </TouchableOpacity>
            
            <Text 
              style={styles.disclaimer}
              accessible={true}
              accessibilityLabel="FDIC insured, GENIUS Act compliant, Start with just 1 dollar"
              accessibilityHint="Important security and regulatory information"
            >
              🌿 FDIC insured • GENIUS Act compliant • Start with just $1
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
  plantDecor: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  treeContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinBadge: {
    position: 'absolute',
    top: -10,
    right: -20,
    backgroundColor: '#FFD900',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  coinText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  illustrationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 10,
  },
  featuresHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 110,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 10,
    color: '#5A5A5A',
    lineHeight: 14,
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 280,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#58CC02',
  },
  disclaimer: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
    paddingHorizontal: 20,
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