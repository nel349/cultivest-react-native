import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Auth token keys
const AUTH_KEYS = {
  TOKEN: 'auth_token',
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
} as const;

/**
 * Sign out the current user
 * Clears all authentication data and navigates to welcome screen
 */
export const signOut = async (): Promise<void> => {
  try {
    // Clear all authentication data including userData object
    await AsyncStorage.multiRemove([
      AUTH_KEYS.TOKEN,
      AUTH_KEYS.USER_ID,
      AUTH_KEYS.USER_NAME,
    ]);
    
    console.log('🚪 User signed out successfully - all auth data cleared');
    
    // Navigate back to welcome screen (replace to prevent going back)
    router.replace('/(auth)/welcome');
  } catch (error) {
    console.error('❌ Error signing out:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_KEYS.TOKEN);
    const userId = await AsyncStorage.getItem(AUTH_KEYS.USER_ID);
    return !!(token && userId);
  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<{
  token: string | null;
  userId: string | null;
  userName: string | null;
}> => {
  try {
    const [token, userId, userName] = await AsyncStorage.multiGet([
      AUTH_KEYS.TOKEN,
      AUTH_KEYS.USER_ID,
      AUTH_KEYS.USER_NAME,
    ]);

    return {
      token: token[1],
      userId: userId[1],
      userName: userName[1],
    };
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return {
      token: null,
      userId: null,
      userName: null,
    };
  }
};

/**
 * Store authentication data
 */
export const storeAuthData = async (
  token: string,
  userId: string,
  userName: string
): Promise<void> => {
  try {
    // Store individual keys for backward compatibility
    await AsyncStorage.multiSet([
      [AUTH_KEYS.TOKEN, token],
      [AUTH_KEYS.USER_ID, userId],
      [AUTH_KEYS.USER_NAME, userName],
    ]);

    // Removed userData object storage for standardization
    
    console.log('✅ Auth data stored successfully');
  } catch (error) {
    console.error('❌ Error storing auth data:', error);
    throw new Error('Failed to store authentication data');
  }
}; 