import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, User, Globe } from 'lucide-react-native';
import { apiClient } from '@/utils/api';

export default function SignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!phoneNumber.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.signup(phoneNumber, name, country);
      
      if (response.success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            phoneNumber,
            userID: (response.data as { userID?: string })?.userID || ''
          }
        });
      } else {
        Alert.alert('Signup Failed', response.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Let's get started</Text>
            <Text style={styles.subtitle}>
              Join thousands growing their savings with micro-investments
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color="#8B9DC3" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#8B9DC3"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#8B9DC3" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#8B9DC3"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Globe size={20} color="#8B9DC3" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Country Code (US, NG, etc.)"
                placeholderTextColor="#8B9DC3"
                value={country}
                onChangeText={setCountry}
                autoCapitalize="characters"
                maxLength={3}
              />
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              We'll send you a verification code via SMS to confirm your phone number.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#666', '#666'] : ['#00D4AA', '#00B4D8']}
              style={styles.buttonGradient}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Creating Account...' : 'Continue'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Your data is protected and GENIUS Act compliant.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A2332',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 32,
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
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2332',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: '#1A2332',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  infoText: {
    fontSize: 14,
    color: '#8B9DC3',
    lineHeight: 20,
  },
  continueButton: {
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    marginTop: 'auto',
    marginBottom: 20,
  },
});

