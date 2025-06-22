// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  // Auth-specific fields
  userID?: string;
  token?: string;
  authToken?: string;
  // OTP/SMS-specific fields
  developmentMode?: boolean;
  smsProvider?: string;
  consoleOTP?: string;
  otpSent?: boolean;
  otp?: string;
  // Error handling fields
  userCreated?: boolean;
  canRetry?: boolean;
  // User data
  user?: {
    userID: string;
    phoneNumber: string;
    name: string;
    country: string;
    kycStatus: string;
    verified: boolean;
    walletCreated: boolean;
    walletAddress?: string;
  };
  // Wallet fields
  walletCreated?: boolean;
  walletAddress?: string;
}

// User Types
export interface User {
  userID: string;
  phoneNumber: string;
  name: string;
  country: string;
  email?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  currentBalanceUSDCa: number;
  dailyYieldAccumulated: number;
  moneyTreeLeaves: number;
  joinedAt: string;
}

// Wallet Types
export interface Wallet {
  walletID: string;
  userID: string;
  algorandAddress: string;
  balanceUSDCa: number;
  balanceAlgo: number;
  lastUpdated: string;
}

// Transaction Types
export interface Transaction {
  transactionID: string;
  userID: string;
  type: 'deposit' | 'investment' | 'withdrawal' | 'yield_credit';
  amountUSDCa: number;
  fiatAmount?: number;
  fiatCurrency?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  algorandTxID?: string;
  externalTxID?: string;
  timestamp: string;
}

// Investment Types
export interface InvestmentPosition {
  positionID: string;
  userID: string;
  poolID: string;
  investedAmountUSDCa: number;
  currentAPY: number;
  totalYieldEarned: number;
  startDate: string;
  status: 'active' | 'closed';
}

// Badge Types
export interface Badge {
  badgeID: string;
  name: string;
  description: string;
  awardedAt?: string;
}

// Educational Content Types
export interface EducationalContent {
  contentID: string;
  type: 'video' | 'quiz';
  title: string;
  url?: string;
  duration?: number;
  description?: string;
  quizQuestions?: QuizQuestion[];
  unlocksBadgeID?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Dashboard Types
export interface DashboardData {
  userID: string;
  balance: number;
  dailyYield: number;
  moneyTree: {
    leaves: number;
    growthStage: string;
    nextMilestone: number;
  };
  badges: Badge[];
  stats: {
    totalInvested: number;
    totalYieldEarned: number;
    daysActive: number;
    investmentStreak: number;
  };
  weeklyProgress: Array<{
    day: string;
    value: number;
  }>;
}

// AI Suggestion Types
export interface RoundUpSuggestion {
  userID: string;
  originalTransaction: {
    amount: number;
    merchantName: string;
  };
  roundUpAmount: number;
  suggestedInvestment: {
    pool: string;
    apy: number;
    estimatedDailyYield: string;
  };
  message: string;
  confidence: number;
  generatedAt: string;
}

// Notification Types
export interface Notification {
  notificationID: string;
  userID: string;
  type: 'daily_yield' | 'investment_complete' | 'withdrawal_complete';
  title: string;
  body: string;
  data?: any;
  sentAt: string;
  delivered: boolean;
}