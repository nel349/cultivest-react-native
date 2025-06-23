# 🎨 **NFT Portfolio Architecture**

## 📋 **System Overview**

This document specifies the NFT-based portfolio system for Cultivest, where investment portfolios become tradeable blockchain assets. Each user's complete investment portfolio is represented as a **Master Portfolio NFT** containing multiple **Position NFTs** for individual cryptocurrency holdings. **Phase 1** focuses on Bitcoin + Algorand support with custodial wallets, while **Phase 2** introduces Chain Key self-custody.

## 🏗️ **NFT Architecture Components**

### **NFT Types:**
- **🎯 Master Portfolio NFT** - Represents entire investment portfolio (1 per user)
- **💎 Position NFTs** - Individual crypto investments (multiple per portfolio)
- **📊 Performance NFTs** - Historical performance snapshots (optional)

### **Blockchain:**
- **Primary Chain**: Algorand (all NFTs minted here)
- **Asset Storage**: Bitcoin (custodial Phase 1, self-custody Phase 2), Algorand (direct), Ethereum/Solana (future)
- **Custody Model**: Custodial wallets (Phase 1) → Chain Key self-custody opt-in (Phase 2)
- **Metadata Storage**: IPFS + On-chain verification

---

## 🎯 **Master Portfolio NFT**

### **Purpose:**
- **Single ownership token** for entire investment portfolio
- **Bundle transfer mechanism** - transfer entire portfolio in one transaction
- **Inheritance vehicle** - pass complete portfolio to heirs
- **Collateral asset** - use portfolio as loan collateral
- **Trading asset** - sell entire portfolio to other investors

### **Master Portfolio NFT Structure:**

```json
{
  "standard": "ARC-69",
  "name": "Cultivest Portfolio #1337",
  "description": "Multi-chain cryptocurrency portfolio with $2,850 total value (Phase 1: Bitcoin + Algorand)",
  "image": "ipfs://QmPortfolioVisualizationChart1337.png",
  "animation_url": "ipfs://QmPortfolioDashboard1337.html",
  "properties": {
    "portfolio_id": "portfolio_1337",
    "owner_algorand_address": "PORTFOLIO1337OWNERADDRESSALGORAND123456789",
    "creation_date": "2024-12-15T10:30:00Z",
    "last_update": "2024-12-21T15:45:00Z",
    "custody_status": "custodial", // custodial or self_custody
    "phase": "1", // Phase 1 (custodial) or Phase 2 (self-custody)
    "portfolio_metrics": {
      "total_value_usd": 2850.75,
      "invested_amount_usd": 2500.00,
      "unrealized_pnl": 350.75,
      "roi_percentage": 14.03,
      "position_count": 2, // Bitcoin + Algorand positions
      "days_active": 45,
      "best_performer": "BTC",
      "worst_performer": "ALGO"
    },
    "position_nfts": [
      {
        "asset_id": 98765001,
        "symbol": "BTC",
        "value_usd": 2000.00,
        "weight_percentage": 70.18,
        "custody_type": "custodial",
        "blockchain": "bitcoin"
      },
      {
        "asset_id": 98765002,
        "symbol": "ALGO",
        "value_usd": 850.75,
        "weight_percentage": 29.82,
        "custody_type": "direct",
        "blockchain": "algorand"
      }
    ],
    "supported_blockchains": ["bitcoin", "algorand"], // Phase 1 support
    "future_blockchains": ["ethereum", "solana"], // Phase 2 expansion  
    "wallet_addresses": {
      "bitcoin": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Custodial address
      "algorand": "PORTFOLIO1337OWNERADDRESSALGORAND123456789" // Direct user address
    },
    "portfolio_features": {
      "custodial_bitcoin": true,
      "direct_algorand": true,
      "chain_key_opt_in": false, // Phase 2 feature
      "yield_harvesting": false, // No yield in Phase 1 (price appreciation only)
      "portfolio_nft_trading": true,
      "inheritance_planning": true,
      "risk_management": "moderate"
    },
    "transfer_history": [
      {
        "from": "CREATOR123...",
        "to": "CURRENT123...",
        "date": "2024-12-15T10:30:00Z",
        "type": "mint"
      }
    ]
  }
}
```

---

## 💎 **Position NFTs**

