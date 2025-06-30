import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import VoiceComboComponent from '@/components/VoiceComboComponent';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  useFrameworkReady();
  const [userID, setUserID] = useState<string>('');

  // Load user ID from storage
  useEffect(() => {
    loadUserID();
  }, []);

  const loadUserID = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        setUserID(userId);
        console.log('🔐 Root Layout: Loaded user ID for voice component:', userId);
      }
    } catch (error) {
      console.error('🔐 Root Layout: Error loading user ID:', error);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0D1421" />
      
      {/* Global Voice Assistant - Available on all screens */}
      {userID && (
        <View style={styles.voiceOverlay}>
          <VoiceComboComponent 
            userID={userID}
            onActivate={(isActive) => {
              console.log('🎤 Global Voice Assistant:', isActive ? 'activated' : 'deactivated');
            }}
            onDeactivate={() => {
              console.log('🎤 Global Voice Assistant deactivated');
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  voiceOverlay: {
    position: 'absolute',
    bottom: 100, // Position above any bottom navigation
    right: 20,
    zIndex: 1000, // High z-index to appear above all content
    elevation: 1000, // For Android
  },
});