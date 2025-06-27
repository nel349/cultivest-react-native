import { ApiResponse } from './api';

export interface WalletResponse extends ApiResponse {
  wallet_id?: string;
  addresses?: {
    bitcoin?: string;
    algorand?: string;
  };
  wallet?: {
    bitcoinAddress?: string;
    algorandAddress?: string;
  };
}

export interface BalanceData {
  btc: number;
  algo: number;
  usdca: number;
}

export interface PricesResponse extends ApiResponse {
  prices?: {
    bitcoin?: { usd: number };
    algorand?: { usd: number };
  };
}

export interface WalletBalance {
  bitcoin: number;
  algorand: number;
  usdc: number;
}

export interface CreateWalletRequest {
  userId: string;
} 