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
  addresses?: {
    bitcoin?: string;
    algorand?: string;
  };
  balance?: {
    databaseBalance: {
      btc: number;
      algo: number;
      usdca: number;
    };
    onChainBalance?: {
      btc: number;
      algo: number;
      usdca: number;
      lastUpdated: string;
      isOptedIntoUSDCa?: boolean;
    };
  };
  // Deposit fields
  moonpayUrl?: string;
  transactionId?: string;
  estimatedUSDCa?: number;
  conversionRate?: string;
  fees?: {
    moonpayFee: number;
    conversionFee: number;
    total: number;
  };
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

// Bitcoin Investment Types
export interface BitcoinInvestment {
  investmentId: string;
  type: string;
  amountUSD: number;
  estimatedBTC: number;
  bitcoinPrice: number;
  fees: {
    moonpayFee: number;
    networkFee: number;
    total: number;
  };
  walletAddress: string;
  status: string;
  riskLevel: string;
  custodyType: string;
}

export interface BitcoinPosition {
  investmentId: string;
  type: string;
  purchaseDate: string;
  amountInvestedUSD: number;
  bitcoinAmount: number;
  purchasePrice: number;
  currentPrice: number;
  currentValueUSD: number;
  unrealizedPnL: number;
  performancePercentage: string;
  status: string;
  fees: number;
}

export interface PortfolioOverview {
  summary: {
    totalValueUSD: number;
    totalInvestedUSD: number;
    unrealizedPnL: number;
    portfolioPerformance: string;
    lastUpdated: string;
  };
  allocation: {
    bitcoin: {
      balance: number;
      valueUSD: number;
      percentage: string;
      price: number;
    };
    algorand: {
      balance: number;
      valueUSD: number;
      percentage: string;
      price: number;
    };
    usdc: {
      balance: number;
      valueUSD: number;
      percentage: string;
      price: number;
    };
  };
  holdings: {
    bitcoin: {
      address: string;
      balance: number;
      valueUSD: number;
    };
    algorand: {
      address: string;
      balance: number;
      valueUSD: number;
      usdcBalance: number;
      usdcValueUSD: number;
      isOptedIntoUSDC: boolean;
    };
  };
  analytics: {
    bitcoinFirst: boolean;
    diversificationScore: string;
    riskLevel: string;
  };
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

// NFT Types
export interface PositionNFT {
  tokenId: string;
  owner: string;
  ownerBase64: string;
  assetType: string;
  assetTypeName: string;
  holdings: string;
  purchaseValue: string;
  portfolioTokenId?: string;
}

export interface PortfolioNFT {
  id: string;
  tokenId: string;
  customName: string;
  isPrimary: boolean;
  positionCount: number;
  positions: PositionNFT[];
}

export interface NFTStats {
  totalTokensMinted: string;
  currentSupply: string;
  maxSupply: string;
  contractVersion: string;
  positionNFTAppId: string;
}

export interface UserInvestmentData {
  hasInvestments: boolean;
  portfolio: PortfolioNFT | null;
  positions: PositionNFT[];
  stats: NFTStats;
}

export interface UnifiedInvestmentRequest {
  algorandAddress: string;
  assetType: 1 | 2 | 3 | 4; // 1=Bitcoin, 2=Algorand, 3=USDC, 4=Solana
  // For direct investment recording
  holdings?: string;
  purchaseValueUsd?: string;
  // For MoonPay purchases
  amountUSD?: number;
  useMoonPay?: boolean;
  riskAccepted?: boolean;
  portfolioName?: string;
}

export interface UnifiedInvestmentResponse {
  message: string;
  investment: {
    positionTokenId: string;
    portfolioTokenId: string;
    assetType: string;
    assetTypeName: string;
    holdings: string;
    purchaseValueUsd: string;
    owner: string;
    investmentId?: string;
    status?: string;
  };
  portfolio: {
    id: string;
    tokenId: string;
    customName: string;
    isPrimary: boolean;
  };
  blockchain: {
    positionTransactionId?: string;
    portfolioTransactionId?: string;
    positionAppId: string;
    portfolioAppId: string;
  };
  moonpay?: {
    url: string;
    estimatedBTC: number;
    bitcoinPrice: number;
    fees: {
      moonpayFee: number;
      networkFee: number;
      total: number;
    };
  };
  nextSteps: string[];
}