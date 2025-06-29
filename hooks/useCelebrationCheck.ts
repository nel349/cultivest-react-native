import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { celebrationManager } from '@/utils/celebration';

interface UseCelebrationCheckProps {
  userID: string | null;
  enabled?: boolean;
}

export function useCelebrationCheck({ userID, enabled = true }: UseCelebrationCheckProps) {
  const appState = useRef(AppState.currentState);
  const hasCheckedOnStartup = useRef(false);

  useEffect(() => {
    if (!enabled || !userID) return;

    // Check immediately on mount (app startup)
    if (!hasCheckedOnStartup.current) {
      console.log('🎉 Checking for celebration on app startup');
      celebrationManager.checkAndShowCelebrationIfNeeded(userID);
      hasCheckedOnStartup.current = true;
    }

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [userID, enabled]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (!enabled || !userID) return;

    // When app comes to foreground from background
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('🎉 App became active - checking for pending celebrations');
      
      // Small delay to ensure any webhook processing is complete
      setTimeout(() => {
        celebrationManager.checkAndShowCelebrationIfNeeded(userID);
      }, 2000);
    }

    appState.current = nextAppState;
  };

  // Cleanup function for components that need to stop monitoring
  const cleanup = () => {
    celebrationManager.stopMonitoring();
  };

  // Manual check function
  const checkNow = async () => {
    if (!userID) return false;
    return await celebrationManager.checkAndShowCelebrationIfNeeded(userID);
  };

  return {
    checkNow,
    cleanup
  };
} 