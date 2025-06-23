# Cultivest Mobile App

**Multi-Chain Micro-Investment Platform with Portfolio NFTs - React Native App**

A React Native mobile application for Cultivest, enabling users to invest small amounts ($1–$10) in Bitcoin and Algorand with revolutionary Portfolio NFT tracking. Features custodial wallet security with future Chain Key self-custody opt-in. Built with Expo Router for cross-platform compatibility and optimized for the World's Largest Hackathon by Bolt.new.

## 🌟 Overview

Cultivest's mobile app democratizes access to cryptocurrency investments through a beautiful, user-friendly interface designed for Gen Z, millennials, and emerging market users. The app transforms complex multi-chain crypto investments into simple, engaging interactions with world-first Portfolio NFT tracking.

### Key Value Propositions
- **Micro-investments**: Start investing in Bitcoin and Algorand with just $1
- **Portfolio NFTs**: Your entire investment portfolio becomes a tradeable NFT on Algorand
- **Custodial Security**: Professional crypto custody with future self-custody graduation
- **Multi-chain Support**: Bitcoin (custodial) + Algorand (direct) with expansion planned
- **Educational First**: Learn about Bitcoin, Algorand, and custody models through interactive content
- **Global Accessibility**: Designed for users in Nigeria, Argentina, and worldwide

## 🚀 Features

### Core Functionality
- **Onboarding Flow**: Phone-based signup with OTP verification
- **KYC Integration**: Seamless identity verification via MoonPay
- **Deposit Interface**: Direct Bitcoin purchases via MoonPay integration
- **Investment Dashboard**: Multi-chain Bitcoin and Algorand investment tracking
- **Portfolio NFTs**: Revolutionary NFT-based portfolio tracking and ownership
- **Balance Monitoring**: Real-time Bitcoin and Algorand balance synchronization
- **Withdrawal System**: Bitcoin and Algorand withdrawal with clear fee disclosure
- **Educational Hub**: Interactive videos and quizzes about Bitcoin, Algorand, and custody models

### Gamification Elements
- **Portfolio Tree**: Visual representation of multi-chain investment growth
- **Progress Tracking**: Bitcoin and Algorand investment milestone tracking
- **Badge System**: Achievement badges for crypto investment milestones
- **NFT Collections**: Portfolio and Position NFTs as collectible achievements
- **Stats Dashboard**: Multi-chain investment analytics and performance insights

### AI-Powered Features
- **Round-up Suggestions**: Claude 4-powered spending analysis
- **Investment Optimization**: Smart Bitcoin and Algorand allocation recommendations
- **Portfolio Analysis**: AI-driven insights on NFT portfolio performance
- **Personalized Insights**: AI-driven investment tips and crypto education

## 🛠 Tech Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based routing with web support
- **TypeScript**: Type-safe development
- **Lucide React Native**: Beautiful, consistent icons

### UI/UX Libraries
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Enhanced touch interactions
- **Expo Linear Gradient**: Gradient backgrounds and effects
- **React Native SVG**: Custom illustrations and graphics

### Platform Integration
- **Expo Camera**: Document scanning for KYC
- **Expo Haptics**: Tactile feedback for interactions
- **React Native WebView**: In-app educational content
- **Expo Web Browser**: External link handling
- **NFT Viewers**: Portfolio and Position NFT visualization

### Backend Integration
- **Custom API Client**: Type-safe backend communication
- **Real-time Updates**: Live Bitcoin and Algorand balance tracking
- **NFT Integration**: Portfolio NFT creation and management
- **Multi-chain Support**: Bitcoin custodial and Algorand direct wallet management
- **Offline Support**: Graceful handling of network issues

## 📁 Project Structure

