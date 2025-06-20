import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Flame, Activity, CircleCheck as CheckCircle } from 'lucide-react-native';

interface WorkoutCardProps {
  title: string;
  duration: string;
  calories: number;
  exercises: number;
  date: string;
  completed: boolean;
}

export function WorkoutCard({ title, duration, calories, exercises, date, completed }: WorkoutCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {completed && (
          <View style={styles.completedBadge}>
            <CheckCircle size={20} color="#10B981" />
          </View>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.statText}>{duration}</Text>
        </View>
        <View style={styles.statItem}>
          <Flame size={16} color="#EF4444" />
          <Text style={styles.statText}>{calories} cal</Text>
        </View>
        <View style={styles.statItem}>
          <Activity size={16} color="#3B82F6" />
          <Text style={styles.statText}>{exercises} exercises</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  completedBadge: {
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
});