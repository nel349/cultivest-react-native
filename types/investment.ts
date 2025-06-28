import { ApiResponse } from './api';

export interface InvestmentResponse extends ApiResponse {
  data?: {
    investment?: {
      investmentId?: string;
    };
  };
}

export interface InvestmentRequest {
  amount: number;
  assetType: 'bitcoin' | 'algorand' | 'usdc' | 'solana';
}

export interface PortfolioPosition {
  id: string;
  assetType: string;
  amount: number;
  currentValue: number;
  purchasePrice: number;
} 