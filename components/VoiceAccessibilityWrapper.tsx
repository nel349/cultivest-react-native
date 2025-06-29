import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import VoiceAccessibilityGuide from './VoiceAccessibilityGuide';
import { getAppInfo } from '@/utils/appInfo';

interface VoiceAccessibilityWrapperProps {
  userID: string;
}

export default function VoiceAccessibilityWrapper({ 
  userID, 
}: VoiceAccessibilityWrapperProps) {
  const [hasNativePermission, setHasNativePermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    checkNativePermissions();
  }, []);

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
      
      {/* DOM component - overlay for debugging */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0,
        height: 200,
        backgroundColor: 'rgba(255,0,0,0.2)', // Semi-transparent red to see WebView area
        borderWidth: 2,
        borderColor: 'blue',
      }}>
        <VoiceAccessibilityGuide
          dom={{ style: styles.voiceGuideComponent }}
          userID={userID}
          getAppInfo={getAppInfo}
          hasNativePermission={hasNativePermission}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  voiceGuideComponent: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
  },
  nativeButton: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
}); 