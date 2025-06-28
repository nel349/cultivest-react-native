import { ApiResponse } from './api';

export interface WalletResponse extends ApiResponse {
  wallet_id?: string;
  addresses?: {
    bitcoin?: string;
    algorand?: string;
    solana?: string;
  };
  wallet?: {
    bitcoinAddress?: string;
    algorandAddress?: string;
    solanaAddress?: string;
  };
}

export interface BalanceData {
  btc: number;
  algo: number;
  usdca: number;
  sol: number;
}

export interface OnChainBalance extends BalanceData {
  lastUpdated: string;
  isOptedIntoUSDCa?: boolean;
}

export interface WalletBalance {
  bitcoin: number;
  algorand: number;
  usdc: number;
  solana: number;
}

export interface MultiChainWallet {
  walletId: string;
  userId: string;
  addresses: {
    bitcoin?: string;
    algorand?: string;
    solana?: string;
  };
  balance: BalanceData;
  onChainBalance?: OnChainBalance;
  createdAt: string;
}

export interface CreateWalletRequest {
  userId: string;
}

export interface WalletCreationResponse extends ApiResponse {
  wallet?: MultiChainWallet;
  created: boolean;
  transactionIds?: string[];
  portfolioNFT?: {
    tokenId: string;
    transactionId: string;
    appId: string;
  };
}

export interface PricesResponse extends ApiResponse {
  prices?: {
    bitcoin?: { usd: number };
    algorand?: { usd: number };
  };
} 