### **Purpose:**
- **Individual asset ownership** proof for each cryptocurrency
- **Detailed investment tracking** with entry prices, performance metrics
- **Granular control** - trade individual positions while keeping portfolio
- **Yield generation** tracking for staking/lending positions

### **Bitcoin Position NFT Example:**

```json
{
  "standard": "ARC-69",
  "name": "Cultivest Bitcoin Position #BTC-001",
  "description": "Bitcoin investment position: 0.02897 BTC acquired at $43,250",
  "image": "ipfs://QmBitcoinPositionChart001.png",
  "animation_url": "ipfs://QmBitcoinPerformanceWidget001.html",
  "properties": {
    "position_id": "btc_position_001",
    "parent_portfolio_nft": 12345,
    "asset_details": {
      "symbol": "BTC",
      "name": "Bitcoin", 
      "blockchain": "bitcoin",
      "network": "mainnet",
      "asset_type": "cryptocurrency",
      "category": "store_of_value"
    },
    "investment_data": {
      "quantity": 0.02897,
      "entry_price_usd": 43250.00,
      "invested_amount_usd": 1250.00,
      "current_price_usd": 45800.00,
      "current_value_usd": 1326.75,
      "unrealized_pnl": 76.75,
      "roi_percentage": 6.14,
      "entry_date": "2024-11-01T14:20:00Z",
      "holding_period_days": 50
    },
    "wallet_info": {
      "wallet_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "transaction_hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      "block_height": 820145,
      "confirmation_date": "2024-11-01T14:35:00Z"
    },
    "performance_metrics": {
      "best_price_usd": 47200.00,
      "worst_price_usd": 41800.00,
      "volatility_30d": 12.5,
      "correlation_to_portfolio": 0.85,
      "sharpe_ratio": 1.24
    },
    "risk_data": {
      "risk_level": "medium",
      "position_size_percentage": 43.86,
      "concentration_risk": "high",
      "liquidity_score": 10
    },
    "blockchain_proofs": [
      {
        "proof_type": "purchase_transaction",
        "blockchain": "bitcoin",
        "tx_hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        "verified": true
      }
    ]
  }
}
```

### **Ethereum Position NFT Example:**

```json
{
  "standard": "ARC-69",
  "name": "Cultivest Ethereum Position #ETH-002",
  "description": "Ethereum investment position: 0.2637 ETH acquired at $2,580",
  "image": "ipfs://QmEthereumPositionChart002.png", 
  "properties": {
    "position_id": "eth_position_002",
    "parent_portfolio_nft": 12345,
    "asset_details": {
      "symbol": "ETH",
      "name": "Ethereum",
      "blockchain": "ethereum", 
      "network": "mainnet",
      "asset_type": "cryptocurrency",
      "category": "smart_contracts"
    },
    "investment_data": {
      "quantity": 0.2637,
      "entry_price_usd": 2580.00,
      "invested_amount_usd": 680.50,
      "current_price_usd": 2720.00,
      "current_value_usd": 717.26,
      "unrealized_pnl": 36.76,
      "roi_percentage": 5.40
    },
    "wallet_info": {
      "wallet_address": "0x742d35Cc6634C0532925a3b8D5c229E566E02b5C",
      "transaction_hash": "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      "block_number": 18750000,
      "gas_used": 21000
    },
    "staking_info": {
      "is_staked": false,
      "available_for_staking": true,
      "estimated_staking_apy": 4.2
    }
  }
}
```

### **Solana Position NFT Example:**

```json
{
  "standard": "ARC-69", 
  "name": "Cultivest Solana Position #SOL-003",
  "description": "Solana investment position: 4.32 SOL acquired at $98.50",
  "properties": {
    "position_id": "sol_position_003",
    "parent_portfolio_nft": 12345,
    "asset_details": {
      "symbol": "SOL",
      "name": "Solana",
      "blockchain": "solana",
      "network": "mainnet", 
      "asset_type": "cryptocurrency",
      "category": "layer_1"
    },
    "investment_data": {
      "quantity": 4.32,
      "entry_price_usd": 98.50,
      "invested_amount_usd": 425.52,
      "current_price_usd": 105.20,
      "current_value_usd": 454.46,
      "unrealized_pnl": 28.94,
      "roi_percentage": 6.80
    },
    "wallet_info": {
      "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "transaction_signature": "c4d5e6f7890123456789012345678901234567890abcdef1234567890abcdef123",
      "slot": 250000000
    }
  }
}
```

