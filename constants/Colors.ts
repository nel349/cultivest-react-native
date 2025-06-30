// Cultivest Dark Theme System
// Based on brand logo: Black backgrounds, vibrant green accents, clean white text

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const Colors = {
  // Core Brand Colors (from logo)
  brand: {
    black: '#000000',        // Pure black background from logo
    green: '#00D26A',        // Vibrant green from logo
    white: '#FFFFFF',        // Pure white for contrast
  },

  // Background System
  background: {
    primary: '#000000',      // Main black background
    secondary: '#111111',    // Slightly lighter for cards/sections
    tertiary: '#1C1C1C',     // Even lighter for elevated content
    overlay: 'rgba(0, 0, 0, 0.95)', // Modal overlays
    surface: '#0A0A0A',      // Subtle surface variation
  },

  // Text System
  text: {
    primary: '#FFFFFF',      // Main white text
    secondary: '#CCCCCC',    // Secondary white text
    tertiary: '#999999',     // Muted text for hints/labels
    accent: '#00D26A',       // Green accent text
    inverse: '#000000',      // Black text on light backgrounds
  },

  // Interactive Elements
  button: {
    primary: '#00D26A',      // Main green CTA buttons
    primaryHover: '#00B359', // Darker green for pressed state
    secondary: '#1C1C1C',    // Dark secondary buttons
    secondaryHover: '#2C2C2C', // Lighter for hover
    disabled: '#333333',     // Disabled button state
    text: '#FFFFFF',         // Button text color
    textSecondary: '#CCCCCC', // Secondary button text
  },

  // Border & Divider System
  border: {
    primary: '#333333',      // Main border color
    secondary: '#222222',    // Subtle borders
    accent: '#00D26A',       // Green accent borders
    light: '#444444',        // Lighter borders
  },

  // Status Colors
  status: {
    success: '#00D26A',      // Success (matches brand green)
    warning: '#FFB020',      // Warning amber
    error: '#FF4757',        // Error red
    info: '#5DADE2',         // Info blue
  },

  // Crypto Asset Colors
  crypto: {
    bitcoin: '#F7931A',
    ethereum: '#627EEA',
    solana: '#9945FF',
    algorand: '#00D4AA',
    usdc: '#2775CA',
  },

  // Gradient Definitions
  gradients: {
    // Primary dark gradients
    backgroundPrimary: ['#000000', '#0A0A0A'] as const,
    backgroundSecondary: ['#111111', '#1C1C1C'] as const,
    
    // Green accent gradients
    primary: ['#00D26A', '#00B359'] as const,
    primaryReverse: ['#00B359', '#00D26A'] as const,
    
    // Overlay gradients
    overlay: ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)'] as const,
    cardOverlay: ['rgba(17,17,17,0.95)', 'rgba(28,28,28,0.95)'] as const,
  }
} as const;

// Typography System
export const Typography = {
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    title: 42,
  },
  
  weight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
} as const;

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Properly typed shadow utilities
export const createShadow = (size: 'sm' | 'md' | 'lg' | 'xl'): ViewStyle => {
  const shadows = {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 16,
    },
  };
  return shadows[size];
};

// Pre-defined shadow constants for common use
export const Shadow = {
  sm: createShadow('sm'),
  md: createShadow('md'),
  lg: createShadow('lg'),
  xl: createShadow('xl'),
} as const;

export default Colors; 