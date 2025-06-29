import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import { getAppInfo } from '@/utils/appInfo';
import { useConversation } from '@elevenlabs/react';

interface VoiceAccessibilityGuideProps {
  userID: string;
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
}: VoiceAccessibilityGuideProps) {
  const [hasNativePermission, setHasNativePermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkNativePermissions();
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      console.log('🎤 Voice accessibility guide connected');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('🎤 Voice accessibility guide disconnected');
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
  }, [conversation, userID]);

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
          isConnected ? stopVoiceGuide() : startVoiceGuide();
        }}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.micIcon}>🎤</Text>
          <Text style={styles.buttonText}>
            {isConnected ? 'Stop Voice Guide' : 'Tell me about this app'}
          </Text>
        </View>
      </Pressable>

      {isConnected && (
        <Text style={styles.statusText}>
          Voice guide is active - speak your questions!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'red',
    // paddingVertical: 8,
  },
  voiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 2, 0.2)',
    minWidth: 250,
  },
  voiceButtonActive: {
    borderColor: '#58CC02',
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: '#58CC02',
    fontWeight: '500',
  },
});
