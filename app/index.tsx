import { useEffect } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      // For now, always redirect to welcome screen
      // In a real app, you'd check authentication status here
      const timer = setTimeout(() => {
        router.replace('/(auth)/welcome');
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  return <View style={{ flex: 1, backgroundColor: '#58CC02' }} />;
}