# Cultivest - Detailed Features

This document outlines the technical features for Cultivest, a mobile-first micro-investment platform providing access to Algorand DeFi liquidity pools. Users invest small amounts ($1-$10) in USDC/ALGO pools on Tinyman DEX, earning 0.44% APY from trading fees while getting diversified exposure to both stablecoins and crypto.

## 🚀 **Implementation Status - PHASE 1A COMPLETED** ✅

### ✅ **PHASE 1A: TESTNET FOUNDATION (DECEMBER 2024) - COMPLETED:**
- **Real User Authentication**: Phone-based signup with SMS OTP via Twilio + Supabase database
- **Custodial Wallet System**: Algorand wallet generation with AES-256 encrypted private key storage
- **MoonPay SDK Integration**: React Native SDK with proper browserOpener pattern
- **🎯 Testnet Funding Workaround**: Complete faucet-based funding for development
  - **TestnetFundingModal**: 3-step guided funding process (ALGO → Opt-in → USDCa)
  - **Circle USDCa Faucet**: Official Circle testnet faucet integration
  - **Algorand Dispenser**: ALGO testnet faucet with copy-paste workflow
  - **USDCa Opt-in Automation**: `/debug/opt-in-usdca` endpoint with frontend integration
  - **Smart Balance Detection**: Real-time opt-in status and balance monitoring
  - **Auto-refresh**: 30-second balance updates + manual refresh buttons
- **Enhanced Balance API**: `/wallet/balance` with `isOptedIntoUSDCa` field
- **Database Architecture**: Full PostgreSQL schema with Row Level Security policies

### 🎯 **PRODUCTION-READY COMPONENTS:**
**Testnet Development Infrastructure:**
- Complete testnet funding flow solving MoonPay testnet limitations
- User-friendly crypto onboarding with educational guidance
- Real wallet creation, opt-in, and token acquisition
- Ready for investment feature development

**Backend transforms Cultivest from mock to production-ready fintech platform!** 🏆

## 1. User Onboarding - ✅ PHASE 1A COMPLETED
- [x] ✅ **Phone-based signup with OTP verification** - IMPLEMENTED
- [x] ✅ **Testnet funding integration** - Complete faucet-based workaround for development
- [x] ✅ **MoonPay SDK integration** - React Native SDK with sandbox mode
- [x] ✅ **Custodial wallet creation** - Real Algorand wallet generation with encryption
- [x] ✅ **TestnetFundingModal** - User-friendly 3-step funding process
- [x] ✅ **USDCa opt-in automation** - Backend + frontend integration
- [ ] Web support for signup (Expo Router) - PHASE 1B

**Backend Implementation Status (COMPLETED)**:  
- ✅ **Real Supabase Integration**: Database operations, user creation, OTP storage
- ✅ **SMS OTP System**: Twilio integration with database verification (mock fallback for development)
- ✅ **Custodial Wallet Creation**: Algorand SDK with AES-256 encrypted private key storage
- ✅ **MoonPay Integration**: Complete funding flow with webhook handling and status tracking
- ✅ **Database Schema**: All tables created (users, wallets, otp_sessions, badges, deposits)

**Frontend Integration Needed**:
- Connect mobile app to `/api/v1/auth/signup` and `/api/v1/auth/verify-otp` endpoints
- Implement MoonPay funding flow using `/api/v1/deposit/initiate` endpoint
- Add real-time balance updates via `/api/v1/wallet/balance` endpoint

## 2. Data Model Overview (ERD)

The core of Cultivest's data architecture will revolve around managing user accounts, their custodial wallets, and financial transactions.

#### Key Entities:

