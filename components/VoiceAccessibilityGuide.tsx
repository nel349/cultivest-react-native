'use dom';

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import Constants from 'expo-constants';
import { getAppInfo } from '@/utils/appInfo';
import { useConversation } from '@elevenlabs/react';
import { createTools, createPropsAuthProvider } from '@/utils/tools';
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

// No longer needed - using unified tools from utils/tools.ts

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
      const authProvider = createPropsAuthProvider(authData || null);
      const contextTools = createTools(authProvider);

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
          // All tools now unified with context-aware authentication
          navigate_to_dashboard: contextTools.navigate_to_dashboard,
          navigate_to_invest: contextTools.navigate_to_invest,
          navigate_to_portfolio: contextTools.navigate_to_portfolio,
          navigate_to_profile: contextTools.navigate_to_profile,
          navigate_to_education: contextTools.navigate_to_education,
          navigate_to_login: contextTools.navigate_to_login,
          navigate_to_signup: contextTools.navigate_to_signup,
          go_back: contextTools.go_back,
          get_current_screen: contextTools.get_current_screen,
          logout_user: contextTools.logout_user,
          show_alert: contextTools.show_alert,
          get_app_capabilities: contextTools.get_app_capabilities,
          // Portfolio Voice Commands (now unified)
          get_auth_status: contextTools.get_auth_status,
          get_portfolio_value: contextTools.get_portfolio_value,
          get_bitcoin_performance: contextTools.get_bitcoin_performance,
          get_algorand_balance: contextTools.get_algorand_balance,
          get_portfolio_nft_info: contextTools.get_portfolio_nft_info,
          get_investment_gains: contextTools.get_investment_gains,
          // Voice Investment Workflow Tools
          initiate_bitcoin_purchase: contextTools.initiate_bitcoin_purchase,
          initiate_algorand_investment: contextTools.initiate_algorand_investment,
          initiate_solana_investment: contextTools.initiate_solana_investment,
          initiate_usdc_investment: contextTools.initiate_usdc_investment,
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