```
cultivest-react-native/
├── app/                        # Expo Router pages
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx           # Home/Dashboard screen
│   │   ├── profile.tsx         # User profile screen
│   │   └── portfolio.tsx       # Multi-chain investment tracking
│   ├── _layout.tsx             # Root layout
│   └── +not-found.tsx          # 404 page
├── components/                 # Reusable UI components
│   ├── CategoryCard.tsx        # Crypto investment category cards
│   ├── ProfileCard.tsx         # User profile display
│   ├── ProgressChart.tsx       # Multi-chain portfolio visualization
│   ├── QuickActionCard.tsx     # Dashboard action buttons
│   ├── SettingsItem.tsx        # Settings menu items
│   ├── StatsCard.tsx           # Multi-chain investment statistics
│   ├── PortfolioNFTCard.tsx    # Portfolio NFT display
│   └── PositionCard.tsx        # Individual crypto position cards
├── utils/                      # Utility functions
│   └── api.ts                  # API client and endpoints
├── types/                      # TypeScript type definitions
│   └── api.ts                  # API response types
├── assets/                     # Static assets
│   └── images/                 # App icons and images
├── hooks/                      # Custom React hooks
│   └── useFrameworkReady.ts    # Framework initialization
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio
- Cultivest Backend API running

### Environment Configuration
Create a `.env.local` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_MOONPAY_API_KEY=your_moonpay_key
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_key
EXPO_PUBLIC_ALGORAND_NETWORK=testnet
EXPO_PUBLIC_BITCOIN_NETWORK=testnet
EXPO_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/cultivest-react-native.git
cd cultivest-react-native

# Install dependencies
npm install

# Start development server
npm run dev

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web
npx expo start --web
```

### Building for Production

```bash
# Build for web
npm run build:web

# Build for iOS (requires macOS and Xcode)
npx expo build:ios

# Build for Android
npx expo build:android

# Create development build
npx expo run:ios --device
npx expo run:android --device
```

## 🎨 UI Components

### Core Components

#### `StatsCard`
Displays multi-chain investment statistics with progress visualization:
- Bitcoin and Algorand balances with USD values
- Portfolio performance and progress tracking
- Interactive touch feedback
- Multi-chain asset categorization

#### `QuickActionCard`
Action buttons for common tasks:
- Color-coded categories
- Descriptive subtitles
- Chevron navigation indicators
- Touch animations

#### `ProgressChart`
Multi-chain portfolio progress visualization:
- Bar chart representation for Bitcoin and Algorand
- Portfolio performance trend analysis
- Interactive data points for each cryptocurrency
- Responsive design with NFT portfolio integration

### Design System
- **Color Palette**: Blue-green gradient scheme representing growth
- **Typography**: SF Pro (iOS) / Roboto (Android) for native feel
- **Spacing**: 4dp base unit for consistent layout
- **Shadows**: Subtle elevation for card components
- **Animations**: Smooth 300ms transitions throughout

## 📱 Screen Flow

### 1. Onboarding Journey
```
Splash Screen → Welcome Carousel → Phone Signup → OTP Verification → KYC → Multi-Chain Wallet Creation → Portfolio NFT Setup
```

### 2. Main App Flow
```
Dashboard → Crypto Selection (BTC/ALGO) → Investment Confirmation → Purchase Success → Portfolio NFT View
```

### 3. Educational Path
```
Learn Tab → Crypto Education Videos → Interactive Quiz → NFT Badge Earned → Next Topic
```

### 4. Transaction Flow
```
Bitcoin Purchase → MoonPay Integration → Amount Selection → Processing → Confirmation → Portfolio NFT Update
```

## 🔌 API Integration

### Authentication Flow
```typescript
// Phone signup
const signupResult = await apiClient.signup(phoneNumber, name, country);

// OTP verification
const verifyResult = await apiClient.verifyOtp(userID, otpCode);

// Get user profile
const profile = await apiClient.getUserProfile(userID);
```

