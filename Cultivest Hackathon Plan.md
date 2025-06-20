# Cultivest: Micro-Investment App for Stablecoin Yields

## Problem
Retail users (Gen Z, millennials, unbanked in Nigeria/Argentina) lack simple, low-risk ways to grow small savings ($1–$10). Savings accounts yield 1–2% APY (U.S.) or lose value in high-inflation regions (50% in Argentina). DeFi offers 2–5% APY on stablecoins, but platforms like Aave are complex. The GENIUS Act ensures stablecoin transparency ([Web:17](https://www.businessinsider.com)), yet no mobile-first, beginner-friendly app exists for micro-investments.

## Solution
**Cultivest** is a mobile app enabling $1–$10 investments in USDCa yields (2–3% APY) on Algorand’s Tinyman DEX. Claude 4 suggests round-ups (e.g., $0.50 from $3.50 coffee), and Algorand ensures low-cost, near-instant transactions. MoonPay and Flutterwave simplify crypto onboarding by handling KYC-light and fiat-to-USDCa. Cultivest targets Gen Z (60% TikTok users), millennials, and unbanked (70% mobile penetration in Nigeria), beating Acorns' 1% APY.

## Judges' Appeal
- **Theo Browne**: React Native, Algorand, MoonPay APIs align with T3 Stack simplicity.
- **Jason Calacanis**: Disrupts savings with $246B stablecoin market ([Web:5](https://www.cnn.com)), per *All-In Podcast* ([YouTube: Ep. 188](https://www.youtube.com/watch?v=43Rd-y2xe84&t=2197s)).
- **Sarah Guo**: Scalable B2C SaaS, expandable to banks (B2B).
- **Alex Albert**: Claude 4's spending analysis and AML reporting shine ([Anthropic Claude 4](https://www.anthropic.com/news/claude-4)).
- **Brian Whippo**: Algorand's low-cost USDCa fits hackathon challenge ([Web:12](https://www.reddit.com)).
- **Grace Ling**: "Money tree" UX wows with intuitive onboarding.

## Big "But"
- **Challenge**: GENIUS Act KYC/AML compliance and user trust (post-FTX, $600M DeFi hacks in 2024) may deter adoption. Nigeria's payment access (70% mobile) and DeFi complexity are hurdles.
- **Mitigation**: MoonPay KYC-light (name/phone, no ID for <$1,000), audited Tinyman yields, Flutterwave for Nigeria payments. Highlight GENIUS Act audits, offer Nexus Mutual insurance, and use low-data UI with offline OTP.

## Success Rate
- **Hackathon (92%)**: 5-minute demo (Aisha deposits $5, invests in 2.5% APY, sees "money tree") is visual, practical, and Algorand-aligned. Risks: MoonPay API delays (mitigated by pre-testing) or competition (outshone by micro-UX).
- **Market (80%)**: Taps $3.7T stablecoin growth by 2030 and Nigeria's 10% crypto adoption. Regulatory shifts or hacks could challenge trust, but gamified UX leads.

## Tech Stack (Bolt-Compatible)
- **Frontend**: React Native (iOS/Android), NativeBase for UI, Lottie for "money tree" animations.
- **Backend**: Node.js/Express for APIs, Firebase for auth/notifications, MongoDB for portfolios.
- **AI**: Claude 4 for round-up suggestions (mocked data), yield optimization, AML reports.
- **Blockchain**: Algorand for USDCa transactions ($0.001/tx), Tinyman for 2–3% APY.
- **Payments/KYC**: MoonPay for KYC-light and fiat-to-USDCa, Flutterwave for Nigeria.
- **Security**: Multi-signature wallets, AES-256 encryption, Chainalysis for AML.
- **Hosting**: Vercel (frontend), Heroku (backend), Algorand testnet for demo.

## MVP Features (12 Days)
1. **Onboarding**: Phone signup, MoonPay KYC-light (name, country, 2 min).
2. **Deposit**: $1–$10 via Flutterwave/MoonPay to USDCa (Algorand, 0.5% fee).
3. **Yield Investment**: 2.5% APY via Tinyman USDCa pool, one-tap.
4. **Dashboard**: "Money tree" grows with yields, shows balance, "$0.003 earned today."
5. **Education**: 30-second video on USDCa and GENIUS Act safety.
6. **Withdrawal**: USDCa to bank via MoonPay/Flutterwave (1% fee).

## Acceptance Criteria (Truth Source)
| Feature | Criteria | Verification |
|---------|----------|--------------|
| **Onboarding** | User signs up with phone (+234), verifies via OTP, enters name/country. MoonPay KYC-light completes in <2 min. | Test 10 users (5 U.S., 5 Nigeria) on Algorand testnet; 90% success rate. |
| **Deposit** | User deposits $1–$10 via Flutterwave/MoonPay, converts to USDCa (0.5% fee, $0.025 on $5). Shows "Coins in vault" animation. | 10 test deposits ($5 each), confirm USDCa in wallet via Algorand explorer. |
| **Yield Investment** | User invests $5 in Tinyman USDCa pool (2.5% APY) with one tap. Shows "Funds growing" animation. | Verify 10 investments on testnet; confirm funds locked in Tinyman contract. |
| **Dashboard** | Displays balance ($5), daily yield ($0.003), "money tree" with 5 leaves. Badge: "First Investor!" | 10 users view dashboard; 90% confirm intuitive UX via X feedback. |
| **Education** | 30-second video on USDCa/GENIUS Act plays, quiz unlocks "Safe Saver" badge. | 10 users complete video/quiz; 90% rate it clear (X poll). |
| **Withdrawal** | User withdraws $2 to bank via MoonPay/Flutterwave (1% fee, $0.02). Shows "Funds sent" animation. | 10 test withdrawals; confirm USDCa-to-fiat via MoonPay API logs. |

## 12-Day Timeline (June 19–July 1, 2025)
**Days 1–3: Setup (June 19–21)**  
- Wireframes (Figma: onboarding, dashboard).  
- Setup Algorand testnet, Firebase, Vercel/Heroku.  
- Integrate MoonPay SDK (KYC + fiat-to-USDCa).  
- Deliverables: Repo, testnet wallet, wireframes.  
- Hours: 30 (15 dev, 10 UI, 5 planning).  

**Days 4–7: Core Build (June 22–25)**  
- React Native app: signup, deposit, Tinyman yield flow.  
- Dashboard: balance, "money tree" (Lottie).  
- Claude 4 API: mocked round-up suggestions.  
- Deliverables: App skeleton, wallet integration.  
- Hours: 40 (25 dev, 10 UI, 5 testing).  

**Days 8–10: Polish & Test (June 26–28)**  
- Add withdrawal flow, education video (static HTML).  
- Style dashboard with "money tree" animation.  
- Test on Algorand testnet: deposit, yield, withdrawal.  
- Deliverables: Working prototype, testnet transactions.  
- Hours: 30 (20 dev, 5 UI, 5 testing).  

**Days 11–12: Demo Prep (June 29–July 1)**  
- Deploy to Algorand mainnet ($500 USDCa pool).  
- Beta test with 10 users (5 U.S., 5 Nigeria) via X.  
- Create 5-minute demo video: Aisha's flow (signup → deposit → yield → withdraw).  
- Deliverables: Live app, video, feedback report.  
- Hours: 20 (10 dev, 5 testing, 5 demo).  

**Total Hours**: 120 (~2 devs at 30 hours/week).

## Bolt Platform Code Generation
- **Frontend (React Native)**: Bolt generates app scaffold with NativeBase for onboarding (phone, OTP), deposit ($1–$10 slider), dashboard ("money tree" via Lottie), and withdrawal.  
  ```javascript
  // src/screens/Dashboard.js (Bolt-generated)
  import { NativeBaseProvider, Box, Text } from 'native-base';
  import LottieView from 'lottie-react-native';
  export default function Dashboard({ balance, yield }) {
    return (
      <NativeBaseProvider>
        <Box>
          <LottieView source={require('../assets/money-tree.json')} autoPlay />
          <Text>Balance: ${balance} | Daily Yield: ${yield}</Text>
        </Box>
      </NativeBaseProvider>
    );
  }
  ```
- **Backend (Node.js)**: Bolt generates Express APIs for MoonPay KYC, Firebase auth, and Tinyman yield calls.  
  ```javascript
  // src/server.js (Bolt-generated)
  const express = require('express');
  const { MoonPay } = require('@moonpay/moonpay-node');
  const app = express();
  app.post('/kyc', async (req, res) => {
    const { phone, name, country } = req.body;
    const verification = await MoonPay.verifyKYC({ phone, name, country });
    res.json({ status: verification.status });
  });
  app.listen(3000);
  ```
- **Blockchain (Algorand)**: Bolt generates Web3.js for USDCa wallet and Tinyman integration.  
  ```javascript
  // src/blockchain.js (Bolt-generated)
  const algosdk = require('algosdk');
  async function investUSDCa(amount) {
    const client = new algosdk.Algodv2('', 'https://testnet-algorand.api.purestake.io/ps2', '');
    const tx = await client.sendRawTransaction(amount, 'tinyman-usdca-pool').do();
    return tx.txId;
  }
  ```
- **Prompt for Bolt**: "Generate a React Native app with NativeBase for a micro-investment platform (Cultivest). Features: phone signup with MoonPay KYC-light, $1–$10 USDCa deposit (Flutterwave), 2.5% APY yield on Algorand's Tinyman, gamified dashboard with Lottie 'money tree,' 30-second education video, withdrawal to bank. Backend: Node.js/Express with Firebase auth, MongoDB, and Algorand Web3.js. Optimize for 120-hour build."

## Demo Plan (5 Minutes)
1. **Onboarding**: Aisha (Nigeria) signs up with phone (+234), MoonPay KYC-light (2 min).
2. **Deposit**: Deposits $5 via Flutterwave, converts to USDCa (0.5% fee).
3. **Investment**: Invests in Tinyman 2.5% APY pool, sees "vault" animation.
4. **Dashboard**: "Money tree" grows (5 leaves), shows "$0.003 earned," "First Investor!" badge.
5. **Education**: Views USDCa/GENIUS Act video, earns "Safe Saver" badge.
6. **Withdrawal**: Withdraws $2 to bank (1% fee), sees "sent" animation.

## Budget
- **Dev**: $3,000–$6,000 (2 devs, $50–$100/hr, 120 hours).
- **Tools**: $100 (Firebase/Vercel/Heroku free tier, MoonPay $0.50/user).
- **Mainnet**: $500 (USDCa test pool).
- **Total**: $3,600–$6,600.

## Next Steps
- **Bolt**: Input plan into Bolt platform to generate React Native/Node.js code (June 19–20).
- **X Validation**: Post "Cultivest demo: $5 in stablecoin yields for Nigeria/U.S. Feedback?" to recruit 10 beta testers.
- **Legal**: Check "Cultivest" trademark post-hackathon.

### 5. Marketing & Legal (Post-Hackathon)

-   **X Validation**: Post "Cultivest demo: $5 in stablecoin yields for Nigeria/U.S. Feedback?" to recruit 10 beta testers.
-   **Legal**: Check "Cultivest" trademark post-hackathon.