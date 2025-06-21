import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Shield, CheckCircle, ArrowRight, Wallet } from 'lucide-react-native';

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
      title: 'Identity Verification',
      description: 'Quick 2-minute process with MoonPay',
      status: 'pending'
    },
    {
      icon: Wallet,
      title: 'Wallet Creation',
      description: 'Secure custodial wallet setup',
      status: 'pending'
    },
    {
      icon: CheckCircle,
      title: 'Ready to Invest',
      description: 'Start with just $1 in USDCa yields',
      status: 'pending'
    }
  ];

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['#00D4AA20', '#00B4D820']}
              style={styles.iconContainer}
            >
              <Shield size={40} color="#00D4AA" />
            </LinearGradient>
            
            <Text style={styles.title}>Almost there!</Text>
            <Text style={styles.subtitle}>
              Complete your profile to start investing in stablecoin yields
            </Text>
          </View>

          <View style={styles.stepsContainer}>
            {kycSteps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepIcon}>
                  <step.icon size={24} color="#00D4AA" />
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
            <Text style={styles.benefitsTitle}>Why verify?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#00D4AA" />
                <Text style={styles.benefitText}>GENIUS Act compliant</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#00D4AA" />
                <Text style={styles.benefitText}>Secure fund transfers</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color="#00D4AA" />
                <Text style={styles.benefitText}>Higher investment limits</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.buttonDisabled]}
            onPress={handleStartKYC}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#666', '#666'] : ['#00D4AA', '#00B4D8']}
              style={styles.buttonGradient}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </Text>
              {!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your data is encrypted and protected. We partner with MoonPay for 
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D4AA20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#8B9DC3',
  },
  stepStatus: {
    marginLeft: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B9DC3',
  },
  benefitsSection: {
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color: '#8B9DC3',
    marginLeft: 12,
  },
  continueButton: {
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
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