### **USDCa Staking Position NFT Example:**

```json
{
  "standard": "ARC-69",
  "name": "Cultivest USDCa Stake #USDC-005", 
  "description": "USDCa staking position: 150.00 USDCa earning 4.2% APY",
  "properties": {
    "position_id": "usdca_stake_005",
    "parent_portfolio_nft": 12345,
    "asset_details": {
      "symbol": "USDCa",
      "name": "USD Coin (Algorand)",
      "blockchain": "algorand",
      "network": "testnet",
      "asset_type": "stablecoin", 
      "category": "yield_bearing"
    },
    "investment_data": {
      "principal_amount": 150.00,
      "current_balance": 152.85,
      "yield_earned": 2.85,
      "apy": 4.2,
      "compounding": "daily",
      "staking_duration_days": 45
    },
    "staking_details": {
      "staking_contract": "STAKINGCONTRACT123456789ALGORAND",
      "start_date": "2024-11-01T00:00:00Z",
      "end_date": null,
      "is_locked": false,
      "withdrawal_fee": 0,
      "next_reward_date": "2024-12-22T00:00:00Z"
    },
    "yield_history": [
      {
        "date": "2024-12-21",
        "daily_yield": 0.017,
        "running_total": 2.85
      }
    ]
  }
}
```

---

## 🔗 **NFT Relationship Architecture**

### **Portfolio → Position Linking:**

```typescript
// Master Portfolio NFT contains references to all Position NFTs
const portfolioNFT = {
  asset_id: 12345,
  properties: {
    position_nfts: [
      { asset_id: 98765001, symbol: "BTC" },
      { asset_id: 98765002, symbol: "ETH" },
      { asset_id: 98765003, symbol: "SOL" }
    ]
  }
};

// Each Position NFT references back to Portfolio NFT
const positionNFT = {
  asset_id: 98765001,
  properties: {
    parent_portfolio_nft: 12345,
    symbol: "BTC"
  }
};
```

### **Bundle Transfer Logic:**

```typescript
// When Portfolio NFT is transferred, all Position NFTs must transfer too
async function transferPortfolioBundle(portfolioNFTId: number, fromAddress: string, toAddress: string) {
  // 1. Get all position NFTs linked to portfolio
  const positionNFTs = await getLinkedPositionNFTs(portfolioNFTId);
  
  // 2. Create atomic transaction group
  const txnGroup = [];
  
  // 3. Transfer portfolio NFT
  txnGroup.push(createNFTTransferTxn(portfolioNFTId, fromAddress, toAddress));
  
  // 4. Transfer all position NFTs
  for (const positionNFT of positionNFTs) {
    txnGroup.push(createNFTTransferTxn(positionNFT.asset_id, fromAddress, toAddress));
  }
  
  // 5. Execute all transfers atomically (all or nothing)
  return await executeAtomicTransactionGroup(txnGroup);
}
```

---

## 🎯 **Use Cases & Applications**

### **1. Portfolio Trading:**

```typescript
// List entire portfolio for sale
const portfolioListing = {
  portfolio_nft_id: 12345,
  asking_price_usd: 3000, // 5% premium over current value
  current_value_usd: 2850,
  position_count: 7,
  seller: "SELLER123...",
  buyer: null,
  expiry_date: "2024-12-31T23:59:59Z"
};

// Buy complete portfolio
const portfolioPurchase = {
  buyer: "BUYER456...",
  payment_amount: 3000,
  includes_positions: ["BTC", "ETH", "SOL", "ALGO", "USDCa", "BNB", "DOGE"],
  transfer_method: "atomic_bundle"
};
```

### **2. Inheritance & Estate Planning:**

```typescript
// Set up inheritance beneficiary
const inheritancePlan = {
  portfolio_nft_id: 12345,
  current_owner: "OWNER123...",
  beneficiary: "HEIR456...",
  trigger_conditions: [
    "inactivity_180_days",
    "signed_death_certificate",
    "multi_sig_executor_approval"
  ],
  effective_date: null // Triggers automatically
};
```

### **3. Fractionalized Ownership:**

