import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TreePine } from 'lucide-react-native';

interface MoneyTreeCardProps {
  leaves: number;
  weeklyGrowth: number;
}

export function MoneyTreeCard({ leaves, weeklyGrowth }: MoneyTreeCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <TreePine size={24} color="#58CC02" />
          </View>
        </View>

        <Text style={styles.title}>Money Tree 🌳</Text>
        <Text style={styles.leavesCount}>{leaves} leaves</Text>
        <Text style={styles.growth}>+{weeklyGrowth}% growth</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height: 140,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '700',
    marginBottom: 4,
  },
  leavesCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  growth: {
    fontSize: 14,
    color: '#58CC02',
    fontWeight: '600',
  },
});