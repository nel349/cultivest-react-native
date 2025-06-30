import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiClient } from './api';

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
  },

  // ===========================================
  // 🚀 PORTFOLIO VOICE COMMANDS (Phase 1)
  // ===========================================
  
  // Get total portfolio value
  get_portfolio_value: async () => {
    console.log('💰 Voice portfolio: Getting total portfolio value');
    try {
      // Check authentication more thoroughly
      const [userId, userName, authToken] = await AsyncStorage.multiGet([
        'user_id', 'user_name', 'auth_token'
      ]);
      
      const userIdValue = userId[1];
      const userNameValue = userName[1];
      const tokenValue = authToken[1];
      
      console.log('💰 Voice portfolio: Auth check:', {
        hasUserId: !!userIdValue,
        hasUserName: !!userNameValue,
        hasToken: !!tokenValue,
        userId: userIdValue
      });

      if (!userIdValue) {
        console.log('💰 Voice portfolio: No user ID found, user needs to log in');
        return 'Please log in to view your portfolio value';
      }

      if (!tokenValue) {
        console.log('💰 Voice portfolio: No auth token found, user needs to log in');
        return 'Your session has expired. Please log in again to view your portfolio';
      }

      console.log('💰 Voice portfolio: Fetching wallet balance for authenticated user:', userIdValue);
      const result = await apiClient.getWalletBalance(userIdValue, true);
      console.log('💰 Voice portfolio: Wallet balance result:', { success: result?.success, hasBalance: !!result?.balance });
      
      if (result?.success && result.balance) {
        const btcBalance = result.balance?.onChainBalance?.btc || result.balance?.databaseBalance?.btc || 0;
        const algoBalance = result.balance?.onChainBalance?.algo || result.balance?.databaseBalance?.algo || 0;
        const usdcBalance = result.balance?.onChainBalance?.usdca || result.balance?.databaseBalance?.usdca || 0;
        const solBalance = (result.balance?.onChainBalance as any)?.sol || (result.balance?.databaseBalance as any)?.sol || 0;

        console.log('💰 Voice portfolio: Asset balances:', {
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

        console.log('💰 Voice portfolio: Portfolio calculation:', {
          btcValue,
          algoValue,
          usdcValue,
          solValue,
          totalValue
        });

        if (totalValue === 0) {
          return `Hello ${userNameValue || 'investor'}! Your portfolio is currently empty. You can start investing by going to the invest tab or asking me to navigate there. Your wallets are ready for Bitcoin, Algorand, USDC, and Solana.`;
        }
        
        return `Hello ${userNameValue || 'investor'}! Your total portfolio is worth $${totalValue.toFixed(2)}. You have ${btcBalance.toFixed(8)} Bitcoin worth $${btcValue.toFixed(2)}, ${algoBalance.toFixed(2)} Algorand worth $${algoValue.toFixed(2)}, ${usdcBalance.toFixed(2)} USDC, and ${solBalance.toFixed(2)} Solana worth $${solValue.toFixed(2)}.`;
      } else {
        console.log('💰 Voice portfolio: API call failed or no balance data:', result?.error);
        return `I'm having trouble accessing your portfolio data right now. This might be a temporary issue. Please try asking again, or check the portfolio tab in the app.`;
      }
    } catch (error) {
      console.error('💰 Voice portfolio: Error getting portfolio value:', error);
      return 'I encountered an error while fetching your portfolio. Please try again or check the portfolio tab in the app.';
    }
  },

  // Get Bitcoin performance specifically
  get_bitcoin_performance: async () => {
    console.log('₿ Voice portfolio: Getting Bitcoin performance');
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return 'Please log in to view your Bitcoin performance';
      }

      const result = await apiClient.getWalletBalance(userId, true);
      const pricesResult = await apiClient.request('/prices');
      
      if (result?.success) {
        const btcBalance = result.balance?.onChainBalance?.btc || 0;
        let currentPrice = 97000;
        
        if (pricesResult?.success && (pricesResult as any).prices) {
          currentPrice = (pricesResult as any).prices.bitcoin?.usd || currentPrice;
        }

        const btcValue = btcBalance * currentPrice;
        const btcPercentage = btcBalance > 0 ? 'significant portion' : 'no Bitcoin';
        
        return `Your Bitcoin performance: You hold ${btcBalance.toFixed(8)} BTC worth $${btcValue.toFixed(2)} at current price of $${currentPrice.toLocaleString()}. Bitcoin represents a ${btcPercentage} of your portfolio.`;
      }
      
      return 'Unable to retrieve Bitcoin performance data';
    } catch (error) {
      console.error('Error getting Bitcoin performance:', error);
      return 'Failed to get Bitcoin performance';
    }
  },

  // Get Algorand balance specifically  
  get_algorand_balance: async () => {
    console.log('⚡ Voice portfolio: Getting Algorand balance');
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return 'Please log in to view your Algorand balance';
      }

      const result = await apiClient.getWalletBalance(userId, true);
      const pricesResult = await apiClient.request('/prices');
      
      if (result?.success) {
        const algoBalance = result.balance?.onChainBalance?.algo || 0;
        let algoPrice = 0.40;
        
        if (pricesResult?.success && (pricesResult as any).prices) {
          algoPrice = (pricesResult as any).prices.algorand?.usd || algoPrice;
        }

        const algoValue = algoBalance * algoPrice;
        
        return `Your Algorand balance: You hold ${algoBalance.toFixed(2)} ALGO worth $${algoValue.toFixed(2)} at current price of $${algoPrice.toFixed(4)}. Algorand is a high-performance blockchain supporting smart contracts and decentralized applications.`;
      }
      
      return 'Unable to retrieve Algorand balance';
    } catch (error) {
      console.error('Error getting Algorand balance:', error);
      return 'Failed to get Algorand balance';
    }
  },

  // Get Portfolio NFT information
  get_portfolio_nft_info: async () => {
    console.log('🎨 Voice portfolio: Getting Portfolio NFT info');
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return 'Please log in to view your Portfolio NFT information';
      }

      // This would need to be implemented with actual NFT API endpoint
      return 'Your Portfolio NFT represents your entire investment portfolio as a tradeable and inheritable digital asset. This revolutionary feature allows you to pass your investments to future generations or trade your entire portfolio position. Your NFT contains metadata about your Bitcoin, Algorand, and USDC holdings, making it truly unique in the crypto investment space.';
    } catch (error) {
      console.error('Error getting Portfolio NFT info:', error);
      return 'Failed to get Portfolio NFT information';
    }
  },

  // Get total investment gains
  get_investment_gains: async () => {
    console.log('📈 Voice portfolio: Getting investment gains');
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        return 'Please log in to view your investment gains';
      }

      // This would need historical data to calculate actual gains
      // For now, we'll provide current portfolio value as a placeholder
      const result = await apiClient.getWalletBalance(userId, true);
      
      if (result?.success) {
        const btcBalance = result.balance?.onChainBalance?.btc || 0;
        const algoBalance = result.balance?.onChainBalance?.algo || 0;
        const usdcBalance = result.balance?.onChainBalance?.usdca || 0;
        
        if (btcBalance > 0 || algoBalance > 0 || usdcBalance > 0) {
          return 'Your investment gains tracking is available. Current portfolio shows active positions in multiple cryptocurrencies. For detailed gain and loss analysis, historical purchase data would be needed. Your multi-chain approach with Bitcoin and Algorand demonstrates solid diversification strategy.';
        } else {
          return 'No current investments detected. Consider starting with Bitcoin or Algorand to begin tracking your investment gains.';
        }
      }
      
      return 'Unable to calculate investment gains at this time';
    } catch (error) {
      console.error('Error getting investment gains:', error);
      return 'Failed to get investment gains';
    }
  }
};

export default tools; 