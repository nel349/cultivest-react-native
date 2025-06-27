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

export interface WalletBalance {
  bitcoin: number;
  algorand: number;
  usdc: number;
}

export interface CreateWalletRequest {
  userId: string;
} 