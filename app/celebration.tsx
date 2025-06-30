import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirstInvestmentCelebration } from '@/components/FirstInvestmentCelebration';
import { celebrationManager } from '@/utils/celebration';
import { getCurrentUser } from '@/utils/auth';

export default function CelebrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse investment data from route params
  const investmentData = {
    assetTypeName: (params.assetTypeName as string) || 'Bitcoin',
    purchaseValueUsd: (params.purchaseValueUsd as string) || '1500',
    holdings: (params.holdings as string) || '0.00014',
    targetAsset: (params.targetAsset as string) || 'BTC',
  };

  // Mark celebration as completed when screen is viewed
  useEffect(() => {
    const markCelebrationCompleted = async () => {
      try {
        const { userId } = await getCurrentUser();
        if (userId) {
          console.log('🎯 Marking first investment celebration as completed for user:', userId);
          await celebrationManager.markCelebrationAsCompleted(userId);
        }
      } catch (error) {
        console.error('❌ Error marking celebration as completed:', error);
      }
    };

    markCelebrationCompleted();
  }, []);

  const handleContinue = () => {
    // Navigate back to the main app (portfolio tab)
    router.replace('/(tabs)/portfolio');
  };

  const handleViewPortfolio = () => {
    // Navigate to portfolio with a focus on the new investment
    router.replace('/(tabs)/portfolio');
  };

  return (
    <FirstInvestmentCelebration
      investmentData={investmentData}
      onContinue={handleContinue}
      onViewPortfolio={handleViewPortfolio}
    />
  );
} 