import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiClient } from './api';

// Auth data interface
interface AuthData {
  userID: string;
  userName: string;
  authToken: string;
}

// Core tools that accept auth data as parameters
export const createTools = (authDataProvider: () => Promise<AuthData | null>) => ({
  // Navigation Tools for Voice Agent
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

  get_current_screen: async () => {
    console.log('🎯 Voice navigation: Getting current screen info');
    try {
      return 'Screen information available via voice navigation';
    } catch (error) {
      console.error('Error getting current screen:', error);
      return 'Failed to get current screen information';
    }
  },

  get_auth_status: async () => {
    console.log('🎯 Voice navigation: Checking auth status');
    try {
      const authData = await authDataProvider();
      return authData 
        ? `User is logged in as ${authData.userName || 'Unknown User'}` 
        : 'User is not logged in';
    } catch (error) {
      console.error('Error checking auth status:', error);
      return 'Failed to check authentication status';
    }
  },

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

  get_app_capabilities: async () => {
    console.log('🎯 Voice navigation: Getting app capabilities');
    return 'Cultivest supports navigation to: dashboard, invest, portfolio, profile, education, login, signup. Features include: Bitcoin investment, Algorand investment, Portfolio NFTs, Multi-chain portfolio tracking, Voice navigation, Investment education. Authentication options: login, signup, logout, check status.';
  },

  // Portfolio Tools
  get_portfolio_value: async () => {
    console.log('💰 Voice portfolio: Getting total portfolio value');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        console.log('💰 Voice portfolio: No auth data, user needs to log in');
        return 'Please log in to view your portfolio value';
      }

      console.log('💰 Voice portfolio: Fetching wallet balance for authenticated user:', authData.userID);
      
                    const response = await apiClient.getWalletBalance(authData.userID, true);
       
       if (!response.success || !response.balance) {
         console.log('💰 Voice portfolio: Failed to fetch wallet balance:', response.error);
         return 'Failed to fetch your portfolio balance. Please try again.';
       }

       const balance = response.balance;
       const onChainBalance = balance.onChainBalance;
       const databaseBalance = balance.databaseBalance;
      
      console.log('💰 Voice portfolio: Balance data:', {
        onChainBalance,
        databaseBalance
      });

      let totalValue = 0;
      let valueBreakdown = [];
      
      if (onChainBalance && onChainBalance.btc > 0) {
        totalValue += onChainBalance.btc;
        valueBreakdown.push(`${onChainBalance.btc.toFixed(6)} Bitcoin`);
      }
      
      if (onChainBalance && onChainBalance.algo > 0) {
        totalValue += onChainBalance.algo;
        valueBreakdown.push(`${onChainBalance.algo.toFixed(2)} Algorand`);
      }
      
      if (onChainBalance && onChainBalance.usdca > 0) {
        totalValue += onChainBalance.usdca;
        valueBreakdown.push(`${onChainBalance.usdca.toFixed(2)} USDC`);
      }

      const portfolioSummary = valueBreakdown.length > 0 
        ? `Your portfolio contains: ${valueBreakdown.join(', ')}` 
        : 'Your portfolio is currently empty. Start investing to build your digital asset portfolio!';

      return `Portfolio Summary for ${authData.userName}: ${portfolioSummary}. Total estimated value: $${totalValue.toFixed(2)} USD equivalent.`;
      
    } catch (error) {
      console.error('💰 Voice portfolio: Error fetching portfolio value:', error);
      return 'I encountered an error while fetching your portfolio value. Please try again or check your internet connection.';
    }
  },

  get_bitcoin_performance: async () => {
    console.log('₿ Voice portfolio: Getting Bitcoin performance');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in to view your Bitcoin performance';
      }

             const response = await apiClient.getWalletBalance(authData.userID, true);
       
       if (!response.success || !response.balance) {
         return 'Failed to fetch your Bitcoin performance data';
       }

       const balance = response.balance;
      const btcAmount = balance.onChainBalance?.btc || 0;
      
      if (btcAmount === 0) {
        return 'You don\'t have any Bitcoin in your portfolio yet. Consider investing in Bitcoin through the Invest tab!';
      }

      return `You currently hold ${btcAmount.toFixed(6)} Bitcoin in your portfolio. Bitcoin is known for its volatility and potential for long-term growth. Check the Invest tab for current Bitcoin prices and market trends.`;
    } catch (error) {
      console.error('₿ Voice portfolio: Error fetching Bitcoin performance:', error);
      return 'Failed to fetch Bitcoin performance data. Please try again.';
    }
  },

  get_algorand_balance: async () => {
    console.log('🔷 Voice portfolio: Getting Algorand balance');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in to view your Algorand balance';
      }

             const response = await apiClient.getWalletBalance(authData.userID, true);
       
       if (!response.success || !response.balance) {
         return 'Failed to fetch your Algorand balance';
       }

       const balance = response.balance;
      const algoAmount = balance.onChainBalance?.algo || 0;
      const usdcAmount = balance.onChainBalance?.usdca || 0;
      
      let algoSummary = [];
      if (algoAmount > 0) algoSummary.push(`${algoAmount.toFixed(2)} ALGO`);
      if (usdcAmount > 0) algoSummary.push(`${usdcAmount.toFixed(2)} USDC`);
      
      if (algoSummary.length === 0) {
        return 'You don\'t have any Algorand assets yet. Consider investing in Algorand or USDC through the Invest tab!';
      }

      return `Your Algorand wallet contains: ${algoSummary.join(' and ')}. Algorand is a fast, secure, and environmentally friendly blockchain perfect for DeFi and smart contracts.`;
    } catch (error) {
      console.error('🔷 Voice portfolio: Error fetching Algorand balance:', error);
      return 'Failed to fetch Algorand balance. Please try again.';
    }
  },

    get_portfolio_nft_info: async () => {
    console.log('🎨 Voice portfolio NFT: Getting portfolio NFT info');
    try {
      const authData = await authDataProvider();
      
      console.log('🎨 Voice portfolio NFT: Auth data check:', {
        hasAuthData: !!authData,
        hasUserID: !!authData?.userID,
        userID: authData?.userID
      });
      
      if (!authData) {
        console.log('🎨 Voice portfolio NFT: No auth data found');
        return 'Please log in to view your Garden Portfolio Certificate information';
      }

      // Navigate to the portfolio/harvest page first
      console.log('🎨 Voice portfolio NFT: Navigating to harvest page');
      try {
        const { router } = await import('expo-router');
        router.push('/(tabs)/portfolio');
        // Small delay to ensure navigation completes
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (navError) {
        console.error('🎨 Navigation error:', navError);
      }

      console.log('🎨 Voice portfolio NFT: Making API call for user:', authData.userID);
      
      // Debug the API base URL being used
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
      console.log('🔗 Voice portfolio NFT: API Base URL:', API_BASE_URL);
      console.log('🔗 Voice portfolio NFT: Full URL:', `${API_BASE_URL}/users/${authData.userID}/portfolio/primary`);
      
      // Try both the wrapper method and direct request
      const response = await apiClient.getUserPrimaryPortfolio(authData.userID);
      
      // Also try direct API call as backup
      console.log('🎨 Voice portfolio NFT: Trying direct API call as backup...');
      const directResponse = await apiClient.request(`/users/${authData.userID}/portfolio/primary`);
      
      console.log('🎨 Voice portfolio NFT: Raw API response (wrapper):', response);
      console.log('🎨 Voice portfolio NFT: Raw API response (direct):', directResponse);
      
      // Use direct response if wrapper fails
      const finalResponse = response.success ? response : directResponse;
      
      console.log('🎨 Voice portfolio NFT: Using response:', finalResponse.success ? 'wrapper' : 'direct');
      console.log('🎨 Voice portfolio NFT: Final response summary:', {
        success: finalResponse?.success,
        hasData: !!(finalResponse as any)?.data,
        hasPortfolio: !!(finalResponse as any)?.data?.portfolio,
        error: finalResponse?.error || 'none',
        fullError: finalResponse?.error
      });
       
       if (finalResponse.success && (finalResponse as any).data?.portfolio) {
         console.log('🎨 Voice portfolio NFT: Processing successful API response');
         const data = (finalResponse as any).data;
         const portfolio = data.portfolio;
         const positionsData = data.positions;
         const stats = data.stats || null;
         const positions = positionsData?.positions || [];
         
         console.log('🎨 Voice portfolio NFT: Parsed data:', {
           portfolioName: portfolio?.customName,
           tokenId: portfolio?.tokenId,
           appId: portfolio?.appId,
           positionsCount: positions?.length || 0,
           hasStats: !!stats
         });
        
                 // Calculate portfolio stats
        const totalValue = positions.reduce((sum: number, pos: any) => sum + (parseFloat(pos.purchaseValue) || 0), 0);
        const totalMinted = parseInt(stats?.totalTokensMinted) || 0;
        
        // Count positions by asset type
        const assetCounts: { [key: string]: { count: number, totalValue: number } } = {};
        positions.forEach((pos: any) => {
          const assetName = pos.assetTypeName;
          const purchaseValue = parseFloat(pos.purchaseValue) || 0;
          
          if (!assetCounts[assetName]) {
            assetCounts[assetName] = { count: 0, totalValue: 0 };
          }
          
          assetCounts[assetName].count += 1;
          assetCounts[assetName].totalValue += purchaseValue;
        });
        
        // Build human-readable response like get_portfolio_value
        let response = `Portfolio NFT Summary for ${authData.userName}: Your "${portfolio.customName}" is NFT #${portfolio.tokenId} on Algorand blockchain (App ${portfolio.appId}). `;
        
        if (positions.length > 0) {
          response += `It contains ${positions.length} investment positions: `;
          
          const assetSummary = Object.entries(assetCounts).map(([asset, data]) => 
            `${data.count} ${asset} position${data.count > 1 ? 's' : ''} worth $${data.totalValue.toLocaleString()}`
          ).join(', ');
          
          response += `${assetSummary}. Total portfolio value: $${totalValue.toLocaleString()}. `;
        } else {
          response += `It currently has no investment positions. `;
        }
        
        response += `This NFT is one of ${totalMinted} minted and represents your investment journey in a unique digital certificate.`;
        
        console.log('🎨 Voice portfolio NFT: Returning human-readable response:', response);
        return response;
      } else {
        console.log('🎨 Voice portfolio NFT: No portfolio found, returning no-portfolio message');
        const noPortfolioMessage = `NO PORTFOLIO NFT FOUND. User has no Garden Portfolio Certificate yet.`;
        console.log('🎨 Voice portfolio NFT: No-portfolio message length:', noPortfolioMessage.length);
        return noPortfolioMessage;
      }
    } catch (error) {
      console.error('🎨 Voice portfolio NFT error:', error);
      const errorMessage = 'Error fetching your Portfolio NFT data, but I took you to the Harvest page to view it manually!';
      console.log('🎨 Voice portfolio NFT: Error message length:', errorMessage.length);
      return errorMessage;
    }
  },

  get_investment_gains: async () => {
    console.log('📈 Voice portfolio: Getting investment gains');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in to view your investment gains';
      }
      
      return 'Investment gains tracking will show your portfolio performance over time. Please check the portfolio tab for detailed performance metrics.';
    } catch (error) {
      console.error('📈 Voice portfolio: Error getting investment gains:', error);
      return 'Failed to fetch investment gains data. Please try again.';
    }
  },

  // Voice Investment Workflow Tools
  initiate_bitcoin_purchase: async ({ amount }: { amount?: number } = {}) => {
    console.log('₿ Voice investment: Initiating Bitcoin purchase workflow');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in first to start investing in Bitcoin';
      }

      // Navigate to invest screen
      console.log('₿ Voice investment: Navigating to invest tab');
      router.push('/(tabs)/invest');
      
      // Small delay to ensure navigation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Provide guided instructions
      const amountText = amount ? ` $${amount} of` : '';
      return `Great! I've taken you to the investment screen to buy${amountText} Bitcoin and other crypto. Please tap the "Buy Bitcoin ₿" or "Buy Crypto" button to open the investment form, then choose your amount and complete the purchase.`;

    } catch (error) {
      console.error('₿ Voice investment: Error initiating Bitcoin purchase:', error);
      return 'Failed to navigate to Bitcoin investment. Please try again.';
    }
  },

  initiate_algorand_investment: async ({ amount }: { amount?: number } = {}) => {
    console.log('🔷 Voice investment: Initiating Algorand investment workflow');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in first to start investing in Algorand';
      }

      // Navigate to invest screen with scroll target
      console.log('🔷 Voice investment: Navigating to invest tab with auto-scroll');
      router.push({
        pathname: '/(tabs)/invest',
        params: { scrollTo: 'other-crypto', selectPool: 'altcoin-pool' }
      });
      
      // Small delay to ensure navigation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Provide guided instructions
      const amountText = amount ? ` $${amount} in` : '';
      return `Perfect! I've opened the investment screen and automatically scrolled to the "Other Crypto" section for you to invest${amountText} Algorand. I've also pre-selected the "Top Altcoins 🚀" pool which includes Algorand. Now simply tap the investment button to open the form and complete your purchase.`;

    } catch (error) {
      console.error('🔷 Voice investment: Error initiating Algorand investment:', error);
      return 'Failed to navigate to Algorand investment. Please try again.';
    }
  },

  initiate_solana_investment: async ({ amount }: { amount?: number } = {}) => {
    console.log('☀️ Voice investment: Initiating Solana investment workflow');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in first to start investing in Solana';
      }

      // Navigate to invest screen with scroll target
      console.log('☀️ Voice investment: Navigating to invest tab with auto-scroll');
      router.push({
        pathname: '/(tabs)/invest',
        params: { scrollTo: 'other-crypto', selectPool: 'altcoin-pool' }
      });
      
      // Small delay to ensure navigation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Provide guided instructions
      const amountText = amount ? ` $${amount} in` : '';
      return `Excellent! I've opened the investment screen and automatically scrolled to the "Other Crypto" section for you to invest${amountText} Solana. I've also pre-selected the "Top Altcoins 🚀" pool which includes Solana. Now simply tap the investment button to open the form and complete your purchase.`;

    } catch (error) {
      console.error('☀️ Voice investment: Error initiating Solana investment:', error);
      return 'Failed to navigate to Solana investment. Please try again.';
    }
  },

  initiate_usdc_investment: async ({ amount }: { amount?: number } = {}) => {
    console.log('🪙 Voice investment: Initiating USDC investment workflow');
    try {
      const authData = await authDataProvider();
      
      if (!authData) {
        return 'Please log in first to start investing in USDC';
      }

      // Navigate to invest screen with scroll target
      console.log('🪙 Voice investment: Navigating to invest tab with auto-scroll');
      router.push({
        pathname: '/(tabs)/invest',
        params: { scrollTo: 'other-crypto', selectPool: 'stablecoin-pool' }
      });
      
      // Small delay to ensure navigation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Provide guided instructions
      const amountText = amount ? ` $${amount} in` : '';
      return `Great choice! I've opened the investment screen and automatically scrolled to the "Other Crypto" section for you to invest${amountText} USDC stablecoins. I've also pre-selected the "Stablecoins 🪙" pool for you. Now simply tap the investment button to open the form and complete your stable yield investment.`;

    } catch (error) {
      console.error('🪙 Voice investment: Error initiating USDC investment:', error);
      return 'Failed to navigate to USDC investment. Please try again.';
    }
  },
});

// AsyncStorage-based auth data provider
const createAsyncStorageAuthProvider = () => async (): Promise<AuthData | null> => {
  try {
    const [userIdItem, userNameItem, authTokenItem] = await AsyncStorage.multiGet([
      'user_id', 'user_name', 'auth_token'
    ]);
    
    const userID = userIdItem[1];
    const userName = userNameItem[1];
    const authToken = authTokenItem[1];
    
    if (!userID || !authToken) {
      return null;
    }
    
    return { userID, userName: userName || '', authToken };
  } catch (error) {
    console.error('Error loading auth data from AsyncStorage:', error);
    return null;
  }
};

// Props-based auth data provider
export const createPropsAuthProvider = (authData: AuthData | null) => async (): Promise<AuthData | null> => {
  return authData;
};

// Default tools using AsyncStorage
export const tools = createTools(createAsyncStorageAuthProvider()); 