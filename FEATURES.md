# Cultivest - Detailed Features

This document outlines the technical features for Cultivest, a mobile-first micro-investment platform with minimal web support for stablecoin yields (2–3% APY) on Algorand's USDCa. It tracks implementation status and planned features for the World's Largest Hackathon by Bolt.new (June 19–July 1, 2025).

## 1. User Onboarding
- [ ] Phone-based signup with OTP verification
- [ ] MoonPay KYC-light integration (name, country, <2 min)
- [ ] Custodial wallet creation
- [ ] Web support for signup (Expo Router)

**Implementation Notes**:  
- Uses Expo Router's file-based routing (`app/onboarding.tsx`) for mobile (iOS/Android) and web.  
- MoonPay SDK handles KYC-light (phone, name, country, no ID for <$1,000/year), compliant with GENIUS Act ([Web:17](https://www.businessinsider.com)).  
- Supabase auth stores OTP, handles user authentication. Custom Node.js backend on Vercel will handle custodial wallet creation and management.
- Web signup reuses mobile components with NativeWind CSS for styling, hosted on Netlify.

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
- [ ] Deposit $1–$10 via Flutterwave (Nigeria: cards, mobile money)
- [ ] Deposit $1–$10 via MoonPay (global: cards, ACH)
- [ ] Conversion to USDCa on Algorand (0.5% fee)
- [ ] "Coins in vault" animation (mobile/web)

**Implementation Notes**:  
- Flutterwave API for Nigeria, MoonPay for global fiat-to-USDCa conversion.  
- Algorand Web3.js handles USDCa transfer to user wallet ($0.001/tx). Backend Node.js on Vercel will orchestrate these transactions.
- Lottie animation (`money-tree.json`) shows coins dropping into vault.  
- Web deposit flow mirrors mobile, using Expo Router (`app/deposit.tsx`) and NativeWind.

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

### Backend Architecture (Vercel & Supabase)
- **Vercel**: Will host the custom Node.js/Express API backend, responsible for all complex logic, external API integrations (MoonPay, Flutterwave, Algorand), private key management (encryption/decryption), and backend-driven features like yield calculations and notifications. Deployed as serverless functions.
- **Supabase**: Will provide user authentication (OTP), and serve as the managed PostgreSQL database for storing all application data (User, Wallet, Transaction, InvestmentPosition, Badge, etc.).

### Frontend Architecture (Netlify & Expo Router)
- **Netlify**: Will host the Cultivest web frontend, built with React Native for Web via Expo Router.
- **Expo Router**: Enables 90% code sharing between mobile (iOS/Android) and web, simplifying development for both platforms.

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
- **Onboarding**: 90% of 10 users (5 U.S./5 Nigeria) complete phone signup and KYC-light in <2 min (mobile: emulators; web: Chrome).  
- **Deposit**: 10 test deposits ($5 each) convert to USDCa, confirmed via Algorand explorer.  
- **Yield Investment**: 10 investments ($5) lock in Tinyman 2.5% APY pool, verified on testnet.  
- **Dashboard**: 90% of 10 users confirm intuitive UX (mobile/web) via X poll.  
- **Education**: 90% of 10 users rate video/quiz clear (X poll).  
- **Withdrawal**: 10 withdrawals ($2) complete via MoonPay/Flutterwave, confirmed by API logs.


### Findings
- https://medium.com/@drichar/using-algosdk-v3-and-algokit-utils-in-react-native-3160c79ad7fc for Algorand SDK React Native support
- https://developer.algorand.org/solutions/building-mobile-apps-using-react-native-algo-library/ Building Mobile Apps Using React-Native-Algo Library
