import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, LogIn, Leaf, Sprout, Flower, ChevronDown, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
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
      console.log('🔐 Attempting login with:', { phoneNumber: formattedPhone });
      
      const response = await apiClient.login(formattedPhone);
      
      const responseData = response as any; // Type assertion for API response
      
      if (response.success) {
        console.log('✅ Login OTP sent successfully:', response);
        
        // Check if it's development mode with console OTP
        const isDevelopmentMode = responseData.developmentMode || responseData.smsProvider === 'mock' || responseData.smsProvider === 'console';
        const userID = responseData.userID || '';
        const userName = responseData.userName || '';
        
        // Navigation helper with auto-fill support
        const navigateToOTP = () => {
          router.push({
            pathname: '/(auth)/verify-otp',
            params: {
              phoneNumber: formattedPhone,
              userID: userID,
              name: userName,
              isLogin: 'true',
              // Pass OTP code for auto-fill in development
              ...(responseData.otpCode && { autoFillOTP: responseData.otpCode })
            }
          });
        };

        if (isDevelopmentMode && responseData.consoleOTP) {
          Alert.alert(
            'Development Mode 🛠️', 
            `SMS service in development mode.\n\nYour OTP code is: ${responseData.consoleOTP}\n\nWe'll auto-fill it for you!`,
            [
              {
                text: 'Continue',
                onPress: navigateToOTP
              }
            ]
          );
        } else if (isDevelopmentMode) {
          Alert.alert(
            'Development Mode 🛠️', 
            'SMS service in development mode. We\'ll auto-fill the OTP for you!',
            [
              {
                text: 'Continue',
                onPress: navigateToOTP
              }
            ]
          );
        } else {
          Alert.alert(
            'Welcome Back! 🌱', 
            'We\'ve sent a verification code to your phone. Check your messages!',
            [
              {
                text: 'OK',
                onPress: navigateToOTP
              }
            ]
          );
        }
      } else {
        console.error('❌ Login failed:', response.error);
        
        // Check if user should sign up instead
        if (responseData.shouldSignup) {
          Alert.alert(
            'Account Not Found', 
            'No account found with this phone number. Would you like to sign up instead?',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'Sign Up',
                onPress: () => router.push('/(auth)/signup')
              }
            ]
          );
        } else {
          Alert.alert('Error', response.error || 'Login failed. Please try again.');
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
          colors={['#89E5AB', '#58CC02', '#46A302']}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
          {/* Decorative Elements */}
          <View style={styles.decorationContainer}>
            <View style={[styles.cryptoDecor, { top: 80 + insets.top, left: 25 }]}>
              <Leaf size={18} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={[styles.cryptoDecor, { top: 160 + insets.top, right: 30 }]}>
              <Sprout size={16} color="rgba(255,255,255,0.2)" />
            </View>
            <View style={[styles.cryptoDecor, { bottom: 120, left: 40 }]}>
              <Flower size={20} color="rgba(255,255,255,0.25)" />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back! 🌱</Text>
            </View>

            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.formContainer}>
                  <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                      <LogIn size={32} color="#3B82F6" />
                    </View>
                  </View>

                  <Text style={styles.title}>Sign In to Your Account</Text>
                  <Text style={styles.subtitle}>
                    Enter your phone number and we'll send you a verification code
                  </Text>

                  {/* Country Selector */}
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryModal(true)}
                  >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryText}>
                      {selectedCountry.name} ({selectedCountry.dialCode})
                    </Text>
                    <ChevronDown size={20} color="#64748B" />
                  </TouchableOpacity>

                  {/* Phone Number Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIcon}>
                      <Phone size={20} color="#64748B" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone number"
                      placeholderTextColor="#9CA3AF"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      textContentType="telephoneNumber"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1D4ED8']}
                      style={styles.submitButtonGradient}
                    >
                      <Text style={styles.submitButtonText}>
                        {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.switchAuthButton}
                    onPress={() => router.push('/(auth)/signup')}
                  >
                    <Text style={styles.switchAuthText}>
                      Don't have an account? <Text style={styles.switchAuthLink}>Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          {/* Country Selection Modal */}
          <Modal
            visible={showCountryModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowCountryModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  onPress={() => setShowCountryModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.countryList}>
                {countries.map((countryItem) => (
                  <TouchableOpacity
                    key={countryItem.code}
                    style={[
                      styles.countryItem,
                      country === countryItem.code && styles.countryItemSelected
                    ]}
                    onPress={() => {
                      setCountry(countryItem.code);
                      setShowCountryModal(false);
                    }}
                  >
                    <Text style={styles.countryFlag}>{countryItem.flag}</Text>
                    <Text style={styles.countryName}>{countryItem.name}</Text>
                    <Text style={styles.dialCode}>{countryItem.dialCode}</Text>
                    {country === countryItem.code && (
                      <Check size={20} color="#10B981" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
  cryptoDecor: {
    position: 'absolute',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 20,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchAuthButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchAuthText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchAuthLink: {
    color: '#58CC02',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryItemSelected: {
    backgroundColor: '#F0F9FF',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  dialCode: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
}); 