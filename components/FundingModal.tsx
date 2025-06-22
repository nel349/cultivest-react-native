import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  DollarSign,
  CreditCard,
  ArrowRight,
  Info,
  Zap,
  Target
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import 'react-native-url-polyfill/auto';
import * as WebBrowser from 'expo-web-browser';

const { width } = Dimensions.get('window');

interface FundingModalProps {
  visible: boolean;
  onClose: () => void;
  onFundingInitiated?: (transactionId: string) => void;
  userID: string;
}

export default function FundingModal({
  visible,
  onClose,
  onFundingInitiated,
  userID
}: FundingModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletLoading, setWalletLoading] = useState(false);

  const presetAmounts = [5, 10, 25, 50, 100];

  const getActualAmount = () => {
    return useCustomAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  };


  // Debug: Log environment variables
  useEffect(() => {
    console.log('🔍 Environment Debug:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- EXPO_PUBLIC_MOONPAY_API_KEY:', process.env.EXPO_PUBLIC_MOONPAY_API_KEY);
    console.log('- EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
    console.log('- All process.env keys:', Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC')));
  }, []);

  // Initialize MoonPay SDK with basic configuration (we'll override parameters manually)
  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } = useMoonPaySdk({
    sdkConfig: {
      debug: true,
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: process.env.EXPO_PUBLIC_MOONPAY_API_KEY || 'pk_test_123',
        defaultCurrencyCode: 'sol',
        // theme: 'dark',
        colorCode: '%2310B981', // URL encoded #10B981
        walletAddress: walletAddress,
      },
    },
    browserOpener: {
      open: async (url: string) => {
        // Get current amount and wallet from stored values to avoid closure issues
        const currentAmount = (window as any).currentFundingAmount || getActualAmount();
        const currentWallet = (window as any).currentWalletAddress || walletAddress;
        
        console.log('🌐 Original MoonPay URL:', url);
        console.log('🔍 Using amount from storage:', currentAmount);
        console.log('🔍 Using wallet from storage:', currentWallet);
        
        // Parse the URL and add/update parameters
        const urlObj = new URL(url);
        
        // Add current amount
        urlObj.searchParams.set('baseCurrencyAmount', currentAmount.toString());
        
        // Add wallet address if available
        if (currentWallet) {
          urlObj.searchParams.set('walletAddress', currentWallet);
        }
        
        const finalUrl = urlObj.toString();
        console.log('🌐 Updated MoonPay URL:', finalUrl);
        console.log('🔍 URL contains amount:', finalUrl.includes(`baseCurrencyAmount=${currentAmount}`));
        console.log('🔍 URL contains wallet:', currentWallet ? finalUrl.includes('walletAddress') : 'No wallet set');
        
        await WebBrowser.openBrowserAsync(finalUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        });
        console.log('🌐 MoonPay URL opened');
      },
    },
  });

  // Debug: Log SDK configuration
  useEffect(() => {
    console.log('🌙 MoonPay SDK Configuration:');
    console.log('- API Key being used:', process.env.EXPO_PUBLIC_MOONPAY_API_KEY || 'pk_test_123');
    console.log('- Wallet Address:', walletAddress);
    console.log('- Amount:', getActualAmount());
    console.log('- Selected Amount:', selectedAmount);
    console.log('- Custom Amount:', customAmount);
    console.log('- Use Custom Amount:', useCustomAmount);
    console.log('- Environment: sandbox');
  }, [walletAddress, selectedAmount, customAmount, useCustomAmount]);

  // TODO: Re-enable URL signing for production
  // Sign URL with backend when wallet address is ready
  // useEffect(() => {
  //   if (walletAddress && visible) {
  //     const signUrl = async () => {
  //       try {
  //         console.log('🔑 Generating URL for signing...');
  //         
  //         // Generate URL for signing with current parameters
  //         const urlToSign = generateUrlForSigning({ variant: 'inapp-browser' });
  //         console.log('🔗 URL to sign:', urlToSign);
  //         
  //         // Send to backend for signing
  //         const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/moonpay/sign-url`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${await AsyncStorage.getItem('auth_token')}`,
  //           },
  //           body: JSON.stringify({
  //             url: urlToSign,
  //           }),
  //         });

  //         const data = await response.json();
  //         
  //         if (data.success && data.signature) {
  //           console.log('✅ URL signed successfully');
  //           updateSignature(data.signature);
  //         } else {
  //           console.error('❌ URL signing failed:', data.error);
  //         }
  //       } catch (error) {
  //         console.error('❌ URL signing error:', error);
  //       }
  //     };

  //     signUrl();
  //   }
  // }, [walletAddress, visible, generateUrlForSigning, updateSignature]);


  // Get wallet address on component mount
  useEffect(() => {
    const fetchWalletAddress = async () => {
      setWalletLoading(true);
      try {
        const walletResponse = await apiClient.getWalletBalance(userID, false);
        console.log('🔍 Wallet response:', walletResponse);
        
        if (walletResponse.success && walletResponse.walletAddress) {
          setWalletAddress(walletResponse.walletAddress);
          console.log('✅ Wallet address set:', walletResponse.walletAddress);
        } else {
          console.log('⚠️ No wallet found, attempting to create one...');
          
          // Try to create a wallet if none exists
          const createResponse = await apiClient.createWallet(userID);
          if (createResponse.success && createResponse.walletAddress) {
            setWalletAddress(createResponse.walletAddress);
            console.log('✅ New wallet created:', createResponse.walletAddress);
          } else {
            console.error('❌ Failed to create wallet:', createResponse.error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet address:', error);
      } finally {
        setWalletLoading(false);
      }
    };

    if (userID && visible) {
      fetchWalletAddress();
    }
  }, [userID, visible]);

  const estimatedUSDCa = (amount: number) => {
    // Based on FUNDING_FLOW.md: ~3.5% MoonPay fee + ~0.3% DEX fee
    return amount * 0.962; // ~96.2% efficiency
  };

  const handleInitiateFunding = async () => {
    const amount = getActualAmount();
    
    if (amount < 1) {
      Alert.alert('Invalid Amount', 'Minimum funding amount is $1');
      return;
    }
    
    if (amount > 1000) {
      Alert.alert('Invalid Amount', 'Maximum funding amount is $1000');
      return;
    }

    if (!walletAddress) {
      Alert.alert('Error', 'Wallet address not found. Please ensure you have a wallet created.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Initiating funding with MoonPay SDK:', { amount, userID, walletAddress });
      
      // Create deposit record in backend first
      const depositResponse = await apiClient.initiateDeposit(amount, 'usdca');
      
      if (depositResponse.success) {
        console.log('✅ Backend deposit record created:', depositResponse.transactionId);

        // Debug: Check if openWithInAppBrowser is available
        console.log('🔍 MoonPay SDK ready:', typeof openWithInAppBrowser);
        console.log('🔍 About to call openWithInAppBrowser...');
        console.log('🔍 Current amount before opening:', amount);
        
        // Store current values in a way the browser opener can access them
        (window as any).currentFundingAmount = amount;
        (window as any).currentWalletAddress = walletAddress;
        
        // open the moonpay sdk
        await openWithInAppBrowser();
        console.log('🔍 openWithInAppBrowser call completed');
        
        // Notify parent component
        if (onFundingInitiated && depositResponse.transactionId) {
          onFundingInitiated(depositResponse.transactionId);
        }
        
        // Close the funding modal
        onClose();
        
      } else {
        console.error('❌ Deposit initiation failed:', depositResponse.error);
        Alert.alert('Error', depositResponse.error || 'Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('❌ Funding error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
          <LinearGradient
            colors={['#89E5AB', '#58CC02']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plant More Seeds 🌱</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* How it works info */}
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Info size={20} color="#58CC02" />
                  <Text style={styles.infoTitle}>How Funding Works</Text>
                </View>
                <Text style={styles.infoText}>
                  💳 Pay with credit card → ⚡ Receive ALGO → 💰 Auto-convert to USDCa stablecoins
                </Text>
              </View>

              {/* Amount Selection */}
              <View style={styles.amountSection}>
                <Text style={styles.sectionTitle}>Choose Amount</Text>
                
                {/* Preset amounts */}
                <View style={styles.presetGrid}>
                  {presetAmounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.presetButton,
                        !useCustomAmount && selectedAmount === amount && styles.presetButtonSelected
                      ]}
                      onPress={() => {
                        setSelectedAmount(amount);
                        setUseCustomAmount(false);
                      }}
                    >
                      <Text style={[
                        styles.presetButtonText,
                        !useCustomAmount && selectedAmount === amount && styles.presetButtonTextSelected
                      ]}>
                        ${amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Custom amount */}
                <TouchableOpacity
                  style={[styles.customAmountContainer, useCustomAmount && styles.customAmountSelected]}
                  onPress={() => setUseCustomAmount(true)}
                >
                  <DollarSign size={20} color={useCustomAmount ? "#58CC02" : "#8B9DC3"} />
                  <TextInput
                    style={[styles.customAmountInput, useCustomAmount && styles.customAmountInputSelected]}
                    placeholder="Custom amount"
                    placeholderTextColor="#8B9DC3"
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    keyboardType="numeric"
                    onFocus={() => setUseCustomAmount(true)}
                  />
                </TouchableOpacity>
              </View>

              {/* Fee breakdown */}
              <View style={styles.feeSection}>
                <Text style={styles.sectionTitle}>You'll Receive</Text>
                <View style={styles.feeBreakdown}>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>You pay</Text>
                    <Text style={styles.feeValue}>${getActualAmount().toFixed(2)}</Text>
                  </View>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>MoonPay + DEX fees (~3.8%)</Text>
                    <Text style={styles.feeValue}>-${(getActualAmount() * 0.038).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.feeRow, styles.feeRowTotal]}>
                    <Text style={styles.feeLabelTotal}>USDCa for investing</Text>
                    <Text style={styles.feeValueTotal}>~${estimatedUSDCa(getActualAmount()).toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsSection}>
                <View style={styles.benefitItem}>
                  <Zap size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>GENIUS Act compliant stablecoins</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Target size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>Auto-convert ALGO → USDCa</Text>
                </View>
                <View style={styles.benefitItem}>
                  <CreditCard size={16} color="#58CC02" />
                  <Text style={styles.benefitText}>Credit card, bank transfer, Apple Pay</Text>
                </View>
              </View>

              {/* Fund button */}
              <TouchableOpacity
                style={[styles.fundButton, (isLoading || walletLoading || getActualAmount() < 1 || !walletAddress) && styles.fundButtonDisabled]}
                onPress={handleInitiateFunding}
                disabled={isLoading || walletLoading || getActualAmount() < 1 || !walletAddress}
              >
                <LinearGradient
                  colors={(isLoading || walletLoading) ? ['#C0C0C0', '#C0C0C0'] : ['#FFFFFF', '#F0F0F0']}
                  style={styles.fundButtonGradient}
                >
                  <Text style={styles.fundButtonText}>
                    {walletLoading ? 'Setting up wallet...' : 
                     isLoading ? 'Opening MoonPay...' : 
                     !walletAddress ? 'Wallet required' :
                     `Fund with $${getActualAmount().toFixed(2)}`}
                  </Text>
                  {!isLoading && !walletLoading && walletAddress && <ArrowRight size={20} color="#58CC02" />}
                </LinearGradient>
              </TouchableOpacity>

              {/* Disclaimer */}
              <Text style={styles.disclaimer}>
                🔒 Powered by MoonPay. Your payment data is secure and never stored by Cultivest.
              </Text>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
  },
  amountSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  presetButton: {
    width: (width - 72) / 3,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#58CC02',
  },
  presetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  presetButtonTextSelected: {
    color: '#58CC02',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  customAmountSelected: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#58CC02',
  },
  customAmountInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  customAmountInputSelected: {
    color: '#2E7D32',
  },
  feeSection: {
    marginBottom: 24,
  },
  feeBreakdown: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  feeRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
    paddingTop: 12,
  },
  feeLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  feeValue: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '600',
  },
  feeLabelTotal: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '700',
  },
  feeValueTotal: {
    fontSize: 18,
    color: '#58CC02',
    fontWeight: '800',
  },
  benefitsSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    marginLeft: 12,
  },
  fundButton: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fundButtonDisabled: {
    opacity: 0.6,
  },
  fundButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  fundButtonText: {
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
    paddingBottom: 40,
  },
});