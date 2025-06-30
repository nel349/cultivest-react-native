import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageSquare, Leaf, Sprout, Flower, CircleCheck as CheckCircle, Smartphone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import { storeAuthData } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';
import { ApiResponse } from '@/types/api';

const { width } = Dimensions.get('window');

export default function VerifyOTPScreen() {
  const insets = useSafeAreaInsets();
  const { phoneNumber, userID, name, autoFillOTP, isLogin } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showAutoFillNotification, setShowAutoFillNotification] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-fill OTP if provided (simulating SMS notification)
  useEffect(() => {
    if (autoFillOTP && typeof autoFillOTP === 'string' && autoFillOTP.length === 6) {
      console.log('📱 Auto-filling OTP:', autoFillOTP);
      
      // Show notification banner
      setShowAutoFillNotification(true);
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Simulate SMS arrival delay (like a real phone notification)
      setTimeout(() => {
        const otpArray = autoFillOTP.split('');
        setOtp(otpArray);
        
        // Auto-focus on last input to show completion
        setTimeout(() => {
          inputRefs.current[5]?.focus();
        }, 100);

        // Hide notification after auto-fill
        setTimeout(() => {
          Animated.timing(notificationOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowAutoFillNotification(false);
          });
        }, 2000);
      }, 1500); // 1.5 second delay to simulate SMS arrival
    }
  }, [autoFillOTP]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐 Attempting OTP verification:', { userID, otpCode });
      
      const response: ApiResponse<any> = await apiClient.verifyOtp(userID as string, otpCode);
      
      if (response.success && (response.authToken || response.token)) {
        console.log('✅ OTP verification successful');
        
        // Use the userID from the backend response, not from local params
        const authenticatedUserID = response.userID || response.data?.userID || userID as string;

        // Store authentication data using the proper utility function
        const token = response.authToken || response.token;
        await storeAuthData(token || '', authenticatedUserID, name as string || '');
        
        // Different flow for login vs signup
        if (isLogin === 'true') {
          // Existing user logging in - go directly to main app
          Alert.alert(
            'Welcome back! 🌱',
            'Successfully logged in to your Cultivest account.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  console.log('✅ Login successful, going to main app');
                  router.replace('/(tabs)');
                }
              }
            ]
          );
        } else {
          // New user signing up - show setup screen
          Alert.alert(
            'Welcome to Cultivest! 🌱',
            'Your account is verified! Let\'s create your wallet and start growing.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Check if wallet was auto-created (check both response root and user object)
                  const walletCreated = response.walletCreated || response.user?.walletCreated;
                  if (walletCreated) {
                    console.log('✅ Wallet auto-created, proceeding to setup');
                    router.push('/(auth)/setup');
                  } else {
                    console.log('⏳ Creating wallet...');
                    router.push('/(auth)/setup'); // Will show setup completion
                  }
                }
              }
            ]
          );
        }
      } else {
        console.error('❌ OTP verification failed:', response.error);
        Alert.alert('Error', response.error || 'Invalid verification code. Please try again.');
        
        // Clear the OTP inputs on failure
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      console.log('📱 Resending OTP to:', phoneNumber);
      
      // Extract name and country from stored data or use defaults
      const storedName = name as string || 'User';
      const defaultCountry = 'US'; // Could be extracted from phone number
      
      const response = await apiClient.signup(phoneNumber as string, storedName, defaultCountry);
      
      if (response.success) {
        setCountdown(60);
        Alert.alert('Code Sent! 📱', 'A new verification code has been sent to your phone.');
      } else {
        Alert.alert('Error', response.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('❌ Failed to resend OTP:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.backgroundPrimary}
          style={[styles.gradient, { paddingTop: insets.top }]}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <MessageSquare size={32} color={Colors.brand.green} />
                  <View style={styles.checkBadge}>
                    <CheckCircle size={16} color={Colors.brand.white} />
                  </View>
                </View>
              </View>

              <View style={styles.titleSection}>
                <Text style={styles.title}>Verify Your Code</Text>
                <Text style={styles.subtitle}>
                  We sent a 6-digit code to{'\n'}
                  <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </Text>
              </View>

              {/* Auto-fill Notification Banner */}
              {showAutoFillNotification && (
                <Animated.View 
                  style={[
                    styles.autoFillNotification,
                    { opacity: notificationOpacity }
                  ]}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationIcon}>
                      <Text style={styles.notificationEmoji}>📱</Text>
                    </View>
                    <Text style={styles.notificationText}>
                      Auto-filling verification code from SMS...
                    </Text>
                  </View>
                </Animated.View>
              )}

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpInputContainer}>
                    <TextInput
                      ref={(ref) => {
                        if (ref) inputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        digit ? styles.otpInputFilled : null
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                      placeholderTextColor={Colors.text.tertiary}
                    />
                    {digit && (
                      <View style={styles.inputCheckmark}>
                        <CheckCircle size={16} color={Colors.brand.green} />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? [Colors.button.disabled, Colors.button.disabled] : Colors.gradients.primary}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.verifyButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify Code 🚀'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.resendSection}>
                <Text style={styles.resendText}>Didn't get the code?</Text>
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={countdown > 0}
                >
                  <Text style={[
                    styles.resendButton,
                    countdown > 0 && styles.resendButtonDisabled
                  ]}>
                    {countdown > 0 ? `Try again in ${countdown}s` : 'Send again'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.lg,
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.base,
  },
  phoneNumber: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.bold,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.base,
    width: '100%',
    gap: Spacing.sm,
  },
  otpInputContainer: {
    position: 'relative',
    borderRadius: 16,
    ...Shadow.sm,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.primary,
    textAlign: 'center',
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    // Shadow applied to container instead
  },
  otpInputFilled: {
    borderColor: Colors.brand.green,
    backgroundColor: Colors.background.tertiary,
  },
  inputCheckmark: {
    position: 'absolute',
    top: -6,
    right: -2,
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    padding: 1,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 20,
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: 20,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.white,
  },
  resendSection: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.weight.medium,
  },
  resendButton: {
    fontSize: Typography.size.base,
    color: Colors.brand.green,
    fontWeight: Typography.weight.semibold,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: Colors.text.tertiary,
    textDecorationLine: 'none',
  },
  autoFillNotification: {
    backgroundColor: Colors.brand.green,
    borderRadius: 12,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.md,
    minHeight: 44,
    minWidth: 200,
    alignSelf: 'center',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    minHeight: 44,
  },
  notificationText: {
    color: Colors.brand.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.sm,
    flex: 1,
    textAlign: 'left',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 16,
  },
});