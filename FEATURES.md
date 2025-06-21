# Cultivest - Detailed Features

This document outlines the technical features for Cultivest, a mobile-first micro-investment platform with minimal web support for stablecoin yields (2–3% APY) on Algorand's USDCa. It tracks implementation status and planned features for the World's Largest Hackathon by Bolt.new (June 19–July 1, 2025).

## 🚀 **Backend Implementation Status - MAJOR PROGRESS**

### ✅ **COMPLETED CORE INFRASTRUCTURE:**
- **Real User Authentication**: Phone-based signup with SMS OTP via Twilio + Supabase database
- **Custodial Wallet System**: Algorand wallet generation with AES-256 encrypted private key storage
- **MoonPay Integration**: Complete ALGO → USDCa funding flow with webhook handling
- **Live Balance Tracking**: Real-time on-chain balance queries with database synchronization
- **Database Architecture**: Full PostgreSQL schema with Row Level Security policies

### 🎯 **READY FOR FRONTEND INTEGRATION:**
All backend endpoints are implemented and tested. Frontend needs to connect to:
- `/api/v1/auth/signup` & `/api/v1/auth/verify-otp` for user onboarding
- `/api/v1/deposit/initiate` for MoonPay funding flow
- `/api/v1/wallet/balance` for real-time balance updates
- `/api/v1/wallet/create` for custodial wallet generation

**Backend transforms Cultivest from mock implementation to production-ready fintech platform!** 🏆

