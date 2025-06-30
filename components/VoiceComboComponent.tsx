import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatGPTDots from './ChatGPTDots';
import VoiceAccessibilityGuide from './VoiceAccessibilityGuide';
import VoiceButton from './VoiceButton';

interface VoiceComboComponentProps {
  userID: string;
  onActivate?: (isActive: boolean) => void;
  onDeactivate?: (isActive: boolean) => void;
}

interface UserAuthData {
  userID: string;
  userName: string;
  authToken: string;
}

export default function VoiceComboComponent({
  userID,
  onActivate,
  onDeactivate,
}: VoiceComboComponentProps) {
  const [isActive, setIsActive] = useState(false);
  const [isVoiceGuideActive, setIsVoiceGuideActive] = useState(false);
  const [authData, setAuthData] = useState<UserAuthData | null>(null);

  // Load authentication data from React Native context
  useEffect(() => {
    loadAuthData();
  }, [userID]);

  const loadAuthData = async () => {
    try {
      const [userIdItem, userNameItem, authTokenItem] = await AsyncStorage.multiGet([
        'user_id', 'user_name', 'auth_token'
      ]);
      
      const userIdValue = userIdItem[1] || userID;
      const userNameValue = userNameItem[1] || '';
      const authTokenValue = authTokenItem[1] || '';

      console.log('🔐 VoiceCombo: Loading auth data', {
        hasUserId: !!userIdValue,
        hasUserName: !!userNameValue,
        hasToken: !!authTokenValue,
      });

      setAuthData({
        userID: userIdValue,
        userName: userNameValue,
        authToken: authTokenValue,
      });
    } catch (error) {
      console.error('🔐 VoiceCombo: Error loading auth data:', error);
      setAuthData(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ask AI Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>Ask AI</Text>
        <Text style={styles.bannerSubtext}>Tap to speak</Text>
      </View>
      
      {/* Voice Button */}
      <View style={styles.buttonContainer}>
        <VoiceButton 
          onPress={() => {
            console.log('Voice button pressed');
            setIsActive(!isActive);
            setIsVoiceGuideActive(!isVoiceGuideActive);
          }}
          isActive={isActive}
          size={40}
        />
      </View>

      {/* Voice Accessibility Guide (hidden, handles the actual conversation) */}
      <View style={styles.guideContainer}>
        <VoiceAccessibilityGuide 
          userID={userID}
          authData={authData}
          onActivate={(isActive) => {
            console.log('Voice guide is now:', isActive ? 'active' : 'inactive');
            setIsActive(isActive);
            onActivate?.(isActive);
          }} 
          activate={isVoiceGuideActive}
          onDeactivate={() => {
            console.log('Voice guide is now inactive');
            setIsActive(false);
            onDeactivate?.(false);
          }}
        />
      </View>
      
      {/* Status indicator when active */}
      {isActive && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Listening...</Text>
          <ChatGPTDots 
            isAnimating={isActive} 
            size={3} 
            color="#FFFFFF" 
            speed={600} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bannerContainer: {
    marginRight: 8,
    alignItems: 'flex-start',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtext: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  buttonContainer: {
    position: 'relative',
  },
  guideContainer: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  statusContainer: {
    position: 'absolute',
    top: -25,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
