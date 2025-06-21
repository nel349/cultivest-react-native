import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';

interface YieldSummaryProps {
  totalYieldEarned: number;
  investmentStreak: number;
}

export function YieldSummary({ totalYieldEarned, investmentStreak }: YieldSummaryProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={['#1A2332', '#2A3441']}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#00B4D820', '#8B5CF620']}
            style={styles.iconBackground}
          >
            <TrendingUp size={24} color="#00B4D8" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Total Earned</Text>
        <Text style={styles.amount}>${totalYieldEarned.toFixed(2)}</Text>
        <Text style={styles.streak}>{investmentStreak} day streak</Text>
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
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  streak: {
    fontSize: 12,
    color: '#00B4D8',
    fontWeight: '600',
  },
});