```typescript
// Split portfolio into tradeable shares
const fractionalization = {
  portfolio_nft_id: 12345,
  total_shares: 100,
  share_price_usd: 28.50, // $2850 / 100 shares
  shareholders: [
    { address: "ADDR1...", shares: 40, value: 1140.00 },
    { address: "ADDR2...", shares: 35, value: 997.50 },
    { address: "ADDR3...", shares: 25, value: 712.50 }
  ],
  governance_token: "CULT_PORTFOLIO_1337",
  dividend_distribution: "proportional"
};
```

### **4. Collateralized Lending:**

```typescript
// Use portfolio as loan collateral
const collateralLoan = {
  portfolio_nft_id: 12345,
  portfolio_value_usd: 2850,
  loan_amount_requested: 1425, // 50% LTV ratio
  collateral_ratio: 0.50,
  interest_rate: 8.5,
  loan_term_days: 90,
  liquidation_threshold: 0.75,
  lender: "LENDER789..."
};
```

---

## 🛠️ **Technical Implementation**

### **NFT Minting Flow:**

```typescript
// File: cultivest-backend/utils/nft-minting.ts
export class PortfolioNFTManager {
  
  // Mint Master Portfolio NFT when user creates first investment
  static async mintPortfolioNFT(userId: string, walletAddresses: any) {
    const metadata = {
      name: `Cultivest Portfolio #${await getNextPortfolioNumber()}`,
      description: "Multi-chain cryptocurrency portfolio",
      image: await generatePortfolioChart(userId),
      properties: {
        owner_algorand_address: walletAddresses.algorand,
        creation_date: new Date().toISOString(),
        supported_blockchains: ["bitcoin", "ethereum", "solana", "algorand"],
        wallet_addresses: walletAddresses,
        position_nfts: [], // Empty at creation
        total_value_usd: 0
      }
    };
    
    // Mint NFT on Algorand
    const portfolioNFT = await mintAlgorandNFT(metadata, userId);
    
    // Store in database
    await supabase.from('portfolio_nfts').insert({
      user_id: userId,
      nft_asset_id: portfolioNFT.assetId,
      metadata: metadata,
      status: 'active'
    });
    
    return portfolioNFT;
  }
  
  // Mint Position NFT when user makes investment
  static async mintPositionNFT(investment: any, portfolioNFTId: number) {
    const metadata = {
      name: `Cultivest ${investment.symbol} Position #${investment.symbol}-${await getNextPositionNumber(investment.symbol)}`,
      description: `${investment.symbol} investment position: ${investment.quantity} ${investment.symbol} acquired at $${investment.entryPrice}`,
      image: await generatePositionChart(investment),
      properties: {
        parent_portfolio_nft: portfolioNFTId,
        asset_details: investment.assetDetails,
        investment_data: investment.investmentData,
        wallet_info: investment.walletInfo,
        blockchain_proofs: investment.blockchainProofs
      }
    };
    
    // Mint Position NFT
    const positionNFT = await mintAlgorandNFT(metadata, investment.userId);
    
    // Update Portfolio NFT to include new position
    await updatePortfolioNFTPositions(portfolioNFTId, positionNFT.assetId);
    
    return positionNFT;
  }
  
  // Update Portfolio NFT when positions change
  static async updatePortfolioNFT(portfolioNFTId: number) {
    // Get all linked position NFTs
    const positions = await getLinkedPositionNFTs(portfolioNFTId);
    
    // Calculate updated portfolio metrics
    const portfolioMetrics = await calculatePortfolioMetrics(positions);
    
    // Update NFT metadata
    await updateAlgorandNFTMetadata(portfolioNFTId, {
      last_update: new Date().toISOString(),
      portfolio_metrics: portfolioMetrics,
      position_nfts: positions.map(p => ({
        asset_id: p.asset_id,
        symbol: p.symbol,
        value_usd: p.value_usd,
        weight_percentage: p.weight_percentage
      }))
    });
  }
}
```

### **Bundle Transfer Implementation:**

```typescript
// File: cultivest-backend/utils/portfolio-transfers.ts  
export class PortfolioTransferManager {
  
  static async transferPortfolioBundle(portfolioNFTId: number, toAddress: string, userPrivateKey: string) {
    try {
      // 1. Get portfolio and all position NFTs
      const portfolio = await getPortfolioNFT(portfolioNFTId);
      const positions = await getLinkedPositionNFTs(portfolioNFTId);
      
      // 2. Verify ownership
      if (!await verifyPortfolioOwnership(portfolioNFTId, userPrivateKey)) {
        throw new Error('Not authorized to transfer this portfolio');
      }
      
      // 3. Create atomic transaction group
      const txnGroup = [];
      
      // 4. Add portfolio NFT transfer
      txnGroup.push(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: portfolio.owner_address,
        to: toAddress,
        assetIndex: portfolioNFTId,
        amount: 1,
        suggestedParams: await algodClient.getTransactionParams().do()
      }));
      
