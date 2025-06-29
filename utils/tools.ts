import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Navigation Tools for Voice Agent
export const tools = {
  // Navigate to different screens
  navigate_to_dashboard: async () => {
    console.log('🎯 Voice navigation: Going to dashboard');
    try {
      router.push('/(tabs)');
      return 'Successfully navigated to dashboard';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to dashboard';
    }
  },

  navigate_to_invest: async () => {
    console.log('🎯 Voice navigation: Going to invest screen');
    try {
      router.push('/(tabs)/invest');
      return 'Successfully navigated to investment screen';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to investment screen';
    }
  },

  navigate_to_portfolio: async () => {
    console.log('🎯 Voice navigation: Going to portfolio');
    try {
      router.push('/(tabs)/portfolio');
      return 'Successfully navigated to portfolio';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to portfolio';
    }
  },

  navigate_to_profile: async () => {
    console.log('🎯 Voice navigation: Going to profile');
    try {
      router.push('/(tabs)/profile');
      return 'Successfully navigated to profile';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to profile';
    }
  },

  navigate_to_education: async () => {
    console.log('🎯 Voice navigation: Going to education');
    try {
      router.push('/education');
      return 'Successfully navigated to education center';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to education center';
    }
  },

  // Authentication actions
  navigate_to_login: async () => {
    console.log('🎯 Voice navigation: Going to login');
    try {
      router.push('/(auth)/login');
      return 'Successfully navigated to login screen';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to login screen';
    }
  },

  navigate_to_signup: async () => {
    console.log('🎯 Voice navigation: Going to signup');
    try {
      router.push('/(auth)/signup');
      return 'Successfully navigated to signup screen';
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to navigate to signup screen';
    }
  },

  // Go back navigation
  go_back: async () => {
    console.log('🎯 Voice navigation: Going back');
    try {
      if (router.canGoBack()) {
        router.back();
        return 'Successfully went back to previous screen';
      } else {
        return 'Cannot go back, already at root screen';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      return 'Failed to go back';
    }
  },

  // Get current route information
  get_current_screen: async () => {
    console.log('🎯 Voice navigation: Getting current screen info');
    try {
      // For now, return a generic message - in a real implementation, 
      // you could track the current route in state management
      return 'Screen information available via voice navigation';
    } catch (error) {
      console.error('Error getting current screen:', error);
      return 'Failed to get current screen information';
    }
  },

  // User authentication status
  get_auth_status: async () => {
    console.log('🎯 Voice navigation: Checking auth status');
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userId = await AsyncStorage.getItem('user_id');
      const userName = await AsyncStorage.getItem('user_name');
      
      const isAuthenticated = !!token;
      
      return isAuthenticated 
        ? `User is logged in as ${userName || 'Unknown User'}` 
        : 'User is not logged in';
    } catch (error) {
      console.error('Error checking auth status:', error);
      return 'Failed to check authentication status';
    }
  },

  // Logout user
  logout_user: async () => {
    console.log('🎯 Voice navigation: Logging out user');
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_id', 'user_name']);
      router.replace('/(auth)/welcome');
      return 'User logged out successfully';
    } catch (error) {
      console.error('Logout error:', error);
      return 'Failed to logout user';
    }
  },

  // Show alert to user
  show_alert: async ({ title, message }: { title: string; message: string }) => {
    console.log('🎯 Voice navigation: Showing alert', { title, message });
    try {
      Alert.alert(title, message);
      return 'Alert shown to user';
    } catch (error) {
      console.error('Alert error:', error);
      return 'Failed to show alert';
    }
  },

  // Get app capabilities
  get_app_capabilities: async () => {
    console.log('🎯 Voice navigation: Getting app capabilities');
    return 'Cultivest supports navigation to: dashboard, invest, portfolio, profile, education, login, signup. Features include: Bitcoin investment, Algorand investment, Portfolio NFTs, Multi-chain portfolio tracking, Voice navigation, Investment education. Authentication options: login, signup, logout, check status.';
  }
};

export default tools; 