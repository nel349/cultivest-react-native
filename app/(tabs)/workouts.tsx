import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Plus, Clock, Flame, Target } from 'lucide-react-native';
import { WorkoutCard } from '@/components/WorkoutCard';
import { CategoryCard } from '@/components/CategoryCard';

export default function WorkoutsScreen() {
  const workoutCategories = [
    { title: 'Strength Training', exercises: 12, color: '#3B82F6', icon: Target },
    { title: 'Cardio', exercises: 8, color: '#EF4444', icon: Flame },
    { title: 'Yoga & Flexibility', exercises: 15, color: '#10B981', icon: Clock },
    { title: 'HIIT', exercises: 10, color: '#F59E0B', icon: Target },
  ];

  const recentWorkouts = [
    {
      title: 'Upper Body Strength',
      duration: '45 min',
      calories: 280,
      exercises: 8,
      date: 'Today',
      completed: true
    },
    {
      title: 'Morning Cardio',
      duration: '30 min',
      calories: 320,
      exercises: 5,
      date: 'Yesterday',
      completed: true
    },
    {
      title: 'Full Body HIIT',
      duration: '25 min',
      calories: 410,
      exercises: 6,
      date: '2 days ago',
      completed: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {workoutCategories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                exercises={category.exercises}
                color={category.color}
                icon={category.icon}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <View style={styles.workoutsContainer}>
            {recentWorkouts.map((workout, index) => (
              <WorkoutCard
                key={index}
                title={workout.title}
                duration={workout.duration}
                calories={workout.calories}
                exercises={workout.exercises}
                date={workout.date}
                completed={workout.completed}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  workoutsContainer: {
    gap: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});