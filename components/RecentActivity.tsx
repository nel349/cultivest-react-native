import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Plus } from 'lucide-react-native';

interface Transaction {
  id: string;
  type: 'yield_credit' | 'investment' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'yield_credit':
        return TrendingUp;
      case 'investment':
        return ArrowDownLeft;
      case 'deposit':
        return Plus;
      case 'withdrawal':
        return ArrowUpRight;
      default:
        return TrendingUp;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'yield_credit':
        return '#00D4AA';
      case 'investment':
        return '#00B4D8';
      case 'deposit':
        return '#8B5CF6';
      case 'withdrawal':
        return '#F59E0B';
      default:
        return '#00D4AA';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>See All</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#1A2332', '#2A3441']}
        style={styles.activityCard}
      >
        {transactions.map((transaction, index) => {
          const Icon = getTransactionIcon(transaction.type);
          const color = getTransactionColor(transaction.type);
          
          return (
            <TouchableOpacity
              key={transaction.id}
              style={[
                styles.transactionItem,
                index < transactions.length - 1 && styles.transactionBorder
              ]}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: `${color}20` }]}>
                  <Icon size={20} color={color} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionTimestamp}>
                    {transaction.timestamp}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'withdrawal' ? '#F59E0B' : '#00D4AA' }
                ]}>
                  {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </Text>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: transaction.status === 'completed' ? '#00D4AA' : '#8B9DC3' }
                ]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#8B9DC3',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});