### Investment Operations
```typescript
// Get multi-chain wallet balance
const balance = await apiClient.getMultiChainBalance(userID);

// Initiate Bitcoin investment
const bitcoinInvestment = await apiClient.initiateBitcoinInvestment(userID, amount);

// Initiate Algorand investment
const algorandInvestment = await apiClient.initiateAlgorandInvestment(userID, amount);

// Track portfolio NFT positions
const portfolioNFT = await apiClient.getPortfolioNFT(userID);
const positions = await apiClient.getPositionNFTs(userID);
```

### Dashboard Data
```typescript
// Get comprehensive multi-chain dashboard data
const dashboardData = await apiClient.getDashboardData(userID);
// Returns: Bitcoin/Algorand balances, portfolio NFT data, position NFTs, badges, multi-chain stats
```

## 🎮 Gamification Features

### Portfolio Tree System
- **Seedling**: $0-$10 invested across Bitcoin and Algorand
- **Sapling**: $10-$50 invested in multiple cryptocurrencies  
- **Growing Tree**: $50-$200 multi-chain portfolio
- **Mature Tree**: $200+ diversified crypto portfolio with multiple NFTs

### Badge Categories
- **First Steps**: "First Bitcoin Investor", "First $10", "Portfolio NFT Creator"
- **Education**: "Crypto Learner", "Quiz Master", "Custody Graduate"
- **Consistency**: "Weekly Investor", "Monthly Champion", "Multi-Chain Collector"
- **Milestones**: "Century Club ($100)", "Half K ($500)", "Thousand Club"
- **NFT Achievements**: "Portfolio Master", "Position Collector", "NFT Trader"

### Progress Tracking
- Daily Bitcoin and Algorand price tracking
- Investment streak counting
- Portfolio NFT value growth
- Referral rewards system
- Social sharing achievements with NFT showcases

## 🌍 Localization & Accessibility

### Multi-Language Support
- **English**: Primary language
- **Spanish**: Argentina and Latin America
- **Hausa**: Nigeria regional language
- **French**: West Africa expansion

### Accessibility Features
- VoiceOver/TalkBack support
- High contrast mode compatibility
- Large text scaling support
- Touch target optimization (44dp minimum)

### Emerging Market Optimization
- **Low Data Mode**: Reduced image loading
- **Offline Functionality**: Cached content and offline OTP
- **Local Payment Methods**: Flutterwave, M-Pesa integration
- **Currency Display**: Local currency alongside USD

## 🔐 Security & Privacy

### Client-Side Security
- **Biometric Authentication**: Face ID/Touch ID support
- **Secure Storage**: Encrypted local data storage
- **Certificate Pinning**: API communication security
- **Input Validation**: Client-side data sanitization

### Privacy Protection
- **Data Minimization**: Only essential data collection
- **Consent Management**: Clear privacy controls
- **Local Processing**: Sensitive operations on-device
- **Transparency**: Clear data usage disclosure

## 📊 Performance Optimization

### App Performance
- **Bundle Size**: Optimized with Metro bundler
- **Image Loading**: Progressive loading with placeholders
- **Memory Management**: Efficient component lifecycle
- **Battery Optimization**: Background task minimization

### Network Optimization
- **Caching Strategy**: Smart API response caching
- **Request Batching**: Combined API calls
- **Retry Logic**: Robust error handling
- **Offline Support**: Graceful degradation

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Integration Testing
- API endpoint testing
- Navigation flow testing
- Payment integration testing
- Biometric authentication testing

### Device Testing
- **iOS**: iPhone 12+, iPad Air+
- **Android**: Pixel 6+, Samsung Galaxy S21+
- **Web**: Chrome, Safari, Firefox
- **Performance**: Low-end device optimization

## 🚀 Deployment

### Development Build
```bash
# Create development build
npx expo run:ios --device
npx expo run:android --device
```

### Production Deployment
```bash
# Build for app stores
npx expo build:ios --release-channel production
npx expo build:android --release-channel production

# Submit to stores
npx expo submit --platform ios
npx expo submit --platform android
```

