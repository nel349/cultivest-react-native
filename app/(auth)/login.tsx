import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, LogIn, Leaf, Sprout, Flower, ChevronDown, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

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
          colors={Colors.gradients.backgroundPrimary}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
          {/* Decorative Elements - Hidden for cleaner dark theme */}
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header with Back Button */}
              <View style={styles.header}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft size={20} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              {/* Content Container */}
              <View style={styles.content}>
                
                {/* Hero Section */}
                <View style={styles.heroSection}>
                  <View style={styles.iconContainer}>
                    <LogIn size={40} color={Colors.brand.green} />
                  </View>
                  
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>
                    Enter your phone number to continue to your investment garden 🌱
                  </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                  
                  {/* Country Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Country</Text>
                    <TouchableOpacity 
                      style={styles.countrySelector}
                      onPress={() => setShowCountryModal(true)}
                    >
                      <Text style={styles.countrySelectorText}>
                        {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})
                      </Text>
                      <ChevronDown size={20} color={Colors.text.secondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Phone Number Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.phoneInputContainer}>
                      <View style={styles.dialCodeContainer}>
                        <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
                      </View>
                      <TextInput
                        style={styles.phoneInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter phone number"
                        placeholderTextColor={Colors.text.tertiary}
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                      />
                    </View>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading ? [Colors.button.disabled, Colors.button.disabled] : Colors.gradients.primary}
                      style={styles.buttonGradient}
                    >
                      <Phone size={18} color={Colors.brand.white} />
                      <Text style={styles.loginButtonText}>
                        {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Sign Up Link */}
                  <View style={styles.signupSection}>
                    <Text style={styles.signupPrompt}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                      <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Country Selection Modal */}
          <Modal
            visible={showCountryModal}
            animationType="slide"
            transparent={true}
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
                    <Text style={styles.modalCloseText}>Done</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.countriesList}>
                  {countries.map((country) => (
                    <TouchableOpacity
                      key={country.code}
                      style={styles.countryItem}
                      onPress={() => {
                        setCountry(country.code);
                        setShowCountryModal(false);
                      }}
                    >
                      <Text style={styles.countryFlag}>{country.flag}</Text>
                      <View style={styles.countryInfo}>
                        <Text style={styles.countryName}>{country.name}</Text>
                        <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                      </View>
                                             {country.code === selectedCountry.code && (
                         <Check size={16} color={Colors.brand.green} />
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
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.base,
  },
  formSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: Spacing.lg,
    ...Shadow.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  countrySelectorText: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 12,
  },
  dialCodeContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border.primary,
  },
  dialCodeText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadow.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loginButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.white,
  },
  signupSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
  },
  signupPrompt: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  signupLink: {
    fontSize: Typography.size.sm,
    color: Colors.brand.green,
    fontWeight: Typography.weight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: Spacing.lg,
    width: '85%',
    maxHeight: '70%',
    ...Shadow.xl,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  modalCloseButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  modalCloseText: {
    fontSize: Typography.size.base,
    color: Colors.brand.green,
    fontWeight: Typography.weight.semibold,
  },
  countriesList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.secondary,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: Spacing.base,
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryName: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  countryDialCode: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
}); 