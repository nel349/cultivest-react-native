/**
 * Cultivest Design System
 * A comprehensive design language for the multi-chain investment platform
 */

// Color Palette - Inspired by growth, nature, and financial trust
export const Colors = {
  // Primary Brand Colors
  primaryGreen: '#58CC02',
  primaryGreenLight: '#89E5AB',
  primaryGreenDark: '#46A302',
  
  // Secondary Colors
  secondaryBlue: '#3B82F6',
  secondaryBlueDark: '#1E3A8A',
  secondaryBlueLight: '#60A5FA',
  
  // Accent Colors
  accentGold: '#FFD700',
  accentOrange: '#FF9500',
  accentPurple: '#8B5CF6',
  accentTeal: '#00D4AA',
  
  // Cryptocurrency Colors
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  algorand: '#000000',
  solana: '#9945FF',
  usdc: '#2775CA',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral Colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Text Colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textMuted: '#8B9DC3',
  
  // Background Colors
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  backgroundDark: '#1F2937',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Surface Colors
  surfaceElevated: '#FFFFFF',
  surfaceCard: 'rgba(255, 255, 255, 0.95)',
  surfaceModal: 'rgba(255, 255, 255, 0.9)',
  surfaceInput: '#F9FAFB',
  
  // Border Colors
  borderLight: '#E5E7EB',
  borderMedium: '#D1D5DB',
  borderDark: '#9CA3AF',
  borderFocus: '#3B82F6',
  
  // Status Colors with Opacity Variants
  successLight: 'rgba(16, 185, 129, 0.1)',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  errorLight: 'rgba(239, 68, 68, 0.1)',
  infoLight: 'rgba(59, 130, 246, 0.1)',
} as const;

// Gradient Definitions
export const Gradients = {
  // Primary Brand Gradients
  primary: ['#89E5AB', '#58CC02', '#46A302'],
  primaryVertical: ['#89E5AB', '#58CC02'],
  primaryHorizontal: ['#58CC02', '#46A302'],
  
  // Auth & Onboarding Gradients
  auth: ['#1E3A8A', '#3B82F6', '#60A5FA'],
  welcome: ['#89E5AB', '#58CC02'],
  celebration: ['#FFD700', '#FF9500'],
  
  // Investment Gradients
  bitcoin: ['#F7931A', '#FF9500'],
  algorand: ['#000000', '#374151'],
  portfolio: ['#8B5CF6', '#3B82F6'],
  
  // UI Element Gradients
  button: ['#58CC02', '#46A302'],
  buttonSecondary: ['#FFFFFF', '#F0F0F0'],
  card: ['#FFFFFF', '#F8F8F8'],
  modal: ['#89E5AB', '#58CC02'],
  
  // Status Gradients
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  
  // Overlay Gradients
  overlay: ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)'],
  overlayLight: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
} as const;

// Typography System
export const Typography = {
  // Display Styles (Large headings)
  display1: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 48,
    fontWeight: '800' as const,
    lineHeight: 56,
    letterSpacing: -0.02,
  },
  display2: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.01,
  },
  
  // Heading Styles
  heading1: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.01,
  },
  heading2: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.005,
  },
  heading3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  heading4: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  heading5: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  heading6: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  
  // Body Text Styles
  bodyLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodyMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // Label Styles
  labelLarge: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  labelMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  
  // Caption Styles
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionBold: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  
  // Button Text Styles
  buttonLarge: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonMedium: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  buttonSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // Monospace (for addresses, codes)
  monospace: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontVariant: ['tabular-nums'] as const,
  },
} as const;

// Spacing System (8px base unit)
export const Spacing = {
  // Base units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Semantic spacing
  tiny: 2,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  huge: 48,
  massive: 64,
  
  // Component-specific spacing
  cardPadding: 20,
  screenPadding: 24,
  sectionSpacing: 32,
  itemSpacing: 12,
  
  // Layout spacing
  headerHeight: 60,
  tabBarHeight: 70,
  buttonHeight: 48,
  inputHeight: 56,
  
  // Border radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXLarge: 20,
  radiusRound: 50,
} as const;

// Shadow System
export const Shadows = {
  // Card shadows
  cardShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardShadowLarge: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Button shadows
  buttonShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonShadowPressed: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Modal shadows
  modalShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  
  // Input shadows
  inputShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputShadowFocused: {
    shadowColor: Colors.secondaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Floating action button
  fabShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Subtle shadows
  subtleShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  
  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// Animation Durations
export const Animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// Breakpoints for responsive design
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
} as const;

// Z-Index Scale
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Component Variants
export const ComponentVariants = {
  button: {
    primary: {
      backgroundColor: Colors.primaryGreen,
      borderColor: Colors.primaryGreen,
    },
    secondary: {
      backgroundColor: Colors.white,
      borderColor: Colors.borderLight,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: Colors.primaryGreen,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  },
  
  card: {
    elevated: {
      backgroundColor: Colors.surfaceElevated,
      ...Shadows.cardShadow,
    },
    flat: {
      backgroundColor: Colors.surfaceCard,
      ...Shadows.none,
    },
    outlined: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },
  },
  
  input: {
    default: {
      backgroundColor: Colors.surfaceInput,
      borderColor: Colors.borderLight,
    },
    focused: {
      backgroundColor: Colors.white,
      borderColor: Colors.borderFocus,
    },
    error: {
      backgroundColor: Colors.white,
      borderColor: Colors.error,
    },
  },
} as const;

// Helper Functions
export const createTextStyle = (variant: keyof typeof Typography, color?: string) => ({
  ...Typography[variant],
  color: color || Colors.textPrimary,
});

export const createButtonStyle = (variant: keyof typeof ComponentVariants.button) => ({
  ...ComponentVariants.button[variant],
  ...Shadows.buttonShadow,
  borderRadius: Spacing.radiusMedium,
  paddingVertical: Spacing.md,
  paddingHorizontal: Spacing.lg,
});

export const createCardStyle = (variant: keyof typeof ComponentVariants.card) => ({
  ...ComponentVariants.card[variant],
  borderRadius: Spacing.radiusLarge,
  padding: Spacing.cardPadding,
});

// Export default design system object
export const DesignSystem = {
  Colors,
  Gradients,
  Typography,
  Spacing,
  Shadows,
  Animations,
  Breakpoints,
  ZIndex,
  ComponentVariants,
  createTextStyle,
  createButtonStyle,
  createCardStyle,
} as const;

export default DesignSystem;