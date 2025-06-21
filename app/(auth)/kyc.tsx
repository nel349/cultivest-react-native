import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CircleCheck as CheckCircle, ArrowRight, Wallet } from 'lucide-react-native';

export default function KYCScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartKYC = async () => {
    setIsLoading(true);
    
    // Simulate KYC process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  };

  const kycSteps = [
    {
      icon: Shield,
      title: 'Identity Verification 🛡️',
      description: 'Quick 2-minute process with MoonPay',
      status: 'pending'
    },
    {
      icon: Wallet,
      title: 'Garden Wallet Setup 🌱',
      description: 'Secure custodial wallet for your seeds',
      status: 'pending'
    },
    {
      icon: CheckCircle,
      title: 'Ready to Plant! 🌿',
      description: 'Start growing with just $1',
      status: 'pending'
    }
  ];

  return (
    <LinearGradient
      colors={['#89E5AB', '#58CC02', '#46A302']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Shield size={40} color="#58CC02" />
            </View>
            
            <Text style={styles.title}>Almost Ready to Grow! 🌱</Text>
            <Text style={styles.subtitle}>
              Complete your garden setup to start planting seeds and growing your wealth
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            {kycSteps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepIcon}>
                  <step.icon size={24} color="#58CC02" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <View style={styles.stepStatus}>
                  <View style={styles.statusDot} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why complete setup? 🌟</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#58CC02" />
                <Text style={styles.benefitText}>GENIUS Act compliant</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#58CC02" />
                <Text style={styles.benefitText}>Secure seed transfers</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#58CC02" />
                <Text style={styles.benefitText}>Higher planting limits</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.buttonDisabled]}
            onPress={handleStartKYC}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#C0C0C0', '#C0C0C0'] : ['#FFFFFF', '#F0F0F0']}
              style={styles.buttonGradient}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Planting seeds...' : 'Start Growing! 🌱'}
              </Text>
              {!isLoading && <ArrowRight size={20} color="#58CC02" />}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your data is encrypted and protected like seeds in fertile soil. We partner with MoonPay for 
            secure identity verification and comply with all financial regulations.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
    lineHeight: 22,
    fontWeight: '500',
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
    backgroundColor: '#58CC02',
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
  },
});