1.  **`User`**: Represents an individual user of the Cultivest platform.
    *   **Attributes**: `userID` (Primary Key), `phoneNumber`, `name`, `country`, `email`, `currentBalanceUSDCa`, `currentBalanceALGO`, `dailyYieldAccumulated`, `moneyTreeLeaves`, `kycStatus`, `supabaseAuthID` (linking to Supabase's authentication user).

2.  **`Wallet`**: Represents the custodial Algorand wallet managed by Cultivest on behalf of the user. This is where user funds (USDCa and ALGO) are held.
    *   **Attributes**: `walletID` (Primary Key), `userID` (Foreign Key to `User`), `algorandAddress` (the public address), `encryptedPrivateKey` (the **securely encrypted** private key for this custodial wallet), `assetID` (e.g., for USDCa).

3.  **`Transaction`**: Records all financial movements within the platform related to a user's account.
    *   **Attributes**: `transactionID` (Primary Key), `userID` (Foreign Key to `User`), `walletID` (Foreign Key to `Wallet`), `type` (e.g., 'deposit', 'investment', 'withdrawal', 'yield_credit', 'rebalance'), `amountUSDCa`, `amountALGO`, `fiatAmount`, `fiatCurrency`, `timestamp`, `status`, `algorandTxID`, `externalTxID` (for MoonPay/Flutterwave).

4.  **`InvestmentPosition`**: Tracks a user's current active investment in the Tinyman USDC/ALGO liquidity pool.
    *   **Attributes**: `positionID` (Primary Key), `userID` (Foreign Key to `User`), `poolID` (identifying the specific liquidity pool, e.g., Tinyman USDC/ALGO), `investedAmountUSDC`, `investedAmountALGO`, `lpTokensReceived`, `startDate`, `currentAPY`, `totalYieldEarned`, `impermanentLoss`.

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
- [x] ✅ **MoonPay Integration** - Complete ALGO → USDCa conversion flow implemented
- [ ] Deposit $1–$10 via Flutterwave (Nigeria: cards, mobile money) 
- [ ] "Coins in vault" animation (mobile/web)
- [ ] **CRITICAL**: Auto-rebalancing to maintain 50/50 USDC/ALGO ratio for Tinyman pools

**Backend Implementation Status (COMPLETED)**:  
- ✅ **MoonPay Service**: Widget URL generation, webhook handling, signature verification
- ✅ **Deposit Tracking**: Complete transaction lifecycle with status updates
- ✅ **Fee Calculation**: Transparent fee estimation (MoonPay + DEX conversion fees)
- ✅ **ALGO → USDCa Strategy**: Innovative funding approach for stablecoin compliance
- ✅ **Database Integration**: Deposits table with full transaction tracking

**Available Endpoints**:
- `POST /api/v1/deposit/initiate` - Start funding process, get MoonPay URL
- `GET /api/v1/deposit/status/{id}` - Real-time deposit tracking
- `POST /api/v1/deposit/webhook/moonpay` - MoonPay completion handling
- `GET /api/v1/deposit/calculate-fees` - Fee estimation tool

**Frontend Integration Needed**:
- Implement MoonPay widget integration in React Native
- Add deposit status polling and progress tracking
- Connect to balance updates after successful funding

## 4. Liquidity Pool Investment - 🔄 PHASE 1B IN PROGRESS
- [ ] 🎯 **PRIORITY**: Implement Tinyman USDC/ALGO pool integration (50/50 split required)
- [ ] One-tap investment with automatic rebalancing to maintain 50/50 USDC/ALGO ratio
- [ ] Investment backend APIs (`/investment/initiate`, `/investment/positions`, `/investment/rebalance`)
- [ ] Investment UI components with dual-asset display
- [ ] **CRITICAL**: Display comprehensive risk disclosures:
  - Impermanent loss risk from ALGO price volatility
  - Smart contract risks from Tinyman protocol
  - APY variability (currently 0.44%, may fluctuate)
  - GENIUS Act compliance (not applicable to investment platforms)
- [ ] "Liquidity providing" animation showing both USDC and ALGO (mobile/web)
- [ ] Web support for investment flow (Expo Router)

**Updated Implementation Notes**:  
- Tinyman requires 50% USDC + 50% ALGO for liquidity provision
- Current APY: 0.44% (significantly lower than traditional projections)
- Must handle impermanent loss calculations and user education
- Backend will auto-rebalance user holdings to maintain 50/50 ratio
- Claude 4 API integration for personalized risk assessment based on user profile

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

### Acceptance Criteria - **UPDATED FOR DEFI**

**Onboarding**:
- 90% of test users complete phone signup and understand dual-asset investing within 3 minutes

**Deposit & Pool Entry**:
- Test users successfully deposit $5 and see it auto-rebalanced to $2.50 USDC + $2.50 ALGO equivalent
- LP tokens correctly issued and tracked on Algorand testnet

**Liquidity Pool Investment**:
- Users invest in Tinyman pool and understand impermanent loss concept
- Dashboard accurately shows pool performance and IL calculations

**Education**:
- 90% of users complete DeFi education and pass liquidity pool quiz
- Users demonstrate understanding of 0.44% APY and associated risks

**Withdrawal**:
- Users successfully withdraw LP positions with clear IL impact disclosure
- Final amounts match backend calculations after fees and price impact
