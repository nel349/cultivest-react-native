import { ApiResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// For React Native development on physical devices, use local IP
// For simulators/emulators, use localhost
const getApiBaseUrl = () => {
  // TEMPORARY: Hardcode the production URL for testing
  console.log('🌐 Using hardcoded production URL');
  return 'https://cultivest-backend.vercel.app/api/v1';
  
  // First try environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('🌐 Using API URL from env:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Then try expo config
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (apiUrl) {
    console.log('🌐 Using API URL from expo config:', apiUrl);
    return apiUrl;
  }
  
  // Fallback to localhost for development
  console.log('🌐 Using fallback API URL: http://localhost:3000/api/v1');
  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🌐 Final API_BASE_URL:', API_BASE_URL);

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return {};
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('🌐 Making request to:', url);
      console.log('🌐 Request options:', { method: options.method || 'GET', body: options.body });
      
      const authHeaders = requireAuth ? await this.getAuthHeaders() : {};
      const headers = {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      };
      
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('🌐 Response status:', response.status);
      console.log('🌐 Response headers:', response.headers);
      
      // Get response text first to debug what we're receiving
      const responseText = await response.text();
      console.log('🌐 Raw response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🌐 JSON Parse Error:', parseError);
        console.error('🌐 Response was:', responseText);
        return {
          success: false,
          error: `Invalid JSON response: ${responseText.substring(0, 100)}`,
        };
      }
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('🌐 Network error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints (Updated to match backend implementation)
  async signup(phoneNumber: string, name: string, country: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, name, country }),
    });
  }

  async verifyOtp(userId: string, otpCode: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userID: userId, otpCode }),
    });
  }

  async login(phoneNumber: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/user/profile?userId=${userId}`);
  }

  async submitKyc(userId: string, kycData: any) {
    return this.request('/user/kyc', {
      method: 'POST',
      body: JSON.stringify({ userId, kycData }),
    });
  }

  // Wallet endpoints (Updated for backend integration)
  async createWallet(userId: string) {
    return this.request('/wallet/create', {
      method: 'POST',
      body: JSON.stringify({ userId }), // Backend expects 'userId', not 'userID'
    }, true);
  }

  async getWalletBalance(userId: string, live: boolean = false) {
    // Try userId (lowercase i) to match createWallet expectation
    return this.request(`/wallet/balance?userId=${userId}&live=${live}`);
  }

  // DEPRECATED: MoonPay Deposit endpoints (use unified invest endpoint instead)
  async initiateDeposit(amountUSD: number, targetCurrency: string = 'crypto') {
    console.warn('⚠️ DEPRECATED: Use createUserInvestment() instead');
    return this.request('/deposit/initiate', {
      method: 'POST',
      body: JSON.stringify({ amountUSD, targetCurrency }),
    }, true);
  }

  async getDepositStatus(transactionId: string) {
    console.warn('⚠️ DEPRECATED: Deposit status endpoint deprecated');
    return this.request(`/deposit/status/${transactionId}`, {}, true);
  }

  async calculateDepositFees(amountUSD: number) {
    console.warn('⚠️ DEPRECATED: Use unified invest endpoint with fee calculation');
    return this.request(`/deposit/calculate-fees?amountUSD=${amountUSD}`);
  }

  // Investment endpoints
  async initiateInvestment(userId: string, amount: number) {
    return this.request('/investment/initiate', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  }

  async getInvestmentPositions(userId: string) {
    return this.request(`/investment/positions?userId=${userId}`);
  }

  // DEPRECATED: Bitcoin Investment endpoints (use unified invest endpoint instead)
  async initiateBitcoinInvestment(userId: string, amountUSD: number, riskAccepted: boolean = true) {
    console.warn('⚠️ DEPRECATED: Use createUserInvestment() instead');
    return this.request('/investment/bitcoin/initiate', {
      method: 'POST',
      body: JSON.stringify({ userId, amountUSD, riskAccepted, investmentType: 'market_buy' }),
    });
  }

  async getBitcoinPositions(userId: string) {
    return this.request('/investment/bitcoin/positions', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getPortfolioOverview(userId: string) {
    return this.request('/investment/portfolio', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // NEW: Unified User Investment endpoints
  async createUserInvestment(userId: string, investmentData: any) {
    return this.request(`/users/${userId}/invest`, {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  async getUserInvestments(userId: string) {
    return this.request(`/users/${userId}/investments`);
  }

  async getUserInvestmentById(userId: string, positionTokenId: string) {
    return this.request(`/users/${userId}/investments/${positionTokenId}`);
  }

  // User Portfolio endpoints
  async getUserPortfolio(userId: string) {
    return this.request(`/users/${userId}/portfolio`);
  }

  async getUserPrimaryPortfolio(userId: string) {
    return this.request(`/users/${userId}/portfolio/primary`);
  }

  async getUserPortfolioPositions(userId: string) {
    return this.request(`/users/${userId}/portfolio/positions`);
  }

  async createUserPortfolio(userId: string, portfolioData: any) {
    return this.request(`/users/${userId}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  }

  async updatePortfolioName(userId: string, portfolioId: string, customName: string) {
    return this.request(`/users/${userId}/portfolio/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify({ customName }),
    });
  }

  // Bitcoin Balance endpoints
  async getBitcoinBalance(address: string) {
    return this.request(`/wallet/balance/bitcoin/${address}`);
  }

  // Dashboard endpoints
  async getDashboardData(userId: string) {
    return this.request(`/dashboard/data?userId=${userId}`);
  }

  // Education endpoints
  async getEducationalContent() {
    return this.request('/education/content');
  }

  async submitQuiz(userId: string, contentID: string, answers: number[]) {
    return this.request('/education/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ userId, contentID, answers }),
    });
  }

  // Withdrawal endpoints
  async initiateWithdrawal(userId: string, amount: number, provider: string, bankDetails?: any) {
    return this.request('/withdrawal/initiate', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, provider, bankDetails }),
    });
  }

  // AI endpoints
  async getRoundUpSuggestion(userId: string, transactionAmount: number, merchantName?: string) {
    return this.request('/ai/roundup-suggestion', {
      method: 'POST',
      body: JSON.stringify({ userId, transactionAmount, merchantName }),
    });
  }

  // Notification endpoints
  async sendDailyYieldNotification(userId: string, yieldAmount: number) {
    return this.request('/notifications/send-daily-yield', {
      method: 'POST',
      body: JSON.stringify({ userId, yieldAmount }),
    });
  }

  // Transaction receipt endpoints
  async sendTransactionReceipt(userId: string, transactionID: string, email: string, transactionType: string) {
    return this.request('/transaction/receipt/send', {
      method: 'POST',
      body: JSON.stringify({ userId, transactionID, email, transactionType }),
    });
  }

  // Cryptocurrency prices endpoints
  async getCryptoPrices() {
    return this.request('/prices');
  }

  async getCryptoPrice(coinId: string) {
    return this.request(`/prices/${coinId}`);
  }

  async refreshPrices() {
    return this.request('/prices/refresh', {
      method: 'POST',
    });
  }

  // Smart Contract endpoints
  async deployAndCallHelloWorld(name: string, userAddress: string) {
    return this.request('/smart-contract/hello-world', {
      method: 'POST',
      body: JSON.stringify({ name, userAddress }),
    }, true);
  }

  async getContractInfo(appId: string) {
    return this.request(`/smart-contract/hello-world/${appId}`, {}, true);
  }

  async callExistingContract(appId: string, name: string, userAddress: string) {
    return this.request(`/smart-contract/hello-world/${appId}/call`, {
      method: 'POST',
      body: JSON.stringify({ name, userAddress }),
    }, true);
  }
}

export const apiClient = new ApiClient();