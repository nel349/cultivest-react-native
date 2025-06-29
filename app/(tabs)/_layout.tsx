import { Tabs } from 'expo-router';
import { Chrome as Home, TrendingUp, Wallet, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Shadows } from '@/utils/DesignSystem';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryGreen,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          ...Shadows.cardShadow,
          paddingTop: Spacing.sm,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
          height: Spacing.tabBarHeight + Math.max(insets.bottom, Spacing.sm),
          borderTopLeftRadius: Spacing.radiusLarge,
          borderTopRightRadius: Spacing.radiusLarge,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          ...Typography.labelSmall,
          marginTop: Spacing.tiny,
        },
        tabBarIconStyle: {
          marginTop: Spacing.tiny,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Garden',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Grow',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Harvest',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}