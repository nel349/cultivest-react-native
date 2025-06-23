# Cultivest - Detailed Features

This document outlines the technical features for Cultivest, a Bitcoin-first mobile investment platform enabling micro-investments ($1-$10) in Bitcoin and Algorand with revolutionary NFT portfolio tracking. The platform provides secure custodial wallets for both chains with future opt-in to self-custody via Chain Key architecture.

## 🚀 **Implementation Status - PHASE 1A COMPLETED** ✅

### ✅ **PHASE 1A: FOUNDATION (DECEMBER 2024) - COMPLETED:**
- **Real User Authentication**: Phone-based signup with SMS OTP via Twilio + Supabase database
- **🎯 Bitcoin-First Multi-Chain Custodial System**: Professional-grade custody for Bitcoin + Algorand
  - **Bitcoin Wallet Generation**: Secure Bitcoin address creation and AES-256 encrypted key management
  - **Algorand Wallet Generation**: Native Algorand wallet creation with USDC asset opt-in
  - **MoonPay Bitcoin Integration**: Direct USD → Bitcoin purchases with no conversion fees
  - **Custodial Storage**: Backend manages Bitcoin and Algorand transactions with institutional security
  - **Real-time Multi-Chain Tracking**: Live Bitcoin and Algorand balance monitoring with price updates
- **Revolutionary Portfolio NFTs**: Algorand blockchain tracks Bitcoin + Algorand investments as tradeable NFTs
  - **Portfolio NFT Creation**: Each user gets a unique NFT representing their multi-chain portfolio
  - **Performance Tracking**: NFT metadata updates with Bitcoin and Algorand gains/losses in real-time
  - **Investment History**: Complete multi-chain investment timeline stored on-chain
- **MoonPay SDK Integration**: React Native SDK optimized for Bitcoin purchases
- **Database Architecture**: Bitcoin-optimized PostgreSQL schema with NFT metadata support

### 🎯 **PRODUCTION-READY COMPONENTS:**
**Bitcoin-First Multi-Chain Investment Infrastructure:**
- Professional Bitcoin + Algorand custodial system with institutional-grade security
- Direct MoonPay integration for seamless USD → Bitcoin purchases
- Native Algorand investment capabilities with USDC support
- Revolutionary NFT portfolio tracking on Algorand blockchain
- Real-time multi-chain balance monitoring and price synchronization
- Ready for Bitcoin-first multi-chain investment platform deployment

**Backend transforms Cultivest into the first NFT-powered Bitcoin + Algorand investment platform!** 🏆

## 1. User Onboarding - ✅ PHASE 1A COMPLETED
- [x] ✅ **Phone-based signup with OTP verification** - IMPLEMENTED
- [x] ✅ **Multi-chain custodial wallet creation** - Bitcoin + Algorand address generation with encryption
- [x] ✅ **MoonPay Bitcoin integration** - Direct USD → Bitcoin purchase flow
- [x] ✅ **Portfolio NFT creation** - Algorand NFTs track Bitcoin + Algorand investment portfolios
- [x] ✅ **Multi-chain balance synchronization** - Real-time Bitcoin and Algorand tracking and database sync
- [ ] Chain Key self-custody opt-in for Bitcoin + Algorand - PHASE 2
- [ ] Web support for signup (Expo Router) - PHASE 1B

**Backend Implementation Status (COMPLETED)**:  
- ✅ **Real Supabase Integration**: Database operations, user creation, OTP storage
- ✅ **SMS OTP System**: Twilio integration with database verification (mock fallback for development)
- ✅ **Multi-Chain Custodial Wallet System**: Bitcoin + Algorand wallet generation with AES-256 encrypted private key storage
- ✅ **MoonPay Bitcoin Integration**: Direct USD → Bitcoin purchase flow with webhook handling and status tracking
- ✅ **Portfolio NFT System**: Algorand NFTs for tracking Bitcoin + Algorand investments with real-time performance updates
- ✅ **Multi-Chain Database Schema**: Tables for users, wallets (bitcoin/algorand), portfolio_nfts, position_nfts, investments

**Frontend Integration Needed**:
- Connect mobile app to multi-chain custodial wallet creation APIs
- Implement MoonPay Bitcoin purchase flow using updated endpoints
- Add Bitcoin + Algorand investment UI components with price tracking
- Display Portfolio NFT information and multi-chain performance tracking
- Add real-time multi-chain balance updates via `/api/v1/wallet/balance` endpoint

## 2. Data Model Overview (ERD)