## 1. User Onboarding
- [x] ✅ **Phone-based signup with OTP verification** - IMPLEMENTED
- [x] ✅ **MoonPay funding integration** - COMPLETE ALGO → USDCa conversion flow
- [x] ✅ **Custodial wallet creation** - Real Algorand wallet generation with encryption
- [ ] Web support for signup (Expo Router)

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
    *   **Attributes**: `userID` (Primary Key), `phoneNumber`, `name`, `country`, `email`, `currentBalanceUSDCa`, `dailyYieldAccumulated`, `moneyTreeLeaves`, `kycStatus`, `supabaseAuthID` (linking to Supabase's authentication user).

2.  **`Wallet`**: Represents the custodial Algorand wallet managed by Cultivest on behalf of the user. This is where user funds (USDCa) are held.
    *   **Attributes**: `walletID` (Primary Key), `userID` (Foreign Key to `User`), `algorandAddress` (the public address), `encryptedPrivateKey` (the **securely encrypted** private key for this custodial wallet), `assetID` (e.g., for USDCa).

3.  **`Transaction`**: Records all financial movements within the platform related to a user's account.
    *   **Attributes**: `transactionID` (Primary Key), `userID` (Foreign Key to `User`), `walletID` (Foreign Key to `Wallet`), `type` (e.g., 'deposit', 'investment', 'withdrawal', 'yield_credit'), `amountUSDCa`, `fiatAmount`, `fiatCurrency`, `timestamp`, `status`, `algorandTxID`, `externalTxID` (for MoonPay/Flutterwave).

4.  **`InvestmentPosition`**: Tracks a user's current active investment in the Tinyman USDCa pool.
    *   **Attributes**: `positionID` (Primary Key), `userID` (Foreign Key to `User`), `poolID` (identifying the specific liquidity pool, e.g., Tinyman USDCa), `investedAmountUSDCa`, `startDate`, `currentAPY`, `totalYieldEarned`.

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

## 3. Fiat-to-USDCa Deposit
- [x] ✅ **MoonPay Integration** - Complete ALGO → USDCa conversion flow implemented
- [ ] Deposit $1–$10 via Flutterwave (Nigeria: cards, mobile money) 
- [ ] "Coins in vault" animation (mobile/web)

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

## 4. Yield Investment
- [ ] One-tap investment in Tinyman USDCa pool (2.5% APY)
- [ ] Display risk disclaimer (GENIUS Act, smart contract risks)
- [ ] "Funds growing" animation (mobile/web)
- [ ] Web support for investment flow (Expo Router)

**Implementation Notes**:  
- Algorand Web3.js integrates with Tinyman's audited USDCa pool for yield generation. Backend Node.js on Vercel will handle transaction signing and broadcasting for custodial wallets.
- Claude 4 API (mocked) suggests investment based on deposit amount.  
- Lottie animation shows coins flowing to vault.  
- Web flow reuses mobile components, with CSS tweaks for browser rendering.

## 5. Gamified Dashboard
- [ ] Display balance ($5), daily yield ($0.003), "money tree" (5 leaves)
- [ ] "First Investor!" badge for first deposit
- [ ] Push notifications for daily yield updates (mobile only)
- [ ] Web dashboard support (Expo Router, NativeWind)

**Implementation Notes**:  
- Built with React Native, NativeBase, and Lottie for "money tree" animation (grows with balance).  
- Firebase push notifications for mobile (e.g., "$0.003 earned today!"). (Note: if backend sends notifications, it will be via Vercel backend interacting with Firebase FCM).
- Web dashboard (`app/index.tsx`) reuses mobile components, optimized for Chrome with NativeWind CSS, hosted on Netlify.  
- MongoDB stores balance/yield data, updated via Tinyman API, managed by Vercel backend.

## 6. Educational Components
- [ ] 30-second video on USDCa and GENIUS Act safety
- [ ] 3-question quiz unlocking "Safe Saver" badge
- [ ] Tooltips for stablecoin/yield terms
- [ ] Web support for video/quiz (Expo Router)

**Implementation Notes**:  
- Static HTML video hosted on Vercel, embedded in React Native/WebView.  
- Quiz uses NativeBase forms, stores results in Supabase (PostgreSQL) via Vercel backend.
- Tooltips via NativeBase Popover component, explaining terms (e.g., "USDCa: dollar-backed stablecoin").  
- Web reuses mobile video/quiz with CSS for browser compatibility, hosted on Netlify.

## 7. Withdrawal
- [ ] Withdraw $1–$10 to bank via MoonPay/Flutterwave (1% fee)
- [ ] "Funds sent" animation (mobile/web)
- [ ] Transaction receipt via email (mobile/web)
- [ ] Web support for withdrawal flow (Expo Router)

**Implementation Notes**:  
- MoonPay/Flutterwave APIs convert USDCa to fiat, transfer to bank. Vercel backend orchestrates these API calls and transaction signing.
- Lottie animation shows coins exiting vault.  
- Firebase sends email receipt with transaction ID. (Note: Vercel backend will interact with Firebase or another email service).
- Web flow reuses mobile components (`app/withdraw.tsx`), styled with NativeWind, hosted on Netlify.

## 8. Privacy-First Design
- [ ] No wallet connection required for basic viewing
- [ ] Clear disclosure of MoonPay KYC permissions
- [ ] No storage of sensitive data (e.g., private keys)
- [ ] Read-only operations for Tinyman queries

**Implementation Notes**:  
- Custodial wallet simplifies user experience; clear disclosure on data handling.  
- MoonPay KYC data not stored locally; Supabase handles auth securely, and sensitive wallet keys are encrypted and managed by the Vercel backend with a dedicated key management strategy.
- Tinyman API queries are read-only, logged via Chainalysis for AML compliance.  
- Web/mobile share privacy settings, displayed via NativeBase modal.

## 9. Mobile + Web Optimized UI
- [ ] Responsive design (mobile: iOS/Android; web: Chrome)
- [ ] Dark theme for readability
- [ ] Touch-friendly controls (mobile); click-friendly (web)
- [ ] Fast loading states with feedback animations

**Implementation Notes**:  
- Expo Router ensures 90% code sharing between mobile and web (`app/*.tsx`).  
- NativeBase supports dark theme, toggled via user settings.  
- Lottie animations provide loading feedback (e.g., spinning coins).  
- Web uses NativeWind CSS for responsive layouts, tested on low-end browsers for Nigeria, hosted on Netlify.

## 10. Performance Optimization
- [ ] Efficient Algorand/Tinyman API queries
- [ ] Local caching of recent deposits/yields
- [ ] Progressive loading for dashboard data
- [ ] Offline OTP for Nigeria's low-data users

**Implementation Notes**:  
- Algorand Web3.js optimizes queries ($0.001/tx), caching via MongoDB (managed by Vercel backend).  
- Progressive loading for "money tree" data, reducing load time to <2s.  
- Supabase OTP supports offline verification, critical for Nigeria (50MB/month data).  
- Web caching mirrors mobile, using browser local storage.

## 11. Open-Source Infrastructure
- [ ] Well-documented codebase
- [ ] Contribution guidelines
- [ ] MIT license
- [ ] Deployment instructions for Vercel/Heroku

**Implementation Notes**:  
- Codebase documented with JSDoc, hosted on GitHub.  
- Contribution guidelines include setup and PR process.  
- MIT license ensures open-source accessibility.  
- Vercel (backend API) and Netlify (web frontend) deployment guides provided. Heroku is an alternative backend deployment option.

## 12. Security Roadmap (Post-Hackathon)

Given the custodial wallet approach, robust security for private key storage is paramount for a production environment. The Vercel-hosted backend will be responsible for implementing these measures.

**12.1. Key Storage & Management**
- [ ] Implement strong encryption (e.g., AES-256) for all private keys stored in the database.
- [ ] Ensure unique encryption keys per user/wallet, derived from a secure, salted KDF.
- [ ] Implement secure key management: master encryption keys will be stored separately from encrypted wallet data, ideally in a Hardware Security Module (HSM) or a Cloud Key Management Service (KMS) like AWS KMS, Google Cloud KMS, or Azure Key Vault, accessed securely by the Vercel backend.
- [ ] Restrict access to encryption keys and encrypted data with strict access controls and multi-factor authentication (MFA).
- [ ] Enforce least privilege principles for all system access.

**12.2. Operational Security**
- [ ] Conduct regular security audits and penetration testing by third-party experts.
- [ ] Implement robust logging and monitoring for all key access and transaction signing operations on the Vercel backend.
- [ ] Adopt a Hot/Warm/Cold wallet strategy to minimize online exposure of user funds.
    -   Hot Wallet: Minimal funds for immediate transactions.
    -   Warm Wallet: Moderate funds requiring multi-signature or time-locked access.
    -   Cold Wallet: Majority of user funds stored offline, requiring manual or highly secure multi-party approval for large withdrawals.
- [ ] Implement automated alerts for suspicious activity or unauthorized access attempts.

## Implementation Notes

### Backend Architecture (Vercel & Supabase) ✅ IMPLEMENTED
- **Vercel**: ✅ Node.js/Express API backend deployed with real implementations for MoonPay, Algorand SDK, custodial wallet management, SMS OTP, and database operations.
- **Supabase**: ✅ PostgreSQL database with complete schema (users, wallets, otp_sessions, badges, deposits) and Row Level Security policies configured.

### Frontend Architecture (Netlify & Expo Router)
- **Netlify**: Will host the Cultivest web frontend, built with React Native for Web via Expo Router.
- **Expo Router**: Enables 90% code sharing between mobile (iOS/Android) and web, simplifying development for both platforms.

### Server-Side API Endpoints

This section outlines the primary API endpoints and their functionalities that will be implemented on the Vercel-hosted Node.js backend.

#### 1. User Management & Authentication ✅ IMPLEMENTED
- **`POST /auth/signup`**: ✅ Real phone-based registration with Supabase + Twilio SMS OTP.
- **`POST /auth/verify-otp`**: ✅ Database OTP verification with JWT token generation.
- **`POST /auth/login`**: ✅ Phone and OTP login with proper authentication.
- **`POST /user/kyc`**: Processes MoonPay KYC-light integration; updates user KYC status.
- **`GET /user/profile`**: Retrieves basic user profile data.

#### 2. Wallet Management (Custodial) ✅ IMPLEMENTED
- **`POST /wallet/create`**: ✅ Creates and securely stores custodial Algorand wallets with AES-256 encryption.
- **`GET /wallet/balance`**: ✅ Fetches live USDCa/ALGO balances with on-chain sync capability.

#### 3. Fiat-to-USDCa Deposit ✅ IMPLEMENTED
- **`POST /deposit/initiate`**: ✅ Complete MoonPay integration with ALGO → USDCa conversion flow.
- **`GET /deposit/status/{id}`**: ✅ Real-time deposit tracking with progress updates.
- **`POST /deposit/webhook/moonpay`**: ✅ MoonPay webhook handler with signature verification.
- **`GET /deposit/calculate-fees`**: ✅ Transparent fee calculation and USDCa estimation.

#### 4. Yield Investment
- **`POST /investment/initiate`**: Allows a user to invest USDCa into the Tinyman pool. Handles transaction signing and broadcasting.
- **`GET /investment/positions`**: Retrieves a user's active investment positions.
- **Background Job / Cron Job (Daily/Hourly)**: Calculates and credits daily yield; updates user balances and records transactions.

#### 5. Gamified Dashboard
- **`GET /dashboard/data`**: Provides aggregated data for the user dashboard (balance, yield, money tree status, badges).
- **`POST /badge/award`**: (Internal/Automated) Awards a badge to a user upon meeting criteria.

#### 6. Educational Components
- **`GET /education/content`**: Retrieves educational video/quiz details.
- **`POST /education/quiz/submit`**: Submits user quiz results; awards badges if criteria met.

#### 7. Withdrawal
- **`POST /withdrawal/initiate`**: Initiates a withdrawal of USDCa to fiat; transfers USDCa to treasury wallet.
- **`POST /withdrawal/process_fiat`**: (Internal/Automated) Processes fiat payout via MoonPay/Flutterwave after USDCa is received.
- **`POST /withdrawal/webhook`**: (Webhook Endpoint) Receives fiat payout status updates; updates transaction status.
- **`POST /transaction/receipt/send`**: Sends transaction receipts via email.

#### 8. Notifications
- **`POST /notifications/send_daily_yield`**: (Internal/Automated) Sends daily yield push notifications via Firebase Cloud Messaging.

#### 9. AI Integration
- **`POST /ai/roundup_suggestion`**: Gets round-up investment suggestions from Claude 4 API.

### Claude 4 Round-Up Suggestions
- Mocked Claude 4 API analyzes spending patterns (e.g., $3.50 coffee → $0.50 round-up).  
- Returns JSON: `{ amount: 0.50, suggestedInvestment: "Tinyman USDCa 2.5% APY" }`.  
- Integrated via Node.js API on the Vercel backend, displayed in deposit flow with NativeBase modal.  
- Web/mobile share logic, with web using CSS for modal styling.

### Money Tree Animation
- Lottie animation (`money-tree.json`) grows leaves based on balance ($1 = 1 leaf).  
- Built with React Native's LottieView, reused on web via Expo Router.  
- Triggers on deposit/investment/withdrawal, with NativeWind CSS for web scaling.  
- Tested for <1s load time on low-end Androids (Nigeria).

### Web Support via Expo Router
- Expo Router (SDK 50) enables web dashboard (`app/index.tsx`) with 90% code reuse.  
- NativeWind CSS ensures responsive design for Chrome, including low-end browsers.  
- Web demo shows balance, yield, "money tree," reusing mobile animations.  
- Deployed on Netlify with `expo start --web`, tested for <2s load.

### Acceptance Criteria

Here are the expected scenarios that, when successfully demonstrated, indicate the feature meets its acceptance criteria:

-   **Onboarding**:
    *   **Scenario 1 (Mobile)**: A user in the US successfully completes phone signup and MoonPay KYC-light on an iOS/Android emulator within 2 minutes.
    *   **Scenario 2 (Web)**: A user in Nigeria successfully completes phone signup and MoonPay KYC-light on a Chrome browser (hosted on Netlify) within 2 minutes.
    *   **Verification**: 90% of 10 test users (5 U.S., 5 Nigeria) successfully complete their respective onboarding flows.

-   **Deposit**:
    *   **Scenario**: A user successfully deposits $5 (fiat) via Flutterwave (Nigeria) or MoonPay (US) and the corresponding USDCa appears in their Cultivest wallet, verified on the Algorand explorer.
    *   **Verification**: 10 test deposits ($5 each) are confirmed to convert to USDCa and reflect correctly in the user's custodial wallet.

-   **Yield Investment**:
    *   **Scenario**: A user invests $5 of USDCa, which is successfully locked into the Tinyman 2.5% APY pool, and this investment is verifiable on the Algorand testnet.
    *   **Verification**: 10 investments ($5 each) are verified to be locked in the Tinyman pool on the testnet.

-   **Dashboard**:
    *   **Scenario**: A user logs into the mobile or web dashboard and accurately views their current balance ($5), daily yield ($0.003), and observes the "money tree" animation with 5 leaves, along with the "First Investor!" badge.
    *   **Verification**: 90% of 10 test users (mobile/web) confirm the dashboard UX is intuitive and data is accurate via an X (Twitter) poll.

-   **Education**:
    *   **Scenario**: A user watches the 30-second video on USDCa/GENIUS Act safety and successfully completes the 3-question quiz, unlocking the "Safe Saver" badge.
    *   **Verification**: 90% of 10 test users complete the video and quiz, rating the content as clear via an X (Twitter) poll.

-   **Withdrawal**:
    *   **Scenario**: A user initiates a $2 withdrawal from their USDCa balance to their bank account via MoonPay/Flutterwave, and the funds are successfully received, confirmed by API logs.
    *   **Verification**: 10 test withdrawals ($2 each) complete successfully via MoonPay/Flutterwave, confirmed by backend API logs.

### Findings
- https://medium.com/@drichar/using-algosdk-v3-and-algokit-utils-in-react-native-3160c79ad7fc for Algorand SDK React Native support
- https://developer.algorand.org/solutions/building-mobile-apps-using-react-native-algo-library/ Building Mobile Apps Using React-Native-Algo Library
