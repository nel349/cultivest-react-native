import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface CategoryCardProps {
  title: string;
  exercises: number;
  color: string;
  icon: LucideIcon;
}

export function CategoryCard({ title, exercises, color, icon: Icon }: CategoryCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color + '10' }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.exercises}>{exercises} exercises</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exercises: {
    fontSize: 14,
    color: '#6B7280',
  },
});