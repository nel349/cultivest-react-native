import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TrendingUp, Shield, DollarSign, Leaf } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const features = [
    {
      icon: DollarSign,
      title: 'Start with $1',
      description: 'Micro-investments in stable yields'
    },
    {
      icon: TrendingUp,
      title: '2-5% APY',
      description: 'Earn consistent returns on USDCa'
    },
    {
      icon: Shield,
      title: 'GENIUS Act Safe',
      description: 'Regulated stablecoin investments'
    },
    {
      icon: Leaf,
      title: 'Watch It Grow',
      description: 'Your money tree grows with yields'
    }
  ];

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332', '#0D1421']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#00D4AA', '#00B4D8']}
              style={styles.logoGradient}
            >
              <Leaf size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Cultivest</Text>
          <Text style={styles.subtitle}>
            Grow your savings with{'\n'}stablecoin micro-investments
          </Text>
          
          {/* Money Tree Illustration */}
          <View style={styles.illustrationContainer}>
            <LinearGradient
              colors={['#00D4AA20', '#00B4D820']}
              style={styles.treeBackground}
            >
              <Leaf size={64} color="#00D4AA" />
            </LinearGradient>
            <Text style={styles.illustrationText}>$0.003 earned today</Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: `#00D4AA${Math.floor(255 * 0.1).toString(16)}` }]}>
                <feature.icon size={20} color="#00D4AA" />
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
              colors={['#00D4AA', '#00B4D8']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Start Growing</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            FDIC insured • GENIUS Act compliant • Start with just $1
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  treeBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  illustrationText: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#8B9DC3',
    lineHeight: 18,
  },
  ctaSection: {
    marginTop: 'auto',
  },
  primaryButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 16,
  },
});