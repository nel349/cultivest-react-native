import { router } from 'expo-router';
import { apiClient } from './api';

interface InvestmentCelebrationData {
  assetTypeName: string;
  purchaseValueUsd: string;
  holdings: string;
  targetAsset: string;
}

interface FirstInvestmentStatus {
  hasCompletedFirstInvestment: boolean;
  shouldShowCelebration: boolean;
  firstInvestment?: {
    targetAsset: string;
    amountUsd: number;
    createdAt: string;
  };
}

export class CelebrationManager {
  private static instance: CelebrationManager;
  private checkInterval: any = null;
  private isChecking = false;

  static getInstance(): CelebrationManager {
    if (!CelebrationManager.instance) {
      CelebrationManager.instance = new CelebrationManager();
    }
    return CelebrationManager.instance;
  }

  /**
   * Check if user has completed their first investment and should see celebration
   */
  async checkFirstInvestmentStatus(userID: string): Promise<FirstInvestmentStatus | null> {
    try {
      console.log(`🔍 Checking first investment status for user: ${userID}`);
      
      const response = await apiClient.request(`/user/first-investment-status?userID=${userID}`, {
        method: 'GET',
      }, false);

      if (response.success) {
        const data = response.data as any;
        console.log(`✅ First investment status:`, {
          hasCompleted: data.hasCompleted,
          shouldCelebrate: data.shouldCelebrate,
          totalInvestments: data.totalInvestments,
          firstInvestment: data.firstInvestment
        });
        
        return {
          hasCompletedFirstInvestment: data.hasCompleted,
          shouldShowCelebration: data.shouldCelebrate,
          firstInvestment: data.firstInvestment
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error checking first investment status:', error);
      return null;
    }
  }

  /**
   * Mark celebration as completed in the backend
   */
  async markCelebrationAsCompleted(userID: string): Promise<boolean> {
    try {
      console.log('✅ Marking celebration as completed for user:', userID);
      
      const response = await apiClient.request('/user/mark-celebration-completed', {
        method: 'POST',
        body: JSON.stringify({ userID }),
      }, true);

      if (response.success) {
        console.log('✅ Celebration marked as completed successfully');
        return true;
      } else {
        console.error('❌ Failed to mark celebration as completed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error marking celebration as completed:', error);
      return false;
    }
  }

  /**
   * Navigate to celebration screen with investment data
   */
  navigateToCelebration(investmentData: InvestmentCelebrationData) {
    console.log('🎉 Navigating to celebration screen with data:', investmentData);
    
    router.push({
      pathname: '/celebration',
      params: {
        assetTypeName: investmentData.assetTypeName,
        purchaseValueUsd: investmentData.purchaseValueUsd,
        holdings: investmentData.holdings,
        targetAsset: investmentData.targetAsset,
      }
    });
  }

  /**
   * Start monitoring for first investment completion
   * Useful for polling after investment is initiated
   */
  startMonitoringFirstInvestment(userID: string) {
    if (this.isChecking) {
      console.log('⚠️ Already monitoring for first investment completion');
      return;
    }

    console.log(`👀 Started monitoring first investment completion for user: ${userID}`);
    this.isChecking = true;

    let checkCount = 0;
    const maxChecks = 30; // Check for up to 5 minutes (10 second intervals)

    this.checkInterval = setInterval(async () => {
      checkCount++;
      console.log(`🔄 Investment check ${checkCount}/${maxChecks} for user: ${userID}`);

      try {
        const status = await this.checkFirstInvestmentStatus(userID);
        
        if (status?.shouldShowCelebration) {
          console.log('🎊 First investment detected! Showing celebration...');
          
          // Stop monitoring
          this.stopMonitoring();
          
          // Navigate to celebration with available data
          this.navigateToCelebration({
            assetTypeName: status.firstInvestment ? 
              this.getAssetDisplayName(status.firstInvestment.targetAsset) : 
              'Bitcoin', // Default to Bitcoin for auto-funding
            purchaseValueUsd: status.firstInvestment ? 
              (status.firstInvestment.amountUsd * 100).toString() : 
              '1000', // Default amount in cents ($10)
            holdings: '0',
            targetAsset: status.firstInvestment?.targetAsset || 'BTC',
          });
          
          return;
        }

        // Stop checking after max attempts
        if (checkCount >= maxChecks) {
          console.log('⏰ Stopped monitoring - max check attempts reached');
          this.stopMonitoring();
        }
        
      } catch (error) {
        console.error('❌ Error during investment monitoring:', error);
        checkCount++; // Still count failed attempts
        
        if (checkCount >= maxChecks) {
          this.stopMonitoring();
        }
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop monitoring for investment completion
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isChecking = false;
    console.log('🛑 Stopped monitoring first investment completion');
  }

  /**
   * Check immediately if celebration should be shown
   * Useful for app startup or when returning from external flow
   */
  async checkAndShowCelebrationIfNeeded(userID: string): Promise<boolean> {
    const status = await this.checkFirstInvestmentStatus(userID);
    
    if (status?.shouldShowCelebration) {
      console.log('🎉 Immediate celebration needed!');
      
      this.navigateToCelebration({
        assetTypeName: status.firstInvestment ? 
          this.getAssetDisplayName(status.firstInvestment.targetAsset) : 
          'Bitcoin',
        purchaseValueUsd: status.firstInvestment ? 
          (status.firstInvestment.amountUsd * 100).toString() : 
          '1000',
        holdings: '0',
        targetAsset: status.firstInvestment?.targetAsset || 'BTC',
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Get display name for asset
   */
  private getAssetDisplayName(asset: string): string {
    switch (asset.toUpperCase()) {
      case 'BTC': return 'Bitcoin';
      case 'ALGO': return 'Algorand';
      case 'USDC': return 'USD Coin';
      case 'SOL': return 'Solana';
      default: return asset;
    }
  }

  /**
   * Manually trigger celebration for testing (remove in production)
   */
  triggerTestCelebration(userID: string, asset: string = 'BTC', amount: number = 20) {
    console.log('🧪 Manually triggering test celebration');
    
    this.navigateToCelebration({
      assetTypeName: this.getAssetDisplayName(asset),
      purchaseValueUsd: (amount * 100).toString(), // Convert to cents
      holdings: '0',
      targetAsset: asset,
    });
  }

  /**
   * Cleanup when app is destroyed
   */
  cleanup() {
    this.stopMonitoring();
  }
}

// Export singleton instance
export const celebrationManager = CelebrationManager.getInstance(); 