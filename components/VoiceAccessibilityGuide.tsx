'use dom';

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import Constants from 'expo-constants';
import { getAppInfo } from '@/utils/appInfo';
import { useConversation } from '@elevenlabs/react';
import tools from '@/utils/tools';
import { apiClient } from '@/utils/api';

interface UserAuthData {
  userID: string;
  userName: string;
  authToken: string;
}

interface VoiceAccessibilityGuideProps {
  dom?: import('expo/dom').DOMProps;
  userID: string;
  authData?: UserAuthData | null;
  onActivate?: (isActive: boolean) => void;
  onDeactivate?: (isActive: boolean) => void;
  activate?: boolean;
}

// Let ElevenLabs SDK handle microphone permissions internally
async function requestMicrophonePermission(hasNativePermission: boolean) {
  console.log('🎤 Trusting ElevenLabs SDK to handle microphone permissions');
  console.log('🔐 Native permission status:', hasNativePermission);

  // We have native permissions, so let ElevenLabs SDK handle the web side
  return true;
}

// Create context-aware tools that use passed authentication data instead of AsyncStorage
function createContextAwareTools(authData: UserAuthData | null) {
  return {
    get_auth_status: async () => {
      console.log('🎯 DOM Voice: Checking auth status with context data');
      try {
        const isAuthenticated = !!(authData?.authToken && authData?.userID);
        
        return isAuthenticated 
          ? `User is logged in as ${authData?.userName || 'Unknown User'}` 
          : 'User is not logged in';
      } catch (error) {
        console.error('Error checking auth status:', error);
        return 'Failed to check authentication status';
      }
    },

    get_portfolio_value: async () => {
      console.log('💰 DOM Voice portfolio: Getting total portfolio value');
      try {
        if (!authData?.userID) {
          console.log('💰 DOM Voice portfolio: No user ID found, user needs to log in');
          return 'Please log in to view your portfolio value';
        }

        if (!authData?.authToken) {
          console.log('💰 DOM Voice portfolio: No auth token found, user needs to log in');
          return 'Your session has expired. Please log in again to view your portfolio';
        }

        console.log('💰 DOM Voice portfolio: Using auth data:', {
          hasUserId: !!authData.userID,
          hasUserName: !!authData.userName,
          hasToken: !!authData.authToken,
        });

        // Make API call directly with authentication data
        console.log('💰 DOM Voice portfolio: Fetching wallet balance for user:', authData.userID);
        
        // Log the API URL being used
        console.log('🔗 DOM Voice portfolio: API URL from config:', {
          processEnv: process.env.EXPO_PUBLIC_API_URL,
          constantsConfig: Constants.expoConfig?.extra?.apiUrl,
          fallback: 'http://localhost:3000/api/v1'
        });
        
        // Log the exact API call being made
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api/v1';
        console.log('🌐 DOM Voice portfolio: Making API call to:', `${apiUrl}/wallet/balance?userId=${authData.userID}&live=true`);
        
        const result = await apiClient.getWalletBalance(authData.userID, true);
        console.log('💰 DOM Voice portfolio: Wallet balance result:', { success: result?.success, hasBalance: !!result?.balance });
        
        if (result?.success && result.balance) {
          const btcBalance = result.balance?.onChainBalance?.btc || result.balance?.databaseBalance?.btc || 0;
          const algoBalance = result.balance?.onChainBalance?.algo || result.balance?.databaseBalance?.algo || 0;
          const usdcBalance = result.balance?.onChainBalance?.usdca || result.balance?.databaseBalance?.usdca || 0;
          const solBalance = (result.balance?.onChainBalance as any)?.sol || (result.balance?.databaseBalance as any)?.sol || 0;

          console.log('💰 DOM Voice portfolio: Asset balances:', {
            btc: btcBalance,
            algo: algoBalance,
            usdc: usdcBalance,
            sol: solBalance
          });

          // Get live prices
          const pricesResult = await apiClient.request('/prices');
          let btcPrice = 97000, algoPrice = 0.40, solPrice = 95;
          
          if (pricesResult?.success && (pricesResult as any).prices) {
            btcPrice = (pricesResult as any).prices.bitcoin?.usd || btcPrice;
            algoPrice = (pricesResult as any).prices.algorand?.usd || algoPrice;
            solPrice = (pricesResult as any).prices.solana?.usd || solPrice;
          }

          const btcValue = btcBalance * btcPrice;
          const algoValue = algoBalance * algoPrice;
          const usdcValue = usdcBalance * 1.0;
          const solValue = solBalance * solPrice;
          const totalValue = btcValue + algoValue + usdcValue + solValue;

          console.log('💰 DOM Voice portfolio: Portfolio calculation:', {
            btcValue,
            algoValue,
            usdcValue,
            solValue,
            totalValue
          });

          if (totalValue === 0) {
            return `Hello ${authData.userName || 'investor'}! Your portfolio is currently empty. You can start investing by going to the invest tab or asking me to navigate there. Your wallets are ready for Bitcoin, Algorand, USDC, and Solana.`;
          }
          
          return `Hello ${authData.userName || 'investor'}! Your total portfolio is worth $${totalValue.toFixed(2)}. You have ${btcBalance.toFixed(8)} Bitcoin worth $${btcValue.toFixed(2)}, ${algoBalance.toFixed(2)} Algorand worth $${algoValue.toFixed(2)}, ${usdcBalance.toFixed(2)} USDC, and ${solBalance.toFixed(2)} Solana worth $${solValue.toFixed(2)}.`;
        } else {
          console.log('💰 DOM Voice portfolio: API call failed or no balance data:', result?.error);
          return `I'm having trouble accessing your portfolio data right now. This might be a temporary issue. Please try asking again, or check the portfolio tab in the app.`;
        }
      } catch (error) {
        console.error('💰 DOM Voice portfolio: Error getting portfolio value:', error);
        return 'I encountered an error while fetching your portfolio. Please try again or check the portfolio tab in the app.';
      }
    },

    get_bitcoin_performance: async () => {
      console.log('₿ DOM Voice portfolio: Getting Bitcoin performance');
      if (!authData?.userID) {
        return 'Please log in to view your Bitcoin performance';
      }
      if (!authData?.authToken) {
        return 'Your session has expired. Please log in again to view your Bitcoin performance';
      }
      
      // For now, delegate to original tool - this will be enhanced later
      return 'Bitcoin performance data will be available soon. Please check the portfolio tab for current Bitcoin holdings.';
    },

    get_algorand_balance: async () => {
      console.log('⚡ DOM Voice portfolio: Getting Algorand balance');
      if (!authData?.userID) {
        return 'Please log in to view your Algorand balance';
      }
      if (!authData?.authToken) {
        return 'Your session has expired. Please log in again to view your Algorand balance';
      }
      
      // For now, delegate to original tool - this will be enhanced later
      return 'Algorand balance data will be available soon. Please check the portfolio tab for current ALGO holdings.';
    },

    get_portfolio_nft_info: async () => {
      console.log('🎨 DOM Voice portfolio: Getting Portfolio NFT info');
      if (!authData?.userID) {
        return 'Please log in to view your Portfolio NFT information';
      }
      if (!authData?.authToken) {
        return 'Your session has expired. Please log in again to view your Portfolio NFT';
      }
      
      return 'Your Portfolio NFT is a unique digital certificate that tracks all your investments across Bitcoin, Algorand, and Solana. It updates in real-time with your performance data. You can view it in the portfolio tab.';
    },

    get_investment_gains: async () => {
      console.log('📈 DOM Voice portfolio: Getting investment gains');
      if (!authData?.userID) {
        return 'Please log in to view your investment gains';
      }
      if (!authData?.authToken) {
        return 'Your session has expired. Please log in again to view your gains';
      }
      
      // For now, provide general guidance - this will be enhanced later
      return 'Investment gains tracking will show your portfolio performance over time. Please check the portfolio tab for detailed performance metrics.';
    },
  };
}

