import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, Modal, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Phone, User, Globe, Leaf, Sprout, Flower, ChevronDown, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

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
        
        // Navigation helper with auto-fill support
        const navigateToOTP = () => {
          router.push({
            pathname: '/(auth)/verify-otp',
            params: {
              phoneNumber: formattedPhone,
              userID: userID,
              name: name.trim(),
              // Pass OTP code for auto-fill in development
              ...(response.consoleOTP && { autoFillOTP: response.consoleOTP })
            }
          });
        };

        if (isDevelopmentMode && response.consoleOTP) {
          Alert.alert(
            'Development Mode 🛠️', 
            `SMS service in development mode.\n\nYour OTP code is: ${response.consoleOTP}\n\nWe'll auto-fill it for you!`,
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
            'Success!', 
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
          colors={Colors.gradients.backgroundPrimary}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
          {/* Decorative elements removed for clean dark theme */}

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
                    <User size={40} color={Colors.brand.green} />
                  </View>
                  
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>
                    Join Cultivest and start your investment journey with just $1 🌱
                  </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                  
                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputContainer}>
                      <User size={16} color={Colors.text.tertiary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        placeholderTextColor={Colors.text.tertiary}
                        returnKeyType="next"
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

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
                        onSubmitEditing={handleSignup}
                      />
                    </View>
                  </View>

                  {/* Signup Button */}
                  <TouchableOpacity
                    style={[styles.signupButton, isLoading && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading ? [Colors.button.disabled, Colors.button.disabled] : Colors.gradients.primary}
                      style={styles.buttonGradient}
                    >
                      <User size={18} color={Colors.brand.white} />
                      <Text style={styles.signupButtonText}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.loginSection}>
                    <Text style={styles.loginPrompt}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                      <Text style={styles.loginLink}>Sign In</Text>
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
                  {countries.map((countryItem) => (
                    <TouchableOpacity
                      key={countryItem.code}
                      style={styles.countryItem}
                      onPress={() => {
                        setCountry(countryItem.code);
                        setShowCountryModal(false);
                      }}
                    >
                      <Text style={styles.countryFlag}>{countryItem.flag}</Text>
                      <View style={styles.countryInfo}>
                        <Text style={styles.countryName}>{countryItem.name}</Text>
                        <Text style={styles.countryDialCode}>{countryItem.dialCode}</Text>
                      </View>
                      {countryItem.code === selectedCountry.code && (
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
  // Decorative elements removed for clean dark theme
  keyboardView: {
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
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
    ...Shadow.sm,
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
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
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadow.sm,
  },
  dialCodeContainer: {
    paddingRight: 8,
  },
  dialCodeText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: Spacing.base,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  signupButton: {
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
  signupButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.brand.white,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginPrompt: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: Typography.size.sm,
    color: Colors.brand.green,
    fontWeight: Typography.weight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    ...Shadow.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
  },
  countriesList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    flex: 1,
  },
  countryDialCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B9DC3',
    marginLeft: 8,
  },
  countrySelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countrySelectorText: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
});