import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Award, Bell, Shield, CircleHelp as HelpCircle, LogOut, User, Mail, Phone, ChevronRight, Star } from 'lucide-react-native';

export default function ProfileScreen() {
  const userProfile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024',
    kycStatus: 'verified',
    totalInvested: 127.45,
    totalEarned: 12.87,
    badges: 8,
    streak: 12
  };

  const achievements = [
    {
      id: '1',
      title: 'First Investor',
      description: 'Made your first investment',
      icon: Star,
      color: '#F59E0B',
      earned: true
    },
    {
      id: '2',
      title: 'Safe Saver',
      description: 'Completed stablecoin education',
      icon: Shield,
      color: '#00D4AA',
      earned: true
    },
    {
      id: '3',
      title: 'Streak Master',
      description: '10+ day investment streak',
      icon: Award,
      color: '#8B5CF6',
      earned: true
    }
  ];

  const settingsItems = [
    {
      title: 'Account Settings',
      icon: User,
      onPress: () => {},
      hasArrow: true
    },
    {
      title: 'Notifications',
      icon: Bell,
      onPress: () => {},
      hasArrow: true
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      onPress: () => {},
      hasArrow: true
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => {},
      hasArrow: true
    }
  ];

  return (
    <LinearGradient
      colors={['#0D1421', '#1A2332']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#8B9DC3" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#1A2332', '#2A3441']}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color="#00D4AA" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <Text style={styles.userEmail}>{userProfile.email}</Text>
                <Text style={styles.joinDate}>Member since {userProfile.joinDate}</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userProfile.totalInvested}</Text>
                <Text style={styles.statLabel}>Total Invested</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userProfile.totalEarned}</Text>
                <Text style={styles.statLabel}>Total Earned</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {achievements.map((achievement) => (
            <TouchableOpacity key={achievement.id} style={styles.achievementCard}>
              <LinearGradient
                colors={['#1A2332', '#2A3441']}
                style={styles.achievementCardGradient}
              >
                <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}20` }]}>
                  <achievement.icon size={24} color={achievement.color} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Award size={16} color="#00D4AA" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <LinearGradient
            colors={['#1A2332', '#2A3441']}
            style={styles.settingsCard}
          >
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  index < settingsItems.length - 1 && styles.settingItemBorder
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <item.icon size={20} color="#8B9DC3" />
                  </View>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                </View>
                {item.hasArrow && (
                  <ChevronRight size={20} color="#8B9DC3" />
                )}
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton}>
            <LinearGradient
              colors={['#1A2332', '#2A3441']}
              style={styles.signOutGradient}
            >
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A2332',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00D4AA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A2332',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#8B9DC3',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1421',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B9DC3',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#2A3441',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  achievementCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  achievementCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#8B9DC3',
  },
  earnedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D4AA20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  signOutButton: {
    borderRadius: 12,
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3441',
    gap: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 100,
  },
});