import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, User, Globe, Leaf, Sprout, Flower, ChevronDown, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  ];

  const selectedCountry = countries.find(c => c.code === country) || countries[0];

  const handleSignup = async () => {
    if (!phoneNumber.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Enhanced phone number validation and formatting
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Basic length validation
    if (cleanPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number (at least 10 digits)');
      return;
    }
    
    // Check for invalid patterns
    if (cleanPhone.includes('0000') || cleanPhone.match(/(\d)\1{4,}/)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Format phone number with country code based on selected country
    const selectedCountryData = countries.find(c => c.code === country) || countries[0];
    let formattedPhone;
    
    try {
      if (selectedCountryData.dialCode === '+1') {
        // US/Canada formatting
        if (cleanPhone.length === 10) {
          formattedPhone = `+1${cleanPhone}`;
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
          formattedPhone = `+${cleanPhone}`;
        } else {
          throw new Error('Invalid US/Canada phone number length');
        }
      } else if (selectedCountryData.dialCode === '+234') {
        // Nigeria formatting
        if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
          const nigeriaNumber = cleanPhone.startsWith('234') ? cleanPhone : `234${cleanPhone}`;
          formattedPhone = `+${nigeriaNumber}`;
        } else {
          throw new Error('Invalid Nigeria phone number length');
        }
      } else {
        // Other countries - basic formatting
        formattedPhone = `${selectedCountryData.dialCode}${cleanPhone}`;
      }
      
      // Final validation - ensure no suspicious patterns
      if (formattedPhone.includes('XXXX') || formattedPhone.length > 20) {
        throw new Error('Invalid phone number format');
      }
      
    } catch (error) {
      Alert.alert('Error', `Please enter a valid ${selectedCountryData.name} phone number`);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Attempting signup with:', { phoneNumber: formattedPhone, name, country });
      
      const response = await apiClient.signup(formattedPhone, name.trim(), country.toUpperCase());
      
      if (response.success) {
        console.log('✅ Signup successful:', response);
        
        // Check if it's development mode with console OTP
        const isDevelopmentMode = response.developmentMode || response.smsProvider === 'mock' || response.smsProvider === 'console';
        const userID = response.userID || (response.data as { userID?: string })?.userID || '';
        
        if (isDevelopmentMode && response.consoleOTP) {
          Alert.alert(
            'Development Mode 🛠️', 
            `SMS service in development mode.\n\nYour OTP code is: ${response.consoleOTP}\n\nCheck the console for details.`,
            [
              {
                text: 'Continue',
                onPress: () => router.push({
                  pathname: '/(auth)/verify-otp',
                  params: {
                    phoneNumber: formattedPhone,
                    userID: userID,
                    name: name.trim()
                  }
                })
              }
            ]
          );
        } else if (isDevelopmentMode) {
          Alert.alert(
            'Development Mode 🛠️', 
            'SMS service in development mode. Check the console/logs for your OTP code.',
            [
              {
                text: 'Continue',
                onPress: () => router.push({
                  pathname: '/(auth)/verify-otp',
                  params: {
                    phoneNumber: formattedPhone,
                    userID: userID,
                    name: name.trim()
                  }
                })
              }
            ]
          );
        } else {
          Alert.alert(
            'Success!', 
            'We\'ve sent a verification code to your phone. Check your messages!',
            [
              {
                text: 'OK',
                onPress: () => router.push({
                  pathname: '/(auth)/verify-otp',
                  params: {
                    phoneNumber: formattedPhone,
                    userID: userID,
                    name: name.trim()
                  }
                })
              }
            ]
          );
        }
      } else {
        console.error('❌ Signup failed:', response.error);
        
        // Check if user was created but SMS failed
        if (response.userCreated && response.canRetry) {
          Alert.alert(
            'SMS Failed', 
            `Account created but SMS failed: ${response.error}\n\nWould you like to try again or continue in development mode?`,
            [
              {
                text: 'Try Again',
                onPress: () => handleSignup()
              },
              {
                text: 'Development Mode',
                onPress: () => {
                  Alert.alert('Note', 'Check console logs for OTP code');
                  // Could navigate to OTP screen in dev mode
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', response.error || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#89E5AB', '#58CC02']}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
          {/* Decorative Plants */}
          <View style={styles.decorationContainer}>
            <View style={[styles.plantDecor, { top: 80 + insets.top, left: 30 }]}>
              <Leaf size={20} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={[styles.plantDecor, { top: 120 + insets.top, right: 40 }]}>
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
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
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

                <TouchableOpacity 
                  style={styles.inputGroup}
                  onPress={() => setShowCountryModal(true)}
                >
                  <View style={styles.inputIcon}>
                    <Globe size={20} color="#58CC02" />
                  </View>
                  <View style={styles.countrySelector}>
                    <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryText}>{selectedCountry.name}</Text>
                    <Text style={styles.countryCode}>({selectedCountry.code})</Text>
                  </View>
                  <ChevronDown size={20} color="#58CC02" />
                </TouchableOpacity>
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
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Country Selection Modal */}
        <Modal
          visible={showCountryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowCountryModal(false)}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.countryList}>
                {countries.map((countryItem) => (
                  <TouchableOpacity
                    key={countryItem.code}
                    style={[
                      styles.countryItem,
                      country === countryItem.code && styles.selectedCountryItem
                    ]}
                    onPress={() => {
                      setCountry(countryItem.code);
                      setShowCountryModal(false);
                    }}
                  >
                    <Text style={styles.countryItemFlag}>{countryItem.flag}</Text>
                    <View style={styles.countryItemInfo}>
                      <Text style={styles.countryItemName}>{countryItem.name}</Text>
                      <Text style={styles.countryItemCode}>{countryItem.dialCode}</Text>
                    </View>
                    {country === countryItem.code && (
                      <Check size={20} color="#58CC02" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
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
    paddingHorizontal: 20,
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
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  countrySelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B9DC3',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedCountryItem: {
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
  },
  countryItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    flex: 1,
  },
  countryItemCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B9DC3',
    marginLeft: 8,
  },
});