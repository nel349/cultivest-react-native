import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Leaf, Sprout, TreePine, Flower, Star, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const features = [
    {
      icon: Sprout,
      title: 'Plant Your First Dollar',
      description: 'Start with just $1 and watch it grow',
      color: '#58CC02'
    },
    {
      icon: TreePine,
      title: 'Grow Your Garden',
      description: 'Earn 2-5% APY on stablecoins',
      color: '#00D4AA'
    },
    {
      icon: Flower,
      title: 'Daily Blooms',
      description: 'See your earnings flower every day',
      color: '#FF9500'
    },
    {
      icon: Star,
      title: 'Level Up',
      description: 'Unlock achievements as you grow',
      color: '#FFD900'
    }
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#89E5AB', '#58CC02', '#46A302']}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
        {/* Decorative Plants */}
        <View style={styles.decorationContainer}>
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

        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Leaf size={40} color="#FFFFFF" />
              </View>
            </View>
            
            <Text style={styles.title}>Cultivest</Text>
            <Text style={styles.subtitle}>
              Grow your wealth, one seed at a time 🌱
            </Text>
            
            {/* Main Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.treeContainer}>
                <TreePine size={80} color="#2E7D32" />
                <View style={styles.coinBadge}>
                  <Text style={styles.coinText}>+$0.03</Text>
                </View>
              </View>
              <Text style={styles.illustrationText}>Your money tree is ready to grow!</Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <feature.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/signup')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Start Growing Today</Text>
                <ArrowRight size={20} color="#58CC02" />
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              🌿 FDIC insured • GENIUS Act compliant • Start with just $1
            </Text>
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
  plantDecor: {
    position: 'absolute',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
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
});