import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // For now, always redirect to welcome screen
    // In a real app, you'd check authentication status here
    router.replace('/(auth)/welcome');
  }, []);

  return null;
}