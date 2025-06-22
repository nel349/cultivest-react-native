import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Zap,
  Coins
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/api';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

interface TestnetFundingModalProps {
  visible: boolean;
  onClose: () => void;
  userID: string;
  onFundingComplete?: () => void;
  initialWalletAddress?: string;
}

interface FundingStatus {
  walletAddress: string;
  currentBalance: {
    algo: number;
    usdca: number;
  };
  algoFunded: boolean;
  usdcaFunded: boolean;
  isOptedIntoUSDCa?: boolean;
  readyForInvestment: boolean;
  nextSteps: string;
}

export default function TestnetFundingModal({
  visible,
  onClose,
  userID,
  onFundingComplete,
  initialWalletAddress
}: TestnetFundingModalProps) {
  const insets = useSafeAreaInsets();
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>(initialWalletAddress || '');
  const [step, setStep] = useState<'instructions' | 'opt-in' | 'status'>('instructions');

  // Set initial wallet address when provided
  useEffect(() => {
    if (initialWalletAddress) {
      setWalletAddress(initialWalletAddress);
      console.log('🔍 Using initial wallet address:', initialWalletAddress);
    }
  }, [initialWalletAddress]);

  // Get initial funding status
  useEffect(() => {
    if (visible && userID) {
      checkFundingStatus();
    }
  }, [visible, userID]);

  // Auto-refresh status when app comes back to foreground
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        checkFundingStatus();
      }, 30000); // Check every 30 seconds when modal is open

      return () => clearInterval(interval);
    }
  }, [visible]);

  const checkFundingStatus = async () => {
    try {
      const response = await apiClient.request(`/wallet/balance?userId=${userID}&live=true`, {}, true);
      
      if (response.success) {

        const algoBalance = response.balance?.onChainBalance?.algo || 0;
        const usdcaBalance = response.balance?.onChainBalance?.usdca || 0;
        const isOptedIn = response.balance?.onChainBalance?.isOptedIntoUSDCa || false;
        
        const fundingStatus = {
          walletAddress: response.walletAddress,
          currentBalance: {
            algo: algoBalance,
            usdca: usdcaBalance,
          },
          algoFunded: algoBalance > 0,
          usdcaFunded: usdcaBalance > 0,
          isOptedIntoUSDCa: isOptedIn,
          readyForInvestment: algoBalance > 0 && usdcaBalance > 0,
          nextSteps: algoBalance > 0 && usdcaBalance > 0 ? 'Continue to Investment' : 
                     !isOptedIn ? 'Need to opt into USDCa or use Circle faucet' :
                     algoBalance === 0 ? 'Need ALGO for transaction fees' : 
                     'Need USDCa tokens',
        }
        setFundingStatus(fundingStatus as FundingStatus);
        
        // Set wallet address if not already set
        if (response.walletAddress && !walletAddress) {
          setWalletAddress(response.walletAddress);
          console.log('🔍 Got wallet address from status:', response.walletAddress);
        }
        
        // Auto-advance to status if already funded
        if ((response as any).readyForInvestment) {
          setStep('status');
        }
      }
    } catch (error) {
      console.error('Failed to check funding status:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      console.log('📋 Copied to clipboard:', text);
      Alert.alert(
        'Copied! 📋', 
        'Wallet address copied to clipboard. You can now paste it in the Algorand dispenser.',
        [{ text: 'Got it!', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Alert.alert('Error', 'Failed to copy address. Please manually select and copy the address above.');
    }
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open this URL');
    }
  };

  const handleOptInUSDCa = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.request('/debug/opt-in-usdca', {
        method: 'POST',
        body: JSON.stringify({ userID }),
      }, true);

      if (response.success) {
        Alert.alert(
          'Success!', 
          'Your wallet is now ready to receive USDCa tokens. You can proceed to get test USDCa.',
          [{ text: 'OK', onPress: () => setStep('status') }]
        );
        checkFundingStatus();
      } else {
        Alert.alert('Error', response.error || 'Failed to opt into USDCa');
      }
    } catch (error) {
      console.error('Opt-in error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInstructions = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.warningBanner}>
        <AlertCircle size={20} color="#F59E0B" />
        <Text style={styles.warningText}>
          Testnet Development Mode - Free test tokens only
        </Text>
      </View>

      <Text style={styles.description}>
        Since MoonPay doesn't work on testnet, we'll use free testnet faucets to get ALGO and USDCa for testing the investment features.
      </Text>

      {/* Step 1: Get ALGO */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <Coins size={24} color="#58CC02" />
          <Text style={styles.stepTitle}>Step 1: Get Test ALGO</Text>
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Your Wallet Address:</Text>
          <TouchableOpacity 
            style={styles.addressRow}
            onPress={() => copyToClipboard(walletAddress)}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText} numberOfLines={1}>
              {walletAddress || 'Loading wallet address...'}
            </Text>
            <View style={styles.copyButton}>
              <Copy size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {walletAddress && (
            <Text style={styles.copyHint}>👆 Tap to copy address</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openLink('https://bank.testnet.algorand.network/')}
        >
          <Text style={styles.actionButtonText}>Open ALGO Dispenser</Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepDescription}>Click "Open ALGO Dispenser" above</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepDescription}>Paste your wallet address</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepDescription}>Request 10 ALGO tokens</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepDescription}>Wait 30-60 seconds, then check status below</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton, { marginTop: 16 }]}
          onPress={checkFundingStatus}
        >
          <Text style={styles.secondaryButtonText}>Check My Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Step 2: Opt into USDCa */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <Zap size={24} color="#58CC02" />
          <Text style={styles.stepTitle}>Step 2: Enable USDCa Tokens</Text>
        </View>
        
        <Text style={styles.stepInstructions}>
          Enable your wallet to receive USDCa stablecoins (the tokens you'll invest with).
          {'\n\n'}This involves:
          {'\n'}• Opting into the USDCa asset (one-time setup)
          {'\n'}• Getting test USDCa tokens from community faucets
          {'\n'}• Verifying you have tokens for investment testing
        </Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => setStep('opt-in')}
        >
          <Text style={styles.secondaryButtonText}>
            Continue to USDCa Setup
          </Text>
        </TouchableOpacity>
        
        {!fundingStatus?.algoFunded && (
          <Text style={styles.warningNote}>
            ⚠️ You'll need some ALGO for transaction fees (~0.001 ALGO)
          </Text>
        )}
      </View>

      {fundingStatus && (
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Current Status:</Text>
          <View style={styles.statusRow}>
            <CheckCircle size={16} color={fundingStatus.algoFunded ? "#10B981" : "#9CA3AF"} />
            <Text style={styles.statusText}>
              ALGO: {fundingStatus.currentBalance.algo.toFixed(4)}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <CheckCircle size={16} color={fundingStatus.usdcaFunded ? "#10B981" : "#9CA3AF"} />
            <Text style={styles.statusText}>
              USDCa: {fundingStatus.currentBalance.usdca.toFixed(2)}
              {fundingStatus.isOptedIntoUSDCa === false && " (not opted in)"}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderOptIn = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Your wallet needs to "opt-in" to receive USDCa tokens. Choose your method:
      </Text>
      
      <View style={styles.methodCard}>
        <Text style={styles.methodTitle}>🎯 Easy Method: Circle Faucet (Recommended)</Text>
        <Text style={styles.methodSubtitle}>Automatic opt-in + tokens in one step!</Text>
        <Text style={styles.methodDescription}>
          Circle's faucet automatically opts-in your wallet and gives you USDCa tokens. No ALGO fees required.
        </Text>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Your Wallet Address:</Text>
          <TouchableOpacity 
            style={styles.addressRow}
            onPress={() => copyToClipboard(walletAddress)}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText} numberOfLines={1}>
              {walletAddress || 'Loading wallet address...'}
            </Text>
            <View style={styles.copyButton}>
              <Copy size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {walletAddress && (
            <Text style={styles.copyHint}>👆 Tap to copy address</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { marginTop: 12 }]}
          onPress={() => openLink(`https://faucet.circle.com/`)}
        >
          <Text style={styles.actionButtonText}>Get USDCa from Circle</Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.methodCard}>
        <Text style={styles.methodTitle}>⚙️ Manual Method: Opt-in First</Text>
        <Text style={styles.methodDescription}>
          Manually opt-in your wallet, then get tokens from Discord faucet.
        </Text>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Your Wallet Address:</Text>
          <TouchableOpacity 
            style={styles.addressRow}
            onPress={() => copyToClipboard(walletAddress)}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText} numberOfLines={1}>
              {walletAddress || 'Loading wallet address...'}
            </Text>
            <View style={styles.copyButton}>
              <Copy size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {walletAddress && (
            <Text style={styles.copyHint}>👆 Tap to copy for manual methods</Text>
          )}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>What is Asset Opt-In?</Text>
        <Text style={styles.infoText}>
          • On Algorand, wallets must explicitly allow each asset type{'\n'}
          • This prevents spam tokens and gives you control{'\n'}
          • Costs a small ALGO fee (≈0.001 ALGO){'\n'}
          • Only needed once per asset
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
        onPress={handleOptInUSDCa}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>
          {isLoading ? 'Opting In...' : 'Opt Into USDCa Asset'}
        </Text>
        {!isLoading && <Zap size={16} color="#FFFFFF" />}
      </TouchableOpacity>

      <Text style={styles.note}>
        Make sure you have at least 0.1 ALGO in your wallet before proceeding.
      </Text>

      {/* After opt-in instructions */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>After Opt-In: Get Test USDCa</Text>
        <Text style={styles.infoText}>
          Once opted in, you'll need test USDCa tokens for investment testing:
        </Text>
        
        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepDescription}>Visit Algorand Discord #faucet channel</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepDescription}>Request: "/faucet send [your-address] asset:10458941 amount:100"</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepDescription}>Wait for community member to fulfill (usually 5-15 minutes)</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepDescription}>Check your balance in the status tab</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton, { marginTop: 16 }]}
          onPress={() => openLink(`https://discord.gg/algorand`)}
        >
          <Text style={styles.actionButtonText}>Join Algorand Discord</Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton, { marginTop: 8 }]}
          onPress={() => openLink(`https://testnet.algoexplorer.io/asset/10458941`)}
        >
          <Text style={styles.secondaryButtonText}>View USDCa Asset Info</Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStatus = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {fundingStatus?.readyForInvestment ? (
        <View style={styles.successCard}>
          <CheckCircle size={48} color="#10B981" />
          <Text style={styles.successTitle}>Ready for Testing! 🎉</Text>
          <Text style={styles.successText}>
            Your wallet is funded and ready to test investment features.
          </Text>
        </View>
      ) : (
        <View style={styles.pendingCard}>
          <AlertCircle size={48} color="#F59E0B" />
          <Text style={styles.pendingTitle}>Next Steps</Text>
          <Text style={styles.pendingText}>
            {fundingStatus?.nextSteps || 'Continue following the funding steps.'}
          </Text>
          
          {/* Show USDCa acquisition guidance if needed */}
          {fundingStatus?.algoFunded && !fundingStatus?.usdcaFunded && (
            <View style={styles.guidanceCard}>
              <Text style={styles.guidanceTitle}>Need USDCa tokens? 💰</Text>
              <Text style={styles.guidanceText}>
                Visit Discord #faucet and use this command:
              </Text>
              <View style={styles.commandContainer}>
                <Text style={styles.commandText}>
                  /faucet send {walletAddress?.slice(0, 20)}... asset:10458941 amount:100
                </Text>
                <TouchableOpacity 
                  style={styles.copyCommandButton}
                  onPress={() => copyToClipboard(`/faucet send ${walletAddress} asset:10458941 amount:100`)}
                >
                  <Copy size={14} color="#58CC02" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton, { marginTop: 12 }]}
                onPress={() => openLink(`https://discord.gg/algorand`)}
              >
                <Text style={styles.actionButtonText}>Open Discord</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {fundingStatus && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Current Balance:</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>ALGO:</Text>
            <Text style={styles.balanceValue}>{fundingStatus.currentBalance.algo.toFixed(4)}</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>USDCa:</Text>
            <Text style={styles.balanceValue}>{fundingStatus.currentBalance.usdca.toFixed(2)}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={checkFundingStatus}
      >
        <Text style={styles.refreshButtonText}>Refresh Status</Text>
      </TouchableOpacity>

      {fundingStatus?.readyForInvestment && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            onFundingComplete?.();
            onClose();
          }}
        >
          <Text style={styles.continueButtonText}>Continue to Investment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

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
            colors={['#1E3A8A', '#3B82F6']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Testnet Funding</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {step === 'instructions' && renderInstructions()}
            {step === 'opt-in' && renderOptIn()}
            {step === 'status' && renderStatus()}
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
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  addressContainer: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginRight: 12,
  },
  copyButton: {
    backgroundColor: '#58CC02',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#58CC02',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepInstructions: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  note: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  pendingCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  pendingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepsList: {
    marginTop: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#58CC02',
    backgroundColor: 'rgba(88, 204, 2, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#58CC02',
  },
  guidanceCard: {
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#58CC02',
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  commandContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commandText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    flex: 1,
  },
  copyCommandButton: {
    padding: 4,
    marginLeft: 8,
  },
  warningNote: {
    fontSize: 12,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  methodSubtitle: {
    fontSize: 13,
    color: '#58CC02',
    fontWeight: '600',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  methodDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  methodCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
});