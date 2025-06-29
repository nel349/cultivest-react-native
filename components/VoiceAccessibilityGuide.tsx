'use dom';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import { getAppInfo } from '@/utils/appInfo';
import { useConversation } from '@elevenlabs/react';

interface VoiceAccessibilityGuideProps {
  userID: string;
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

export default function VoiceAccessibilityGuide({
  userID,
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

      // Start the conversation with accessibility agent
      console.log('🎤 Starting conversation with agent...');
      await conversation.startSession({
        agentId: 'agent_01jywtwcgvfdpvpq3m5ptcxzm1', // TODO: Replace with actual agent ID
        dynamicVariables: {
          appName: 'Cultivest',
          userID: userID,
        },
        clientTools: {
          getAppInfo,
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
    // width: '100%', // Full width
    // height: 60, // Reasonable heigh
    height: 10,
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
    height: 8,
    borderRadius: 4,
    backgroundColor: '#58CC02',
    marginHorizontal: 3,
  },
});
