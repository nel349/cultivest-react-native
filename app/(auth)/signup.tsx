import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, User, Globe, Leaf, Sprout, Flower } from 'lucide-react-native';
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
      // Mock data for development
      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          phoneNumber: '1234567890',
          userID: '1234567890'
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#89E5AB', '#58CC02']}
      style={styles.container}
    >
      {/* Decorative Plants */}
      <View style={styles.decorationContainer}>
        <View style={[styles.plantDecor, { top: 80, left: 30 }]}>
          <Leaf size={20} color="rgba(255,255,255,0.3)" />
        </View>
        <View style={[styles.plantDecor, { top: 120, right: 40 }]}>
          <Sprout size={16} color="rgba(255,255,255,0.2)" />
        </View>
        <View style={[styles.plantDecor, { bottom: 200, left: 20 }]}>
          <Flower size={18} color="rgba(255,255,255,0.25)" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Your Seed 🌱</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Sprout size={32} color="#58CC02" />
              </View>
            </View>
            <Text style={styles.title}>Let's grow together!</Text>
            <Text style={styles.subtitle}>
              Join thousands already growing their wealth
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color="#58CC02" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#8B9DC3"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#58CC02" />
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
                <Globe size={20} color="#58CC02" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Country (US, NG, etc.)"
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
              📱 We'll send you a verification code to get started on your growth journey!
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#A0A0A0', '#808080'] : ['#FFFFFF', '#F0F0F0']}
              style={styles.buttonGradient}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Planting...' : 'Plant My Seed 🌱'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            🌿 By continuing, you agree to help your money grow safely with our Terms of Service and Privacy Policy
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
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  plantDecor: {
    position: 'absolute',
    opacity: 0.6,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
    textAlign: 'center',
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
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
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
    marginTop: 'auto',
    marginBottom: 20,
    fontWeight: '500',
  },
});