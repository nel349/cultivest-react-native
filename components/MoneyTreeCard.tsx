import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf } from 'lucide-react-native';

interface MoneyTreeCardProps {
  leaves: number;
  weeklyGrowth: number;
}

export function MoneyTreeCard({ leaves, weeklyGrowth }: MoneyTreeCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={['#1A2332', '#2A3441']}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#00D4AA20', '#00B4D820']}
            style={styles.iconBackground}
          >
            <Leaf size={24} color="#00D4AA" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Money Tree</Text>
        <Text style={styles.leavesCount}>{leaves} leaves</Text>
        <Text style={styles.growth}>+{weeklyGrowth}% this week</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
    height: 140,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#8B9DC3',
    fontWeight: '500',
    marginBottom: 4,
  },
  leavesCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  growth: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: '600',
  },
});