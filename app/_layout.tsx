import React, { useState, useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import VoiceComboComponent from '@/components/VoiceComboComponent';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  useFrameworkReady();
  const [userID, setUserID] = useState<string>('');
  const pathname = usePathname();
  
  // Check if we're on an auth page (never show voice component on auth pages)
  const isAuthPage = pathname?.includes('/(auth)') || pathname?.includes('/auth') || 
                     pathname === '/welcome' || pathname === '/login' || pathname === '/signup' || 
                     pathname === '/setup' || pathname === '/verify-otp';

  // Load user ID from storage and check for updates
  useEffect(() => {
    loadUserID();
    
    // Check for userID changes more frequently in development
    const interval = setInterval(() => {
      loadUserID();
    }, __DEV__ ? 500 : 2000); // 500ms in dev, 2s in production

    return () => clearInterval(interval);
  }, []);

  // Debug effect to track userID and auth page changes
  useEffect(() => {
    if (__DEV__) {
      console.log('🎤 Root Layout: Auth status check:', {
        userID: !!userID,
        isAuthPage,
        pathname,
        willShowVoice: !!(userID && !isAuthPage)
      });
      
      if (userID && !isAuthPage) {
        console.log('🎤 Root Layout: ✅ Voice component will be rendered');
      } else if (isAuthPage) {
        console.log('🎤 Root Layout: ❌ On auth page, voice component hidden');
      } else {
        console.log('🎤 Root Layout: ❌ No userID, voice component hidden');
      }
    }
  }, [userID, isAuthPage, pathname]);

  const loadUserID = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const userName = await AsyncStorage.getItem('user_name');
      const authToken = await AsyncStorage.getItem('auth_token');
      
      if (__DEV__) {
        console.log('🔐 Root Layout: Checking auth data:', {
          hasUserId: !!userId,
          hasUserName: !!userName,
          hasAuthToken: !!authToken,
          currentUserID: userID
        });
      }
      
      if (userId && userId !== userID) {
        setUserID(userId);
        console.log('🔐 Root Layout: ✅ Voice component activated for user:', userName || userId);
      } else if (!userId && userID) {
        // User logged out
        setUserID('');
        console.log('🔐 Root Layout: ❌ User logged out, clearing voice component');
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
      
      {/* Global Voice Assistant - Available on authenticated screens only */}
      {userID && !isAuthPage && (
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