export default function VoiceAccessibilityGuide({
  dom,
  userID,
  authData,
  onActivate,
  onDeactivate,
  activate,
}: VoiceAccessibilityGuideProps) {
  const [hasNativePermission, setHasNativePermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkNativePermissions();

    if (activate) { // if the voice guide is activated, start the voice guide. other components can set this to true to activate the voice guide.
      startVoiceGuide();
    }
    else  if (!activate) { // if the voice guide is deactivated, stop the voice guide. other components can set this to false to deactivate the voice guide.
      stopVoiceGuide();
    }
  }, [activate]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('🎤 Voice accessibility guide connected');
      onActivate?.(true);
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('🎤 Voice accessibility guide disconnected');
      onDeactivate?.(false);
      setIsConnected(false);
    },
    onMessage: (message) => {
      console.log('Voice message:', message);
    },
    onError: (error) => {
      console.error('Voice error:', error);
      setIsConnected(false);
    },
  });

  const startVoiceGuide = useCallback(async () => {
    console.log('🚀 DOM startVoiceGuide called');
    try {
      // Request microphone permission
      console.log(
        '🔐 Checking permissions, hasNativePermission:',
        hasNativePermission
      );
      const hasPermission = await requestMicrophonePermission(
        hasNativePermission
      );
      console.log('🔐 Permission result:', hasPermission);
      if (!hasPermission) {
        alert(
          'Microphone permission is needed for voice accessibility features'
        );
        return;
      }

      // Create context-aware tools with authentication data
      const contextTools = createContextAwareTools(authData || null);

      // Start the conversation with accessibility agent
      console.log('🎤 Starting conversation with agent...');
      console.log('🔐 DOM: Using auth data:', {
        hasAuthData: !!authData,
        hasUserId: !!authData?.userID,
        hasUserName: !!authData?.userName,
        hasToken: !!authData?.authToken,
      });
      
      await conversation.startSession({
        agentId: 'agent_01jywtwcgvfdpvpq3m5ptcxzm1', // TODO: Replace with actual agent ID
        dynamicVariables: {
          appName: 'Cultivest',
          userID: userID,
          userName: authData?.userName || 'User',
        },
        clientTools: {
          getAppInfo,
          // Navigation Tools
          navigate_to_dashboard: tools.navigate_to_dashboard,
          navigate_to_invest: tools.navigate_to_invest,
          navigate_to_portfolio: tools.navigate_to_portfolio,
          navigate_to_profile: tools.navigate_to_profile,
          navigate_to_education: tools.navigate_to_education,
          navigate_to_login: tools.navigate_to_login,
          navigate_to_signup: tools.navigate_to_signup,
          go_back: tools.go_back,
          get_current_screen: tools.get_current_screen,
          logout_user: tools.logout_user,
          show_alert: tools.show_alert,
          get_app_capabilities: tools.get_app_capabilities,
          // 🚀 Context-aware Portfolio Voice Commands
          get_auth_status: contextTools.get_auth_status,
          get_portfolio_value: contextTools.get_portfolio_value,
          get_bitcoin_performance: contextTools.get_bitcoin_performance,
          get_algorand_balance: contextTools.get_algorand_balance,
          get_portfolio_nft_info: contextTools.get_portfolio_nft_info,
          get_investment_gains: contextTools.get_investment_gains,
        },
      });
    } catch (error) {
      console.error('Failed to start voice accessibility guide:', error);
      alert('Unable to start voice guide. Please try again.');
    }
  }, [conversation, userID, hasNativePermission]);

  const stopVoiceGuide = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Error stopping voice guide:', error);
    }
  }, [conversation]);

  const checkNativePermissions = async () => {
    try {
      // Request native audio recording permissions
      const { granted } = await requestRecordingPermissionsAsync();
      setHasNativePermission(granted);
      setPermissionChecked(true);

      if (granted) {
        console.log('✅ Native microphone permission granted');
      } else {
        console.log('❌ Native microphone permission denied');
      }
    } catch (error) {
      console.error('Error requesting native microphone permission:', error);
      setPermissionChecked(true);
    }
  };

  // Don't render until we've checked permissions
  if (!permissionChecked) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.voiceButton, isConnected && styles.voiceButtonActive]}
        onPress={() => {
          console.log('🎯 DOM button pressed, isConnected:', isConnected);
          onActivate?.(isConnected);
          isConnected ? stopVoiceGuide() : startVoiceGuide();
        }}
      >
        {/* <View style={styles.buttonContent}> */}
          {/* <Text style={styles.micIcon}>🎤</Text> */}
          {/* <Text style={styles.buttonText}> */}
            {/* {isConnected ? 'Stop Voice Guide' : 'Tell me about this app'} */}
          {/* </Text> */}
        {/* </View> */}
      </Pressable>

      {isConnected && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Voice guide is listening</Text>
          {/* <AnimatedDots /> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', // Transparent container
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  voiceButton: {
    backgroundColor: 'transparent',
    // width: 100,
    // height: 100,
    // height: '100%',
    // borderRadius: 16,
    // paddingHorizontal: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
    // borderWidth: 2,
    // borderColor: 'rgba(88, 204, 2, 0.2)',
    // width: '100%',
    // height: '100%',
  },
  voiceButtonActive: {
    borderColor: '#58CC02',
    backgroundColor: 'grey',
  },
  buttonContent: {
    // flex: 1,
    // height: '100%',
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  micIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#58CC02',
    fontWeight: '500',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    borderRadius: 4,
    backgroundColor: '#58CC02',
    marginHorizontal: 3,
    aspectRatio: 1,
  },
});
