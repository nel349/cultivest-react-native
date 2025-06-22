import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CircleCheck as CheckCircle, ArrowRight, Wallet } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Navigate to main app - funding will be set up in the dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const setupSteps = [
    {
      icon: CheckCircle,
      title: 'Wallet Created ✅',
      description: 'Your secure Algorand wallet is ready',
      status: 'completed'
    },
    {
      icon: Shield,
      title: 'MoonPay Integration 🛡️',
      description: 'Fund with credit card (ALGO → USDCa)',
      status: 'ready'
    },
    {
      icon: Wallet,
      title: 'Ready to Grow! 🌱',
      description: 'Start micro-investing with stable coins',
      status: 'ready'
    }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#89E5AB', '#58CC02', '#46A302']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <CheckCircle size={40} color="#58CC02" />
              </View>
              
              <Text style={styles.title}>Your Garden is Ready! 🌱</Text>
              <Text style={styles.subtitle}>
                Wallet created successfully. You can now fund with fiat and start growing your wealth through micro-investments.
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              {setupSteps.map((step, index) => (
                <View key={index} style={styles.stepCard}>
                  <View style={styles.stepIcon}>
                    <step.icon size={24} color="#58CC02" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                  <View style={styles.stepStatus}>
                    <View style={[
                      styles.statusDot, 
                      step.status === 'completed' && styles.statusCompleted,
                      step.status === 'ready' && styles.statusReady
                    ]} />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>What you get 🌟</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <CheckCircle size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>GENIUS Act compliant stablecoins</Text>
                </View>
                <View style={styles.benefitItem}>
                  <CheckCircle size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>Credit card funding (via ALGO)</Text>
                </View>
                <View style={styles.benefitItem}>
                  <CheckCircle size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>Start investing with just $1</Text>
                </View>
                <View style={styles.benefitItem}>
                  <CheckCircle size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>Auto-convert to USDCa stablecoins</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#C0C0C0', '#C0C0C0'] : ['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {isLoading ? 'Entering your garden...' : 'Enter My Garden 🌿'}
                </Text>
                {!isLoading && <ArrowRight size={20} color="#58CC02" />}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Your wallet is secured with bank-grade encryption. We partner with MoonPay for 
              secure fiat funding and comply with all financial regulations including the GENIUS Act.
            </Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  stepStatus: {
    marginLeft: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  statusCompleted: {
    backgroundColor: '#58CC02',
  },
  statusReady: {
    backgroundColor: '#FFD900',
  },
  benefitsSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#5A5A5A',
    marginLeft: 12,
    fontWeight: '500',
  },
  continueButton: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
});