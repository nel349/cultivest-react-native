import { ApiResponse } from './api';

export interface NFTResponse extends ApiResponse {
  tokenId?: string;
  owner?: string;
  metadata?: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image?: string;
  properties?: Record<string, any>;
}

// Note: PositionNFT and PortfolioNFT are already defined in api.ts
// Add any additional NFT-specific types here if needed 