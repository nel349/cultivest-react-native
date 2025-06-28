import { ApiResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// For React Native development on physical devices, use local IP
// For simulators/emulators, use localhost
const getApiBaseUrl = () => {
  // First try environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Then try expo config
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

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

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
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

  async verifyOtp(userID: string, otpCode: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userID, otpCode }),
    });
  }

  async login(phoneNumber: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // User endpoints
  async getUserProfile(userID: string) {
    return this.request(`/user/profile?userID=${userID}`);
  }

  async submitKyc(userID: string, kycData: any) {
    return this.request('/user/kyc', {
      method: 'POST',
      body: JSON.stringify({ userID, kycData }),
    });
  }

  // Wallet endpoints (Updated for backend integration)
  async createWallet(userID: string) {
    return this.request('/wallet/create', {
      method: 'POST',
      body: JSON.stringify({ userId: userID }), // Backend expects 'userId', not 'userID'
    }, true);
  }

  async getWalletBalance(userID: string, live: boolean = false) {
    return this.request(`/wallet/balance?userID=${userID}&live=${live}`, {}, true);
  }

  // MoonPay Deposit endpoints (Multi-crypto support)
  async initiateDeposit(amountUSD: number, targetCurrency: string = 'crypto') {
    return this.request('/deposit/initiate', {
      method: 'POST',
      body: JSON.stringify({ amountUSD, targetCurrency }),
    }, true);
  }

  async getDepositStatus(transactionId: string) {
    return this.request(`/deposit/status/${transactionId}`, {}, true);
  }

  async calculateDepositFees(amountUSD: number) {
    return this.request(`/deposit/calculate-fees?amountUSD=${amountUSD}`);
  }

  // Investment endpoints
  async initiateInvestment(userID: string, amount: number) {
    return this.request('/investment/initiate', {
      method: 'POST',
      body: JSON.stringify({ userID, amount }),
    });
  }

  async getInvestmentPositions(userID: string) {
    return this.request(`/investment/positions?userID=${userID}`);
  }

  // DEPRECATED: Bitcoin Investment endpoints (use unified invest endpoint instead)
  async initiateBitcoinInvestment(userID: string, amountUSD: number, riskAccepted: boolean = true) {
    console.warn('⚠️ DEPRECATED: Use createUserInvestment() instead');
    return this.request('/investment/bitcoin/initiate', {
      method: 'POST',
      body: JSON.stringify({ userID, amountUSD, riskAccepted, investmentType: 'market_buy' }),
    });
  }

  async getBitcoinPositions(userID: string) {
    return this.request('/investment/bitcoin/positions', {
      method: 'POST',
      body: JSON.stringify({ userID }),
    });
  }

  async getPortfolioOverview(userID: string) {
    return this.request('/investment/portfolio', {
      method: 'POST',
      body: JSON.stringify({ userID }),
    });
  }

  // NEW: Unified User Investment endpoints
  async createUserInvestment(userID: string, investmentData: any) {
    return this.request(`/users/${userID}/invest`, {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  async getUserInvestments(userID: string) {
    return this.request(`/users/${userID}/investments`);
  }

  async getUserInvestmentById(userID: string, positionTokenId: string) {
    return this.request(`/users/${userID}/investments/${positionTokenId}`);
  }

  // User Portfolio endpoints
  async getUserPortfolio(userID: string) {
    return this.request(`/users/${userID}/portfolio`);
  }

  async getUserPrimaryPortfolio(userID: string) {
    return this.request(`/users/${userID}/portfolio/primary`);
  }

  async getUserPortfolioPositions(userID: string) {
    return this.request(`/users/${userID}/portfolio/positions`);
  }

  async createUserPortfolio(userID: string, portfolioData: any) {
    return this.request(`/users/${userID}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  }

  async updatePortfolioName(userID: string, portfolioId: string, customName: string) {
    return this.request(`/users/${userID}/portfolio/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify({ customName }),
    });
  }

  // Bitcoin Balance endpoints
  async getBitcoinBalance(address: string) {
    return this.request(`/wallet/balance/bitcoin/${address}`);
  }

  // Dashboard endpoints
  async getDashboardData(userID: string) {
    return this.request(`/dashboard/data?userID=${userID}`);
  }

  // Education endpoints
  async getEducationalContent() {
    return this.request('/education/content');
  }

  async submitQuiz(userID: string, contentID: string, answers: number[]) {
    return this.request('/education/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ userID, contentID, answers }),
    });
  }

  // Withdrawal endpoints
  async initiateWithdrawal(userID: string, amount: number, provider: string, bankDetails?: any) {
    return this.request('/withdrawal/initiate', {
      method: 'POST',
      body: JSON.stringify({ userID, amount, provider, bankDetails }),
    });
  }

  // AI endpoints
  async getRoundUpSuggestion(userID: string, transactionAmount: number, merchantName?: string) {
    return this.request('/ai/roundup-suggestion', {
      method: 'POST',
      body: JSON.stringify({ userID, transactionAmount, merchantName }),
    });
  }

  // Notification endpoints
  async sendDailyYieldNotification(userID: string, yieldAmount: number) {
    return this.request('/notifications/send-daily-yield', {
      method: 'POST',
      body: JSON.stringify({ userID, yieldAmount }),
    });
  }

  // Transaction receipt endpoints
  async sendTransactionReceipt(userID: string, transactionID: string, email: string, transactionType: string) {
    return this.request('/transaction/receipt/send', {
      method: 'POST',
      body: JSON.stringify({ userID, transactionID, email, transactionType }),
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