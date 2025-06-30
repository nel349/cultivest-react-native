import React, { useState, useEffect } from 'react';
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
  Zap} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import { celebrationManager } from '@/utils/celebration';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import 'react-native-url-polyfill/auto';
import * as WebBrowser from 'expo-web-browser';
import TestnetFundingModal from './TestnetFundingModal';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

// Type definitions for wallet responses
// Import types from organized type files
import { WalletResponse } from '../types';

const { width } = Dimensions.get('window');

interface FundingModalProps {
  visible: boolean;
  onClose: () => void;
  onFundingInitiated?: () => void;
  userID: string;
  prefilledAmount?: string;
  purchaseType?: 'bitcoin' | 'crypto'; // 'bitcoin' for direct Bitcoin investment, 'crypto' for general crypto
}

export default function FundingModal({
  visible,
  onClose,
  onFundingInitiated,
  userID,
  prefilledAmount,
  purchaseType = 'crypto' as 'bitcoin' | 'crypto'
}: FundingModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedAmount, setSelectedAmount] = useState(prefilledAmount ? parseFloat(prefilledAmount) : 10);
  const [customAmount, setCustomAmount] = useState(prefilledAmount || '');
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomAmount, setUseCustomAmount] = useState(!!prefilledAmount);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [showTestnetFunding, setShowTestnetFunding] = useState(false);
  
  // New state for crypto selection - update when purchaseType changes
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'algo' | 'sol'>(
    purchaseType === 'bitcoin' ? 'btc' : 'algo'
  );

  // Update selected crypto when purchaseType changes
  useEffect(() => {
    const isBitcoinMode = purchaseType.includes('bitcoin');
    if (isBitcoinMode) {
      setSelectedCrypto('btc');
    } else if (selectedCrypto === 'btc') {
      // If we're switching to crypto mode and Bitcoin was selected, switch to Algorand
      setSelectedCrypto('algo');
    }
  }, [purchaseType, selectedCrypto]);
  const [availableWallets, setAvailableWallets] = useState<{
    bitcoin?: string;
    algorand?: string;
    solana?: string;
  }>({});

  const presetAmounts = [20, 40, 80, 100];

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

  // Get currency code based on selected crypto
  const getCurrencyCode = () => {
    switch (selectedCrypto) {
      case 'btc': return 'btc';
      case 'algo': return 'algo';
      case 'sol': return 'sol';
      default: return 'algo';
    }
  };

  // Initialize MoonPay SDK with dynamic configuration
  const { openWithInAppBrowser } = useMoonPaySdk({
    sdkConfig: {
      debug: true,
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: process.env.EXPO_PUBLIC_MOONPAY_API_KEY || 'pk_test_123',
        defaultCurrencyCode: getCurrencyCode(),
        currencyCode: getCurrencyCode(),
        // theme: 'dark',
        colorCode: '%2310B981', // URL encoded #10B981
        walletAddress: walletAddress,
      },
    },
    browserOpener: {
      open: async (url: string) => {
        // Get current amount, wallet, and purchase type from stored values to avoid closure issues
        const currentAmount = (window as any).currentFundingAmount || getActualAmount();
        const currentWallet = (window as any).currentWalletAddress || walletAddress;
        const currentPurchaseType = (window as any).currentPurchaseType || purchaseType;
        
        console.log('🌐 Original MoonPay URL:', url);
        console.log('🔍 Using amount from storage:', currentAmount);
        console.log('🔍 Using wallet from storage:', currentWallet);
        console.log('🔍 Using purchase type from storage:', currentPurchaseType);
        
        // Parse the URL and add/update parameters
        const urlObj = new URL(url);
        
        // Set currency based on selected crypto type
        const currentSelectedCrypto = (window as any).currentSelectedCrypto || selectedCrypto;
        let currencyCode = 'algo'; // Default fallback
        
        switch (currentSelectedCrypto) {
          case 'btc':
            currencyCode = 'btc';
            console.log('🪙 Setting currency to Bitcoin (BTC)');
            break;
          case 'algo':
            currencyCode = 'algo';
            console.log('⚡ Setting currency to Algorand (ALGO)');
            break;
          case 'sol':
            currencyCode = 'sol';
            console.log('🌟 Setting currency to Solana (SOL)');
            break;
          default:
            console.log('🚀 Using default currency (ALGO)');
        }
        
        urlObj.searchParams.set('currencyCode', currencyCode);
        urlObj.searchParams.set('defaultCurrencyCode', currencyCode);
        
        // Add current amount
        urlObj.searchParams.set('baseCurrencyAmount', currentAmount.toString());
        
        // Add wallet address if available
        if (currentWallet) {
          urlObj.searchParams.set('walletAddress', currentWallet);
        }
        

        
        // Configure MoonPay experience based on purchase type
        if (currentPurchaseType === 'bitcoin') {
          // Bitcoin-focused experience
          urlObj.searchParams.set('lockAmount', 'false'); // Allow amount adjustment
          urlObj.searchParams.set('showAllCurrencies', 'false'); // Focus on Bitcoin
          urlObj.searchParams.set('showWalletAddressForm', 'false'); // Use provided wallet
        } else {
          // General crypto experience - allow more flexibility
          urlObj.searchParams.set('lockAmount', 'false'); // Allow amount adjustment
          urlObj.searchParams.set('showAllCurrencies', 'true'); // Show crypto options
          urlObj.searchParams.set('showWalletAddressForm', 'true'); // Allow wallet input
        }
        
        const finalUrl = urlObj.toString();
        console.log('🌐 Updated MoonPay URL:', finalUrl);
        console.log('🔍 URL contains amount:', finalUrl.includes(`baseCurrencyAmount=${currentAmount}`));
        console.log('🔍 URL contains wallet:', currentWallet ? finalUrl.includes('walletAddress') : 'No wallet set');
        console.log('🔍 URL contains currency:', finalUrl.includes('currencyCode'));
        
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
    console.log('- Purchase Type:', purchaseType);
    console.log('- Selected Crypto:', selectedCrypto);
    console.log('- Currency Code:', getCurrencyCode());
    console.log('- Wallet Address:', walletAddress);
    console.log('- Amount:', getActualAmount());
    console.log('- Selected Amount:', selectedAmount);
    console.log('- Custom Amount:', customAmount);
    console.log('- Use Custom Amount:', useCustomAmount);
    console.log('- Available Wallets:', availableWallets);
    console.log('- Environment: sandbox');
  }, [walletAddress, selectedAmount, customAmount, useCustomAmount, purchaseType, selectedCrypto, availableWallets]);

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


  // Get all wallet addresses on component mount
  useEffect(() => {
    const fetchWalletAddresses = async () => {
      if (!userID) {
        console.log('⚠️ No userID provided to FundingModal');
        setWalletLoading(false);
        return;
      }

      setWalletLoading(true);
      try {
        const walletResponse = await apiClient.getWalletBalance(userID, false) as WalletResponse;
        console.log('🔍 Wallet response:', walletResponse);
        console.log('🔍 Available addresses:', walletResponse.addresses);
        
        if (walletResponse.success && walletResponse.addresses) {
          // Store all available wallet addresses
          setAvailableWallets({
            bitcoin: walletResponse.addresses.bitcoin,
            algorand: walletResponse.addresses.algorand,
            solana: walletResponse.addresses.solana
          });
          
          console.log('✅ All wallet addresses loaded:', {
            bitcoin: walletResponse.addresses.bitcoin,
            algorand: walletResponse.addresses.algorand,
            solana: walletResponse.addresses.solana
          });
        } else {
          console.log('⚠️ No wallet found, attempting to create one...');
          
          // Try to create a wallet if none exists
          const createResponse = await apiClient.createWallet(userID) as WalletResponse;

          if (createResponse.success && createResponse.wallet) {
            setAvailableWallets({
              bitcoin: createResponse.wallet.bitcoinAddress,
              algorand: createResponse.wallet.algorandAddress,
              solana: createResponse.wallet.solanaAddress
            });
            
            console.log('✅ New wallet created with addresses:', {
              bitcoin: createResponse.wallet.bitcoinAddress,
              algorand: createResponse.wallet.algorandAddress,
              solana: createResponse.wallet.solanaAddress
            });
          } else {
            console.error('❌ Failed to create wallet:', createResponse.error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet addresses:', error);
      } finally {
        setWalletLoading(false);
      }
    };

    if (userID && visible) {
      fetchWalletAddresses();
    }
  }, [userID, visible]);

  // Update wallet address when crypto selection changes
  useEffect(() => {
    const getWalletForCrypto = () => {
      switch (selectedCrypto) {
        case 'btc':
          return availableWallets.bitcoin || '';
        case 'algo':
          return availableWallets.algorand || '';
        case 'sol':
          return availableWallets.solana || '';
        default:
          return '';
      }
    };
    
    setWalletAddress(getWalletForCrypto());
  }, [selectedCrypto, availableWallets]);

  const estimatedCrypto = (amount: number) => {
    // Based on MoonPay fees: ~3.8% total fees
    return amount * 0.962; // ~96.2% efficiency after fees
  };

  const handleInitiateFunding = async () => {
    const amount = getActualAmount();
    
    if (!userID) {
      Alert.alert('Error', 'Please log in to make investments');
      return;
    }

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
      console.log('🚀 Preparing MoonPay for cryptocurrency purchase:', { 
        amount, 
        userID, 
        walletAddress, 
        purchaseType,
        selectedCrypto: purchaseType === 'bitcoin' ? 'btc' : selectedCrypto
      });
      
      // Store fresh values for browser opener (needed due to closure issues)
      (window as any).currentFundingAmount = amount;
      (window as any).currentWalletAddress = walletAddress;
      (window as any).currentPurchaseType = purchaseType;
      (window as any).currentSelectedCrypto = selectedCrypto;
            
      // Check if we're in testnet/development mode
      const isTestnetMode = process.env.EXPO_PUBLIC_API_URL?.includes('localhost') || 
                           process.env.NODE_ENV === 'development';
      
      if (isTestnetMode) {
        // Show testnet funding option since MoonPay doesn't work on testnet
        Alert.alert(
          'Development Mode Detected',
          'MoonPay sandbox doesn\'t process real transactions. Would you like to get coins even if transaction fails? This will create an investment after you complete the moonpay flow. If you don\'t want to create an investment, you can cancel the flow and try again.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                console.log('❌ User cancelled funding');
                onClose();
                setIsLoading(false);
              }
            },
            // {
            //   text: 'Use Testnet Faucets',
            //   style: 'default',
            //   onPress: () => {
            //     console.log('🚰 Opening testnet funding modal');
            //     onClose(); // Close MoonPay modal first
            //     setIsLoading(false);
            //     setTimeout(() => {
            //       setShowTestnetFunding(true);
            //     }, 500); // Small delay for smooth transition
            //   }
            // },
            {
              text: 'Continue with MoonPay',
              style: 'default',
              onPress: async () => {
                console.log('🌙 User chose to continue with MoonPay despite testnet mode');
                                 // Store user preference for auto-funding on failure
                 console.log('🏁 Storing auto-fund preference for user in dev mode');
                 try {
                   await apiClient.request('/debug/set-auto-fund-preference', {
                     method: 'POST',
                     body: JSON.stringify({ userID, autoFundOnFailure: true }),
                   }, true);
                 } catch (error) {
                   console.error('Failed to store auto-fund preference:', error);
                 }
                
                try {
                  // Open MoonPay browser - webhook will handle investment creation
                  await openWithInAppBrowser();
                  console.log('✅ MoonPay browser opened successfully');
                  
                  // Start monitoring for first investment completion
                  console.log('👀 Starting celebration monitoring for potential first investment');
                  celebrationManager.startMonitoringFirstInvestment(userID);
                  
                  onClose();
                } catch (error) {
                  console.error('❌ Failed to open MoonPay:', error);
                  Alert.alert('Error', 'Failed to open MoonPay. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }
            }
          ]
        );
      } else {
        // Production mode - directly open MoonPay
        console.log('💡 Production mode - opening MoonPay directly');
        try {
          await openWithInAppBrowser();
          console.log('✅ MoonPay browser opened successfully');
          
          // Start monitoring for first investment completion
          console.log('👀 Starting celebration monitoring for potential first investment');
          celebrationManager.startMonitoringFirstInvestment(userID);
          
          onClose();
        } catch (error) {
          console.error('❌ Failed to open MoonPay:', error);
          Alert.alert('Error', 'Failed to open MoonPay. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }

    } catch (error) {
      console.error('❌ Funding error:', error);
      Alert.alert('Error', 'Failed to open payment interface. Please try again.');
      setIsLoading(false);
    }
  };



  const handleTestnetFundingComplete = () => {
    console.log('✅ Testnet funding completed');
    setShowTestnetFunding(false);
    
    // Notify parent component that funding was completed
    if (onFundingInitiated) {
      onFundingInitiated();
    }
    
    // Show success message
    Alert.alert(
      'Testnet Funding Complete! 🎉',
      'Your wallet has been funded with test tokens. You can now try the investment features.',
      [{ text: 'Continue', onPress: () => {} }]
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
          <LinearGradient
            colors={[Colors.background.primary, Colors.background.secondary]}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {purchaseType === 'bitcoin' ? 'Buy Bitcoin ₿' : 'Buy Cryptocurrency 🚀'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* How it works info */}
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Info size={20} color={Colors.brand.green} />
                  <Text style={styles.infoTitle}>How Funding Works</Text>
                </View>
                <Text style={styles.infoText}>
                  {purchaseType === 'bitcoin' 
                    ? '💳 Pay with credit card → ₿ Receive Bitcoin directly → 🏦 Stored in your secure custodial wallet'
                    : `💳 Pay with credit card → ${selectedCrypto === 'btc' ? '₿' : selectedCrypto === 'algo' ? '⚡' : '🌟'} Receive ${selectedCrypto === 'btc' ? 'Bitcoin' : selectedCrypto === 'algo' ? 'Algorand' : 'Solana'} directly → 🏦 Stored in your secure wallet`
                  }
                </Text>
              </View>

              {/* Crypto Selection - Only show for 'crypto' purchase type */}
              {purchaseType === 'crypto' && (
                <View style={styles.cryptoSection}>
                  <Text style={styles.sectionTitle}>Choose Cryptocurrency</Text>
                  <View style={styles.cryptoGrid}>
                  {[
                    { 
                      key: 'btc', 
                      name: 'Bitcoin', 
                      symbol: '₿', 
                      address: availableWallets.bitcoin,
                      color: '#F7931A' 
                    },
                    { 
                      key: 'algo', 
                      name: 'Algorand', 
                      symbol: '⚡', 
                      address: availableWallets.algorand,
                      color: '#00D4AA' 
                    },
                    { 
                      key: 'sol', 
                      name: 'Solana', 
                      symbol: '🌟', 
                      address: availableWallets.solana,
                      color: '#9945FF' 
                    }
                  ].filter(crypto => {
                    // If purchaseType is 'crypto' (Buy Crypto button), exclude Bitcoin
                    // If purchaseType is 'bitcoin' (Buy Bitcoin button), only show Bitcoin
                    const isBitcoinMode = purchaseType.includes('bitcoin');
                    if (isBitcoinMode) {
                      return crypto.key === 'btc';
                    } else {
                      return crypto.key !== 'btc'; // Exclude Bitcoin for "Buy Crypto"
                    }
                  }).map((crypto) => (
                      <TouchableOpacity
                        key={crypto.key}
                        style={[
                          styles.cryptoOption,
                          selectedCrypto === crypto.key && styles.cryptoOptionSelected,
                          !crypto.address && styles.cryptoOptionDisabled
                        ]}
                        onPress={() => crypto.address && setSelectedCrypto(crypto.key as 'btc' | 'algo' | 'sol')}
                        disabled={!crypto.address}
                      >
                        <View style={styles.cryptoHeader}>
                          <View style={[styles.cryptoIcon, { backgroundColor: crypto.color }]}>
                            <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                          </View>
                          <View style={styles.cryptoInfo}>
                            <Text style={[
                              styles.cryptoName,
                              selectedCrypto === crypto.key && styles.cryptoNameSelected,
                              !crypto.address && styles.cryptoNameDisabled
                            ]}>
                              {crypto.name}
                            </Text>
                            <Text style={styles.cryptoCode}>
                              {crypto.key.toUpperCase()}
                            </Text>
                          </View>
                          {selectedCrypto === crypto.key && (
                            <View style={styles.selectedIndicator}>
                              <Text style={styles.selectedCheckmark}>✓</Text>
                            </View>
                          )}
                        </View>
                        {crypto.address && (
                          <Text style={styles.walletAddress} numberOfLines={1}>
                            {crypto.address.substring(0, 12)}...{crypto.address.substring(crypto.address.length - 8)}
                          </Text>
                        )}
                        {!crypto.address && (
                          <Text style={styles.walletUnavailable}>
                            Wallet not available
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

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
                  <DollarSign size={20} color={useCustomAmount ? Colors.brand.green : Colors.text.tertiary} />
                  <TextInput
                    style={[styles.customAmountInput, useCustomAmount && styles.customAmountInputSelected]}
                    placeholder="Custom amount"
                    placeholderTextColor={Colors.text.tertiary}
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
                    <Text style={styles.feeLabel}>MoonPay fees (~3.8%)</Text>
                    <Text style={styles.feeValue}>-${(getActualAmount() * 0.038).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.feeRow, styles.feeRowTotal]}>
                    <Text style={styles.feeLabelTotal}>Crypto for investing</Text>
                    <Text style={styles.feeValueTotal}>~${estimatedCrypto(getActualAmount()).toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsSection}>
                <View style={styles.benefitItem}>
                  <Zap size={16} color={Colors.brand.green} />
                  <Text style={styles.benefitText}>
                    {purchaseType === 'bitcoin' 
                      ? 'Direct Bitcoin ownership - no intermediaries'
                      : 'Wide selection of cryptocurrencies'
                    }
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <CreditCard size={16} color={Colors.brand.green} />
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
                  colors={(isLoading || walletLoading) ? [Colors.text.tertiary, Colors.text.tertiary] : Colors.gradients.primary}
                  style={styles.fundButtonGradient}
                >
                  <Text style={styles.fundButtonText}>
                    {walletLoading ? 'Setting up wallet...' : 
                     isLoading ? 'Opening MoonPay...' : 
                     !walletAddress ? 'Wallet required' :
                     `Fund with $${getActualAmount().toFixed(2)}`}
                  </Text>
                  {!isLoading && !walletLoading && walletAddress && <ArrowRight size={20} color={Colors.text.primary} />}
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

      {/* Testnet Funding Modal - Shows when MoonPay doesn't work on testnet */}
      <TestnetFundingModal
        visible={showTestnetFunding}
        onClose={() => setShowTestnetFunding(false)}
        userID={userID}
        onFundingComplete={handleTestnetFundingComplete}
        initialWalletAddress={walletAddress} // Pass the wallet address
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: Spacing.xl,
    borderTopRightRadius: Spacing.xl,
    overflow: 'hidden',
    backgroundColor: Colors.background.primary,
  },
  modalGradient: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  cryptoSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  cryptoGrid: {
    gap: Spacing.md,
  },
  cryptoOption: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.sm,
  },
  cryptoOptionSelected: {
    borderColor: Colors.brand.green,
    backgroundColor: Colors.background.tertiary,
  },
  cryptoOptionDisabled: {
    opacity: 0.5,
  },
  cryptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cryptoSymbol: {
    fontSize: 20,
    color: Colors.text.primary,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  cryptoNameSelected: {
    color: Colors.brand.green,
  },
  cryptoNameDisabled: {
    color: Colors.text.tertiary,
  },
  cryptoCode: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckmark: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  walletAddress: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontFamily: 'monospace',
  },
  walletUnavailable: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  amountSection: {
    marginBottom: Spacing.lg,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  presetButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    borderColor: Colors.brand.green,
    backgroundColor: Colors.background.tertiary,
  },
  presetButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  presetButtonTextSelected: {
    color: Colors.brand.green,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  customAmountSelected: {
    borderColor: Colors.brand.green,
    backgroundColor: Colors.background.tertiary,
  },
  customAmountInput: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  customAmountInputSelected: {
    color: Colors.text.primary,
  },
  feeSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  feeBreakdown: {
    gap: Spacing.sm,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeRowTotal: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  feeLabel: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
  },
  feeValue: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  feeLabelTotal: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  feeValueTotal: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
  },
  benefitsSection: {
    marginBottom: Spacing['2xl'],
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  benefitText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  fundButton: {
    borderRadius: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  fundButtonDisabled: {
    opacity: 0.5,
  },
  fundButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: Spacing.lg,
    gap: Spacing.sm,
  },
  fundButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  disclaimer: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 18,
  },
});