import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageSquare, Leaf, Sprout, Flower, CheckCircle } from 'lucide-react-native';
import { apiClient } from '@/utils/api';

export default function VerifyOTPScreen() {
  const { phoneNumber, userID } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      // Mock data for development
      router.push('/(auth)/kyc');
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setCountdown(60);
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#89E5AB', '#58CC02']}
      style={styles.container}
    >
      {/* Decorative Plants */}
      <View style={styles.decorationContainer}>
        <View style={[styles.plantDecor, { top: 80, left: 25 }]}>
          <Leaf size={18} color="rgba(255,255,255,0.3)" />
        </View>
        <View style={[styles.plantDecor, { top: 160, right: 30 }]}>
          <Sprout size={16} color="rgba(255,255,255,0.2)" />
        </View>
        <View style={[styles.plantDecor, { bottom: 120, left: 40 }]}>
          <Flower size={20} color="rgba(255,255,255,0.25)" />
        </View>
      </View>

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Seed 🌱</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MessageSquare size={32} color="#58CC02" />
            <View style={styles.checkBadge}>
              <CheckCircle size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Check your messages 📱</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>+1 {phoneNumber}</Text>
          </Text>
        </View>

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
              />
              {digit && (
                <View style={styles.inputCheckmark}>
                  <CheckCircle size={16} color="#58CC02" />
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
            colors={isLoading ? ['#A0A0A0', '#808080'] : ['#FFFFFF', '#F0F0F0']}
            style={styles.buttonGradient}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? 'Growing...' : 'Continue Growing 🌿'}
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
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 32,
    position: 'relative',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
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
  phoneNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  otpInputContainer: {
    position: 'relative',
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#58CC02',
    backgroundColor: '#FFFFFF',
  },
  inputCheckmark: {
    position: 'absolute',
    top: -6,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 1,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 20,
    marginBottom: 32,
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
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  resendSection: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  resendButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resendButtonDisabled: {
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'none',
  },
});