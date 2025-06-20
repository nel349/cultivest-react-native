import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Activity, Target, Flame, Clock } from 'lucide-react-native';
import { StatsCard } from '@/components/StatsCard';
import { ProgressChart } from '@/components/ProgressChart';
import { QuickActionCard } from '@/components/QuickActionCard';

export default function HomeScreen() {
  const stats = [
    { icon: Activity, title: 'Steps Today', value: '8,547', target: '10,000', color: '#3B82F6' },
    { icon: Flame, title: 'Calories Burned', value: '342', target: '500', color: '#EF4444' },
    { icon: Target, title: 'Workouts This Week', value: '4', target: '5', color: '#10B981' },
    { icon: Clock, title: 'Active Minutes', value: '45', target: '60', color: '#F59E0B' },
  ];

  const quickActions = [
    { title: 'Start Workout', subtitle: 'Begin your fitness journey', color: '#3B82F6' },
    { title: 'Log Food', subtitle: 'Track your nutrition', color: '#10B981' },
    { title: 'Sleep Tracker', subtitle: 'Monitor your rest', color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.userName}>Sarah Johnson</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              target={stat.target}
              color={stat.color}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <ProgressChart />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                color={action.color}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsContainer: {
    gap: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});