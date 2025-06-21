import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video as LucideIcon } from 'lucide-react-native';

interface QuickAction {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  onPress: () => void;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions 🚀</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={action.onPress}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8F8F8']}
              style={styles.card}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}>
                <action.icon size={20} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
});