### Web Deployment
```bash
# Build for web
npm run build:web

# Deploy to Netlify/Vercel
# Artifacts in dist/ directory
```

## 📈 Analytics & Monitoring

### User Analytics
- **Screen Views**: Navigation tracking
- **User Actions**: Investment and withdrawal events
- **Conversion Funnels**: Onboarding to first investment
- **Retention Metrics**: Daily and monthly active users

### Performance Monitoring
- **Crash Reporting**: Sentry integration
- **Performance Metrics**: Load times and API response
- **Error Tracking**: User experience issue identification
- **A/B Testing**: Feature and UI optimization

## 🗺 Development Roadmap

### Phase 1: MVP (Completed)
- ✅ Basic app structure with Expo Router
- ✅ Core UI components and design system
- ✅ API client and type definitions
- ✅ Dashboard and stats visualization
- ✅ Cross-platform compatibility

### Phase 2: Investment Features (In Progress)
- 🔄 Complete Bitcoin and Algorand investment flow
- 🔄 Portfolio tree animations with NFT integration
- 🔄 Multi-chain balance tracking and portfolio performance
- 🔄 Crypto education content integration
- 🔄 Push notification system for price alerts
- 🔄 Portfolio NFT creation and management

### Phase 3: Advanced Features (Planned)
- 📋 Biometric authentication
- 📋 Round-up investment automation
- 📋 NFT portfolio trading marketplace
- 📋 Social features and referrals with NFT showcases
- 📋 Advanced multi-chain portfolio analytics
- 📋 Chain Key self-custody opt-in
- 📋 Multi-language support

### Phase 4: Market Expansion (Future)
- 📋 Local payment method integration
- 📋 Regulatory compliance features
- 📋 Additional blockchain support (Ethereum, Solana)
- 📋 Institutional investor features
- 📋 Portfolio NFT fractionalization
- 📋 NFT-based inheritance and estate planning

## 🎯 Target User Experience

### Aisha's Journey (25, Nigeria)
1. **Discovery**: Downloads app via social media
2. **Onboarding**: Signs up with phone in 2 minutes
3. **First Investment**: Buys ₦2,000 ($5) of Bitcoin via MoonPay
4. **NFT Creation**: Receives Portfolio NFT tracking her Bitcoin investment
5. **Engagement**: Watches portfolio tree grow daily
6. **Education**: Completes Bitcoin and custody safety quiz
7. **Growth**: Invests weekly in Bitcoin and Algorand, earns NFT badges

### Key UX Principles
- **Simplicity**: Complex multi-chain crypto hidden behind simple actions
- **Trust**: Clear explanations of Bitcoin volatility and custody models
- **Innovation**: Portfolio NFTs make investments tradeable and inheritable
- **Engagement**: Gamification and NFT collection drives daily usage
- **Education**: Progressive learning about Bitcoin, Algorand, and self-custody
- **Accessibility**: Works on low-end devices with poor connectivity

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make changes and test thoroughly
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Testing**: Jest and React Native Testing Library

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the incredible development platform
- **React Native Community**: For outstanding libraries and tools
- **Lucide Icons**: For beautiful, consistent iconography
- **World's Largest Hackathon**: For the inspiration and challenge
- **Cultivest Backend Team**: For the robust API foundation

## 📞 Support & Community

- **Documentation**: [docs.cultivest.app](https://docs.cultivest.app)
- **Community**: [Discord](https://discord.gg/cultivest)
- **Issues**: [GitHub Issues](https://github.com/yourusername/cultivest-react-native/issues)
- **Email**: support@cultivest.app
- **Twitter**: [@CultivestApp](https://twitter.com/CultivestApp)

## 🌟 Demo

Experience Cultivest live:
- **Web Demo**: [app.cultivest.io](https://app.cultivest.io)
- **TestFlight**: iOS beta testing
- **APK Download**: Android beta testing

---

**Built with ❤️ for financial inclusion and accessible investing worldwide**
