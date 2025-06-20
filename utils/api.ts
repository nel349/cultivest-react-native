import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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

  // Auth endpoints
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

  // Wallet endpoints
  async getWalletBalance(userID: string) {
    return this.request(`/wallet/balance?userID=${userID}`);
  }

  // Deposit endpoints
  async initiateDeposit(userID: string, amount: number, currency: string, provider: string) {
    return this.request('/deposit/initiate', {
      method: 'POST',
      body: JSON.stringify({ userID, amount, currency, provider }),
    });
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
}

export const apiClient = new ApiClient();