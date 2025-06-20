# Cultivest Mobile App

**Micro-Investment Platform for Stablecoin Yields - React Native App**

A React Native mobile application for Cultivest, enabling users to invest small amounts ($1–$10) in stablecoin yields (2–5% APY) through an intuitive, gamified interface. Built with Expo Router for cross-platform compatibility and optimized for the World's Largest Hackathon by Bolt.new.

## 🌟 Overview

Cultivest's mobile app democratizes access to stablecoin yields through a beautiful, user-friendly interface designed for Gen Z, millennials, and emerging market users. The app transforms complex DeFi operations into simple, engaging interactions.

### Key Value Propositions
- **Micro-investments**: Start investing with just $1
- **Gamified Experience**: Watch your "money tree" grow with every yield
- **Educational First**: Learn about stablecoins and DeFi through interactive content
- **Global Accessibility**: Designed for users in Nigeria, Argentina, and worldwide
- **GENIUS Act Compliant**: Transparent, audited stablecoin investments

## 🚀 Features

### Core Functionality
- **Onboarding Flow**: Phone-based signup with OTP verification
- **KYC Integration**: Seamless identity verification via MoonPay
- **Deposit Interface**: Easy fiat-to-USDCa conversion with local payment methods
- **Investment Dashboard**: One-tap investment in Tinyman USDCa pools
- **Yield Tracking**: Real-time balance and yield visualization
- **Withdrawal System**: Simple USDCa-to-fiat conversion
- **Educational Hub**: Interactive videos and quizzes about stablecoins

### Gamification Elements
- **Money Tree**: Visual representation of investment growth
- **Progress Tracking**: Daily yield and investment milestone tracking
- **Badge System**: Achievement badges for investment milestones
- **Stats Dashboard**: Personal investment analytics and insights

### AI-Powered Features
- **Round-up Suggestions**: Claude 4-powered spending analysis
- **Investment Optimization**: Smart yield pool recommendations
- **Personalized Insights**: AI-driven investment tips and education

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

### Backend Integration
- **Custom API Client**: Type-safe backend communication
- **Real-time Updates**: Live balance and yield tracking
- **Offline Support**: Graceful handling of network issues

## 📁 Project Structure

```
cultivest-react-native/
├── app/                        # Expo Router pages
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx           # Home/Dashboard screen
│   │   ├── profile.tsx         # User profile screen
│   │   └── workouts.tsx        # Investment tracking
│   ├── _layout.tsx             # Root layout
│   └── +not-found.tsx          # 404 page
├── components/                 # Reusable UI components
│   ├── CategoryCard.tsx        # Investment category cards
│   ├── ProfileCard.tsx         # User profile display
│   ├── ProgressChart.tsx       # Yield progress visualization
│   ├── QuickActionCard.tsx     # Dashboard action buttons
│   ├── SettingsItem.tsx        # Settings menu items
│   ├── StatsCard.tsx           # Investment statistics
│   └── WorkoutCard.tsx         # Investment session cards
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
Displays investment statistics with progress visualization:
- Investment amount and target
- Progress bar with color coding
- Interactive touch feedback
- Icon-based categorization

#### `QuickActionCard`
Action buttons for common tasks:
- Color-coded categories
- Descriptive subtitles
- Chevron navigation indicators
- Touch animations

#### `ProgressChart`
Weekly investment progress visualization:
- Bar chart representation
- Yield trend analysis
- Interactive data points
- Responsive design

### Design System
- **Color Palette**: Blue-green gradient scheme representing growth
- **Typography**: SF Pro (iOS) / Roboto (Android) for native feel
- **Spacing**: 4dp base unit for consistent layout
- **Shadows**: Subtle elevation for card components
- **Animations**: Smooth 300ms transitions throughout

## 📱 Screen Flow

### 1. Onboarding Journey
```
Splash Screen → Welcome Carousel → Phone Signup → OTP Verification → KYC → Wallet Creation
```

### 2. Main App Flow
```
Dashboard → Investment Selection → Confirmation → Success → Portfolio View
```

### 3. Educational Path
```
Learn Tab → Video Content → Interactive Quiz → Badge Earned → Next Topic
```

### 4. Transaction Flow
```
Deposit → Payment Method → Amount Selection → Processing → Confirmation → Dashboard Update
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
// Get wallet balance
const balance = await apiClient.getWalletBalance(userID);

// Initiate investment
const investment = await apiClient.initiateInvestment(userID, amount);

// Track positions
const positions = await apiClient.getInvestmentPositions(userID);
```

### Dashboard Data
```typescript
// Get comprehensive dashboard data
const dashboardData = await apiClient.getDashboardData(userID);
// Returns: balance, yields, money tree status, badges, stats
```

## 🎮 Gamification Features

### Money Tree System
- **Seedling**: $0-$10 invested
- **Sapling**: $10-$50 invested  
- **Growing Tree**: $50-$200 invested
- **Mature Tree**: $200+ invested

### Badge Categories
- **First Steps**: "First Investor", "First $10", "First Yield"
- **Education**: "Safe Saver", "Quiz Master", "DeFi Graduate"
- **Consistency**: "Weekly Investor", "Monthly Champion", "Yield Collector"
- **Milestones**: "Century Club ($100)", "Half K ($500)", "Thousand Club"

### Progress Tracking
- Daily yield accumulation
- Investment streak counting
- Referral rewards system
- Social sharing achievements

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
- 🔄 Complete investment flow
- 🔄 Money tree animations
- 🔄 Yield calculation and display
- 🔄 Educational content integration
- 🔄 Push notification system

### Phase 3: Advanced Features (Planned)
- 📋 Biometric authentication
- 📋 Round-up investment automation
- 📋 Social features and referrals
- 📋 Advanced portfolio analytics
- 📋 Multi-language support

### Phase 4: Market Expansion (Future)
- 📋 Local payment method integration
- 📋 Regulatory compliance features
- 📋 Additional blockchain support
- 📋 Institutional investor features

## 🎯 Target User Experience

### Aisha's Journey (25, Nigeria)
1. **Discovery**: Downloads app via social media
2. **Onboarding**: Signs up with phone in 2 minutes
3. **First Investment**: Deposits ₦2,000 ($5) via bank card
4. **Engagement**: Watches money tree grow daily
5. **Education**: Completes stablecoin safety quiz
6. **Growth**: Invests weekly, earns badges

### Key UX Principles
- **Simplicity**: Complex DeFi hidden behind simple actions
- **Trust**: Clear explanations and GENIUS Act compliance
- **Engagement**: Gamification drives daily usage
- **Education**: Progressive learning about stablecoins
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