      // 5. Add all position NFT transfers
      for (const position of positions) {
        txnGroup.push(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: portfolio.owner_address,
          to: toAddress,
          assetIndex: position.asset_id,
          amount: 1,
          suggestedParams: await algodClient.getTransactionParams().do()
        }));
      }
      
      // 6. Group transactions atomically
      const groupId = algosdk.computeGroupID(txnGroup);
      txnGroup.forEach(txn => txn.group = groupId);
      
      // 7. Sign all transactions
      const account = algosdk.mnemonicToSecretKey(userPrivateKey);
      const signedTxns = txnGroup.map(txn => txn.signTxn(account.sk));
      
      // 8. Submit atomic group
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      
      // 9. Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      // 10. Update database records
      await updatePortfolioOwnership(portfolioNFTId, toAddress);
      await updatePositionOwnership(positions.map(p => p.asset_id), toAddress);
      
      return {
        success: true,
        txId: txId,
        transferred_nfts: [portfolioNFTId, ...positions.map(p => p.asset_id)],
        new_owner: toAddress
      };
      
    } catch (error) {
      console.error('Portfolio bundle transfer failed:', error);
      throw error;
    }
  }
}
```

---

## 🎨 **Visual & Metadata Generation**

### **Portfolio Chart Generation:**

```typescript
// Generate dynamic portfolio visualization
async function generatePortfolioChart(userId: string): Promise<string> {
  const positions = await getUserPositions(userId);
  
  // Create pie chart of asset allocation
  const chartData = positions.map(p => ({
    symbol: p.symbol,
    value: p.value_usd,
    percentage: p.weight_percentage,
    color: getAssetColor(p.symbol)
  }));
  
  // Generate SVG chart
  const svgChart = createPieChart(chartData);
  
  // Upload to IPFS
  const ipfsHash = await uploadToIPFS(svgChart);
  
  return `ipfs://${ipfsHash}`;
}
```

### **Performance Widget Generation:**

```typescript
// Generate interactive performance dashboard
async function generatePerformanceWidget(positionId: string): Promise<string> {
  const position = await getPosition(positionId);
  const priceHistory = await getPriceHistory(position.symbol, 30);
  
  // Create HTML dashboard
  const dashboard = `
    <html>
      <head><title>${position.symbol} Performance</title></head>
      <body>
        <div class="position-dashboard">
          <h1>${position.symbol} Position</h1>
          <div class="metrics">
            <div>Value: $${position.current_value_usd}</div>
            <div>P&L: $${position.unrealized_pnl}</div>
            <div>ROI: ${position.roi_percentage}%</div>
          </div>
          <canvas id="price-chart"></canvas>
          <script>
            // Interactive price chart
            drawPriceChart(${JSON.stringify(priceHistory)});
          </script>
        </div>
      </body>
    </html>
  `;
  
  const ipfsHash = await uploadToIPFS(dashboard);
  return `ipfs://${ipfsHash}`;
}
```

---

## 🔒 **Security & Ownership**

### **NFT Ownership Verification:**
- **Portfolio NFT ownership** = Control over entire portfolio
- **Position NFT ownership** = Control over individual investments  
- **Atomic transfers** = All-or-nothing portfolio transfers
- **Blockchain verification** = Immutable ownership records

### **Access Control Matrix:**
| Action | Portfolio NFT Owner | Position NFT Owner | Portfolio + Position Owner |
|--------|--------------------|--------------------|----------------------------|
| **View Portfolio** | ✅ | ✅ | ✅ |
| **Trade Individual Position** | ❌ | ✅ | ✅ |
| **Transfer Portfolio Bundle** | ✅ | ❌ | ✅ |
| **Update Metadata** | ✅ | ✅ | ✅ |
| **Withdraw Crypto** | Requires both | Requires both | ✅ |

This NFT architecture creates a **truly innovative DeFi primitive** where investment portfolios become tradeable, inheritable, and fractionatable blockchain assets - perfect for the Blockchain Challenge! 