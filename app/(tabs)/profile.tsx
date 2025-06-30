import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from '@/utils/auth';
import { 
  User, Settings, Bell, Shield, HelpCircle, LogOut, 
  ChevronRight, TreePine, Trophy, Target, Star,
  Leaf, Sprout, Flower, Crown
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const userStats = {
    level: 3,
    plantsGrown: 8,
    totalEarned: 12.87,
    streakDays: 12,
    joinDate: 'March 2024'
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You\'ll need to verify your phone number again to sign back in.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(
                'Error', 
                'Failed to sign out. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const achievements = [
    { id: '1', title: 'First Seed', description: 'Made your first investment', icon: Sprout, unlocked: true },
    { id: '2', title: 'Growing Tree', description: 'Reached $100 invested', icon: TreePine, unlocked: true },
    { id: '3', title: 'First Bloom', description: 'Earned your first yield', icon: Flower, unlocked: true },
    { id: '4', title: 'Week Warrior', description: '7 day investment streak', icon: Target, unlocked: true },
    { id: '5', title: 'Money Master', description: 'Reach $500 invested', icon: Crown, unlocked: false },
    { id: '6', title: 'Garden Guru', description: '30 day streak', icon: Star, unlocked: false },
  ];

  const menuItems = [
    { title: 'Account Settings', icon: Settings, action: () => {} },
    { title: 'Notifications', icon: Bell, action: () => {}, toggle: true },
    { title: 'Security & Privacy', icon: Shield, action: () => {} },
    { title: 'Help & Support', icon: HelpCircle, action: () => {} },
    { title: 'Sign Out', icon: LogOut, action: handleSignOut, danger: true },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.backgroundPrimary}
        style={styles.gradient}
      >
        {/* Floating decorative elements - updated for dark theme */}
        <View style={styles.decorationContainer}>
          <View style={[styles.plantDecor, { top: 100, left: 30, opacity: 0.3 }]}>
            <Crown size={20} color={Colors.brand.green} />
          </View>
          <View style={[styles.plantDecor, { top: 140, right: 40, opacity: 0.2 }]}>
            <Star size={18} color={Colors.brand.green} />
          </View>
          <View style={[styles.plantDecor, { top: 200, left: width - 80, opacity: 0.25 }]}>
            <Trophy size={22} color={Colors.brand.green} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Garden Profile 👤</Text>
            <Text style={styles.subtitle}>Master gardener in training</Text>
          </View>

          {/* Profile Card - Updated to dark theme */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[Colors.background.secondary, Colors.background.tertiary]}
              style={styles.profileCardGradient}
            >
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <User size={32} color={Colors.brand.green} />
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{userStats.level}</Text>
                  </View>
                </View>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>Garden Master</Text>
                  <Text style={styles.userSubtitle}>Member since {userStats.joinDate}</Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <TreePine size={20} color={Colors.brand.green} />
                  <Text style={styles.statValue}>{userStats.plantsGrown}</Text>
                  <Text style={styles.statLabel}>Plants Grown</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Target size={20} color={Colors.crypto.bitcoin} />
                  <Text style={styles.statValue}>{userStats.streakDays}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Trophy size={20} color={Colors.crypto.solana} />
                  <Text style={styles.statValue}>${userStats.totalEarned.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Total Earned</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Achievements Section - Updated to dark theme */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Your Achievements 🏆</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementCard,
                    achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                  ]}
                >
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.unlocked ? Colors.brand.green : Colors.background.tertiary }
                  ]}>
                    <achievement.icon size={24} color={Colors.brand.white} />
                  </View>
                  <Text style={[
                    styles.achievementTitle,
                    { color: achievement.unlocked ? Colors.text.primary : Colors.text.tertiary }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    { color: achievement.unlocked ? Colors.text.secondary : Colors.text.tertiary }
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Star size={12} color={Colors.crypto.solana} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Menu Items - Updated to dark theme */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Settings ⚙️</Text>
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.menuItem}
                  onPress={item.action}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[
                      styles.menuItemIcon,
                      { backgroundColor: item.danger ? `${Colors.status.error}20` : `${Colors.brand.green}20` }
                    ]}>
                      <item.icon 
                        size={20} 
                        color={item.danger ? Colors.status.error : Colors.brand.green} 
                      />
                    </View>
                    <Text style={[
                      styles.menuItemText,
                      { color: item.danger ? Colors.status.error : Colors.text.primary }
                    ]}>
                      {item.title}
                    </Text>
                  </View>
                  
                  {item.toggle ? (
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: Colors.background.tertiary, true: Colors.brand.green }}
                      thumbColor={Colors.brand.white}
                    />
                  ) : (
                    <ChevronRight size={20} color={Colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  plantDecor: {
    position: 'absolute',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  profileCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  profileCardGradient: {
    padding: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.brand.green,
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brand.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userSubtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.background.tertiary,
  },
  statValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  achievementsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    position: 'relative',
    ...Shadow.sm,
  },
  achievementUnlocked: {
    borderWidth: 1,
    borderColor: Colors.brand.green,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  achievementTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  achievementDescription: {
    fontSize: Typography.size.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  menuSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  menuContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
  },
  bottomSpacing: {
    height: 50,
  },
});