The core of Cultivest's data architecture will revolve around managing user accounts, their custodial wallets, and financial transactions.

#### Key Entities:

1.  **`User`**: Represents an individual user of the Cultivest platform.
    *   **Attributes**: `userID` (Primary Key), `phoneNumber`, `name`, `country`, `email`, `currentBalanceBTC`, `currentBalanceALGO`, `totalPortfolioValue`, `kycStatus`, `custodyStatus` (custodial/self_custody), `supabaseAuthID` (linking to Supabase's authentication user).

2.  **`Wallet`**: Represents multi-chain custodial wallets managed by Cultivest on behalf of the user.
    *   **Attributes**: `walletID` (Primary Key), `userID` (Foreign Key to `User`), `blockchain` (bitcoin/algorand), `address` (public address), `encryptedPrivateKey` (securely encrypted private key), `isActive`, `custodyType` (custodial/self_custody).

3.  **`Transaction`**: Records all financial movements within the platform related to a user's account.
    *   **Attributes**: `transactionID` (Primary Key), `userID` (Foreign Key to `User`), `walletID` (Foreign Key to `Wallet`), `type` (deposit/investment/withdrawal/transfer), `blockchain`, `amount`, `fiatAmount`, `fiatCurrency`, `timestamp`, `status`, `txHash`, `externalTxID` (for MoonPay).

4.  **`PortfolioNFT`**: Tracks the master portfolio NFT on Algorand that represents the user's entire investment portfolio.
    *   **Attributes**: `portfolioID` (Primary Key), `userID` (Foreign Key to `User`), `nftAssetID` (Algorand NFT asset ID), `totalValue`, `totalInvested`, `unrealizedPnL`, `createdAt`, `metadata` (JSON with NFT metadata).

5.  **`PositionNFT`**: Tracks individual position NFTs for each cryptocurrency investment.
    *   **Attributes**: `positionID` (Primary Key), `portfolioID` (Foreign Key to `PortfolioNFT`), `userID` (Foreign Key to `User`), `nftAssetID` (Algorand NFT asset ID), `blockchain`, `cryptocurrency` (BTC/ALGO), `quantity`, `entryPrice`, `currentValue`, `unrealizedPnL`, `metadata` (JSON with position details).

5.  **`Badge`**: Defines the gamified achievement badges.
    *   **Attributes**: `badgeID` (Primary Key), `name`, `description`, `criteria`.

6.  **`UserBadge`**: A junction table to record which badges a user has earned.
    *   **Attributes**: `userID` (Foreign Key to `User`), `badgeID` (Foreign Key to `Badge`), `awardedAt`.

7.  **`EducationalContent`**: Stores information about the educational videos and quizzes.
    *   **Attributes**: `contentID` (Primary Key), `type` ('video' or 'quiz'), `title`, `url` (for video), `quizQuestions` (e.g., JSON array), `unlocksBadgeID` (Foreign Key to `Badge`, if applicable).

8.  **`UserQuizResult`**: Records a user's performance on quizzes.
    *   **Attributes**: `resultID` (Primary Key), `userID` (Foreign Key to `User`), `contentID` (Foreign Key to `EducationalContent`), `score`, `completedAt`.

#### Key Relationships:

*   **One-to-Many (`1:M`)**:
    *   `User` can have many `Wallet`s (though initially likely one custodial wallet per user for USDCa).
    *   `User` can have many `Transaction`s.
    *   `Wallet` can be involved in many `Transaction`s.
    *   `User` can have many `InvestmentPosition`s.
    *   `User` can have many `UserQuizResult`s.
    *   `EducationalContent` can have many `UserQuizResult`s.

*   **Many-to-Many (`M:M`)**:
    *   `User` and `Badge` have a Many-to-Many relationship, facilitated by the `UserBadge` junction table.

## 3. Fiat-to-Crypto Deposit
- [x] ✅ **MoonPay Bitcoin Integration** - Direct USD → Bitcoin purchase flow implemented
- [x] ✅ **Custodial Bitcoin + Algorand Wallets** - Secure multi-chain storage and management
- [ ] Deposit $1–$10 via Flutterwave (Nigeria: cards, mobile money) 
- [ ] "Bitcoin in vault" animation with Algorand NFT creation (mobile/web)
- [ ] Additional chain deposit support (Ethereum, Solana) - PHASE 2

**Backend Implementation Status (COMPLETED)**:  
- ✅ **MoonPay Bitcoin Service**: Direct Bitcoin purchase widget and webhook handling
- ✅ **Bitcoin Deposit Tracking**: Complete Bitcoin transaction lifecycle with status updates
- ✅ **Fee Calculation**: Transparent fee estimation for Bitcoin purchases
- ✅ **Custodial Bitcoin Storage**: Secure Bitcoin wallet generation and management
- ✅ **Database Integration**: Multi-chain deposits table with Bitcoin and Algorand tracking

**Available Endpoints**:
- `POST /api/v1/deposit/initiate` - Start Bitcoin purchase process, get MoonPay URL
- `GET /api/v1/deposit/status/{id}` - Real-time Bitcoin deposit tracking
- `POST /api/v1/deposit/webhook/moonpay` - MoonPay Bitcoin purchase completion handling
- `GET /api/v1/deposit/calculate-fees` - Bitcoin purchase fee estimation tool

**Frontend Integration Needed**:
- Implement MoonPay Bitcoin widget integration in React Native
- Add Bitcoin deposit status polling and progress tracking
- Connect to multi-chain balance updates after successful funding

## 4. Cryptocurrency Investment - 🔄 PHASE 1B IN PROGRESS
- [ ] 🎯 **PRIORITY**: Bitcoin investment UI with price tracking and portfolio display
- [ ] One-tap Bitcoin investment with clear price and fee disclosure
- [ ] Investment backend APIs (`/investment/initiate`, `/investment/positions`, `/investment/portfolio-nft`)
- [ ] Multi-chain investment UI components (Bitcoin + Algorand)
- [ ] **CRITICAL**: Display comprehensive risk disclosures:
  - Bitcoin price volatility risk
  - Custodial wallet risks and transition to self-custody option
  - No yield generation (price appreciation only)
  - Regulatory compliance disclosures
- [ ] "Bitcoin in portfolio" animation with portfolio NFT visualization (mobile/web)
- [ ] Web support for investment flow (Expo Router)

**Updated Implementation Notes**:  
- Bitcoin investment focuses on price appreciation rather than yield generation
- Custodial wallet system provides secure Bitcoin storage with professional custody
- Portfolio NFTs on Algorand track Bitcoin holdings and performance metrics
- Backend handles all Bitcoin transaction signing on behalf of users during custodial phase
- Future Chain Key integration will allow users to opt into self-custody
- Claude 4 API integration for personalized investment insights and portfolio analysis

## 5. Gamified Dashboard
- [ ] Display balance (USDC: $2.50, ALGO: $2.50), daily yield ($0.001), "money tree" representation
- [ ] **Updated badges**: "First Liquidity Provider!", "Risk Aware Investor", "DeFi Explorer"
- [ ] Push notifications for daily yield updates and rebalancing alerts (mobile only)
- [ ] Impermanent loss tracker and educational tooltips
- [ ] Web dashboard support (Expo Router, NativeWind)

**Implementation Notes**:  
- Built with React Native, NativeBase, and Lottie for "liquidity pool" animation
- Dashboard shows both USDC and ALGO balances with real-time USD values
- Impermanent loss calculation displayed prominently
- Firebase push notifications for yield updates and significant price movements
- Web dashboard reuses mobile components, optimized for Chrome with NativeWind CSS

## 6. Educational Components - **UPDATED FOR ACCURACY**
- [ ] 60-second video explaining liquidity pools, impermanent loss, and dual-asset investing
- [ ] 5-question quiz covering:
  - USDC/ALGO pool mechanics
  - Impermanent loss concept
  - APY variability (0.44% current rate)
  - Smart contract risks
  - GENIUS Act compliance (not applicable to Cultivest)
- [ ] Comprehensive tooltips for DeFi terminology
- [ ] Risk assessment questionnaire before first investment
- [ ] Web support for educational content (Expo Router)

**Implementation Notes**:  
- Educational content emphasizes realistic expectations (0.44% APY)
- Clear explanation of why dual-asset pools provide diversification
- Interactive calculators for impermanent loss scenarios
- Compliance-focused content explaining regulatory landscape

## 7. Withdrawal
- [ ] Withdraw liquidity position to fiat via MoonPay/Flutterwave (1% fee)
- [ ] **CRITICAL**: Handle potential impermanent loss in withdrawal calculations
- [ ] Auto-convert both USDC and ALGO to desired fiat currency
- [ ] "Liquidity withdrawn" animation (mobile/web)
- [ ] Transaction receipt via email showing final amounts after impermanent loss
- [ ] Web support for withdrawal flow (Expo Router)

**Implementation Notes**:  
- Withdrawal must handle dual-asset liquidity positions
- Calculate and display impermanent loss impact
- Option to withdraw as stablecoins (USDC) or convert both assets to fiat
- Clear disclosure of final amounts after fees and price impact

## 8. Privacy-First Design - **ENHANCED FOR DEFI**
- [ ] No wallet connection required for basic viewing
- [ ] Clear disclosure of MoonPay KYC permissions and liquidity pool risks
- [ ] No storage of sensitive data (encrypted private keys only)
- [ ] Read-only operations for Tinyman pool queries
- [ ] **NEW**: Transparent smart contract interaction disclosure

**Implementation Notes**:  
- Enhanced privacy policies covering DeFi protocol interactions
- Clear consent flow for smart contract interactions
- Audit trail for all Tinyman pool transactions
- Chainalysis integration for compliance monitoring

## 9. Mobile + Web Optimized UI - **DEFI-FOCUSED**
- [ ] Responsive design optimized for dual-asset displays
- [ ] Dark theme with DeFi-style charts and pool visualizations
- [ ] Touch-friendly controls for pool management (mobile); click-friendly (web)
- [ ] Fast loading states with liquidity pool animations

**Implementation Notes**:  
- UI redesigned to handle dual-asset complexity elegantly
- Pool visualization showing 50/50 ratio maintenance
- Real-time price charts for ALGO/USD and impermanent loss tracking
- Mobile-first design with web responsive layouts

## 10. Performance Optimization - **DEFI-ENHANCED**
- [ ] Efficient Algorand/Tinyman API queries for pool data
- [ ] Local caching of pool rates and user positions
- [ ] Progressive loading for dual-asset dashboard data
- [ ] **NEW**: Real-time impermanent loss calculations

**Implementation Notes**:  
- Optimized queries for Tinyman pool state and user LP positions
- Background sync for ALGO price updates affecting impermanent loss
- Efficient calculation of pool APY based on recent trading volume

## 11. Open-Source Infrastructure
- [ ] Well-documented codebase with DeFi integration examples
- [ ] Contribution guidelines for liquidity pool features
- [ ] MIT license
- [ ] Deployment instructions for Vercel/Heroku with Tinyman integration

## 12. Security Roadmap (Post-Hackathon) - **DEFI-ENHANCED**

**12.1. Key Storage & Management**
- [ ] Implement strong encryption (e.g., AES-256) for all private keys
- [ ] **NEW**: Secure smart contract interaction signing
- [ ] Hardware Security Module (HSM) integration for production
- [ ] Multi-signature wallet support for larger positions

**12.2. Smart Contract Security**
- [ ] **NEW**: Tinyman protocol audit verification
- [ ] **NEW**: Slippage protection mechanisms
- [ ] **NEW**: Maximum position size limits for risk management
- [ ] **NEW**: Emergency pause functionality for pool interactions

**12.3. Operational Security**
- [ ] Regular security audits including DeFi protocol interactions
- [ ] Robust logging and monitoring for pool transactions
- [ ] Hot/Warm/Cold wallet strategy adapted for LP positions
- [ ] **NEW**: Impermanent loss monitoring and alerts

## Implementation Notes

### Backend Architecture (Vercel & Supabase) ✅ IMPLEMENTED
- **Vercel**: ✅ Node.js/Express API backend with MoonPay, Algorand SDK, custodial wallet management
- **Supabase**: ✅ PostgreSQL database with complete schema and Row Level Security
- **NEW**: Tinyman SDK integration for liquidity pool operations

### Frontend Architecture (Netlify & Expo Router)
- **Netlify**: Web frontend with DeFi-optimized UI components
- **Expo Router**: 90% code sharing between mobile and web platforms
- **NEW**: Dual-asset balance displays and pool management interfaces

### Server-Side API Endpoints

#### 1. User Management & Authentication ✅ IMPLEMENTED
- **`POST /auth/signup`**: ✅ Real phone-based registration
- **`POST /auth/verify-otp`**: ✅ Database OTP verification
- **`POST /auth/login`**: ✅ Phone and OTP login
- **`POST /user/kyc`**: MoonPay KYC-light integration
- **`GET /user/profile`**: User profile with risk tolerance settings

#### 2. Wallet Management (Custodial) ✅ IMPLEMENTED
- **`POST /wallet/create`**: ✅ Custodial Algorand wallets with AES-256 encryption
- **`GET /wallet/balance`**: ✅ Live USDC/ALGO balances with pool position data

#### 3. Fiat-to-Crypto Deposit ✅ IMPLEMENTED
- **`POST /deposit/initiate`**: ✅ MoonPay integration with dual-asset preparation
- **`GET /deposit/status/{id}`**: ✅ Real-time deposit tracking
- **`POST /deposit/webhook/moonpay`**: ✅ MoonPay webhook handler
- **`GET /deposit/calculate-fees`**: ✅ Transparent fee calculation

#### 4. Liquidity Pool Investment - **NEW**
- **`POST /investment/initiate`**: Invest in Tinyman USDC/ALGO pool with auto-rebalancing
- **`GET /investment/positions`**: Retrieve user's LP positions with impermanent loss data
- **`POST /investment/rebalance`**: Maintain 50/50 USDC/ALGO ratio
- **`GET /investment/pools`**: Available pools with current APY and liquidity data
- **`POST /investment/withdraw`**: Withdraw from liquidity pool with IL calculation

#### 5. Gamified Dashboard - **UPDATED**
- **`GET /dashboard/data`**: Dual-asset dashboard with pool performance
- **`POST /badge/award`**: Award DeFi-specific badges

#### 6. Educational Components - **ENHANCED**
- **`GET /education/content`**: DeFi-focused educational content
- **`POST /education/quiz/submit`**: Updated quiz covering liquidity pools and IL
- **`GET /education/risk-assessment`**: Risk tolerance questionnaire

#### 7. Withdrawal - **ENHANCED**
- **`POST /withdrawal/initiate`**: Withdraw LP position with IL calculations
- **`POST /withdrawal/convert-to-fiat`**: Convert dual assets to fiat

### Competitive Landscape Analysis - **UPDATED**

Based on market research, Cultivest has identified a unique positioning in the micro-DeFi investment space:

**Direct Competitors**: Currently NONE - No major platform offers micro-DeFi liquidity pool investments with educational focus.

**Adjacent Competitors**:
- **Traditional Micro-Investment**: Acorns (36M users), Robinhood (24M users), Stash - all focus on stocks/ETFs
- **Crypto Platforms**: Coinbase, Robinhood Crypto - complex UI, no DeFi/yield focus, high fees
- **DeFi Platforms**: Exponential.fi, Giddy - target institutions/whales, require technical knowledge

**Cultivest's Competitive Advantages**:
1. **First micro-DeFi platform** - Unique market position
2. **Educational-first approach** - Explains liquidity pools vs assuming expertise
3. **Honest yield disclosure** - 0.44% actual vs inflated promises elsewhere
4. **Regulatory compliance** - GENIUS Act awareness, proper disclosures
5. **Mobile-first UX** - Built for mainstream adoption vs crypto natives

### Legal Compliance Status

**GENIUS Act Analysis**: ✅ **DOES NOT APPLY** to Cultivest
- GENIUS Act regulates stablecoin **issuers** (Circle, Tether), not investment platforms
- Cultivest classified as investment platform like Robinhood, Acorns, Betterment
- Uses existing USDC, doesn't issue new stablecoins
- Benefits from well-regulated stablecoin market without additional compliance burden

**Required Compliance**:
- Money Transmitter Licenses (state-by-state)
- Investment Advisor Registration (if providing advice)
- AML/KYC compliance via integrated partners
- Standard fintech compliance (not crypto-specific)

### Acceptance Criteria - **UPDATED FOR BITCOIN + ALGORAND**

**Onboarding**:
- 90% of test users complete phone signup and understand Bitcoin/Algorand investing within 3 minutes
- Users successfully create custodial wallets for both Bitcoin and Algorand

**Deposit & Investment**:
- Test users successfully deposit $5 via MoonPay and receive Bitcoin in custodial wallet
- Users can also invest directly in Algorand through their Algorand wallet
- Portfolio NFT correctly minted on Algorand with investment metadata

**Multi-Chain Investment**:
- Users invest in Bitcoin and/or Algorand and understand price volatility risks
- Dashboard accurately shows Bitcoin and Algorand balances with real-time USD values
- Portfolio NFT updates with current investment values and performance

**Education**:
- 90% of users complete crypto education covering Bitcoin, Algorand, and custody options
- Users demonstrate understanding of price volatility and custodial vs self-custody models

**Portfolio NFT System**:
- Portfolio NFTs correctly track all user investments across Bitcoin and Algorand
- Position NFTs created for each individual cryptocurrency holding
- NFT metadata accurately reflects current portfolio value and performance

**Withdrawal**:
- Users successfully withdraw Bitcoin and Algorand investments
- Clear disclosure of current values and any fees
- Portfolio NFTs updated to reflect withdrawals
