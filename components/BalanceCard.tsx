import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, TrendingUp } from 'lucide-react-native';

interface BalanceCardProps {
  balance: number;
  dailyYield: number;
  balanceVisible: boolean;
  onToggleVisibility: () => void;
}

export function BalanceCard({ 
  balance, 
  dailyYield, 
  balanceVisible, 
  onToggleVisibility 
}: BalanceCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A2332', '#2A3441']}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.label}>Total Balance</Text>
          <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeButton}>
            {balanceVisible ? (
              <Eye size={20} color="#8B9DC3" />
            ) : (
              <EyeOff size={20} color="#8B9DC3" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balance}>
            {balanceVisible ? `$${balance.toFixed(2)}` : '••••••'}
          </Text>
          <Text style={styles.currency}>USDCa</Text>
        </View>

        <View style={styles.yieldSection}>
          <View style={styles.yieldIndicator}>
            <TrendingUp size={16} color="#00D4AA" />
            <Text style={styles.yieldText}>
              +${dailyYield.toFixed(2)} today
            </Text>
          </View>
          <Text style={styles.yieldPercentage}>+2.5% APY</Text>
        </View>

        <LinearGradient
          colors={['#00D4AA', '#00B4D8']}
          style={styles.progressBar}
        >
          <View style={styles.progressFill} />
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#8B9DC3',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  balanceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  currency: {
    fontSize: 16,
    color: '#8B9DC3',
    fontWeight: '600',
  },
  yieldSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  yieldIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yieldText: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  yieldPercentage: {
    fontSize: 14,
    color: '#8B9DC3',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '75%',
    backgroundColor: 'transparent',
  },
});