import { View, Text, StyleSheet } from 'react-native';

export function ProgressChart() {
  const weeklyData = [
    { day: 'Mon', value: 80 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 75 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 95 },
    { day: 'Sun', value: 70 },
  ];

  const maxValue = Math.max(...weeklyData.map(item => item.value));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {weeklyData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.value > 80 ? '#10B981' : '#3B82F6'
                  }
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Weekly Activity Score</Text>
        <Text style={styles.legendValue}>Average: 80%</Text>
      </View>
    </View>
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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    height: 80,
    width: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 12,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
});