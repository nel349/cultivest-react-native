import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Trophy, 
  TrendingUp, 
  ArrowRight, 
  Award
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MultiConfettiEffect } from './ConfettiEffect';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

interface FirstInvestmentCelebrationProps {
  investmentData: {
    assetTypeName: string;
    purchaseValueUsd: string;
    holdings: string;
    targetAsset: string;
  };
  onContinue: () => void;
  onViewPortfolio: () => void;
}

export function FirstInvestmentCelebration({ 
  investmentData, 
  onContinue, 
  onViewPortfolio 
}: FirstInvestmentCelebrationProps) {
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Animated values - use useRef to prevent recreation on re-renders
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log('🎊 FirstInvestmentCelebration mounted with data:', investmentData);
    
    // Trigger haptics for celebration
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(e => {
      console.log('Haptics error (ignoring):', e);
    });

    // Start animations sequence
    startCelebrationSequence();
  }, []);

  const startCelebrationSequence = () => {
    console.log('🎬 Starting celebration animation sequence');
    
    // Show content immediately to prevent blank screen
    setShowContent(true);
    
    // Phase 1: Fade and scale in trophy
    setTimeout(() => {
      console.log('🎭 Phase 1: Starting trophy animations');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log('✅ Phase 1 complete');
      });
      
      setAnimationPhase(1);
    }, 300);

    // Phase 2: Slide in content
    setTimeout(() => {
      console.log('🎭 Phase 2: Sliding in content');
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ Phase 2 complete');
      });
      
      setAnimationPhase(2);
    }, 800);

    // Phase 3: Start pulsing effect
    setTimeout(() => {
      console.log('🎭 Phase 3: Starting pulse animation');
      startPulseAnimation();
      setAnimationPhase(3);
    }, 1400);
  };

  const startPulseAnimation = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  const handleViewPortfolio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewPortfolio();
  };

  const getAssetEmoji = (asset: string) => {
    switch (asset.toUpperCase()) {
      case 'BTC': return '₿';
      case 'ALGO': return '◎';
      case 'USDC': return '💵';
      case 'SOL': return '◉';
      default: return '💰';
    }
  };

  const getAssetColor = (asset: string) => {
    switch (asset.toUpperCase()) {
      case 'BTC': return Colors.crypto.bitcoin;
      case 'ALGO': return Colors.crypto.algorand;
      case 'USDC': return Colors.crypto.usdc;
      case 'SOL': return Colors.crypto.solana;
      default: return Colors.brand.green;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.backgroundPrimary}
        style={styles.gradient}
      >
        {/* Confetti Effect */}
        <MultiConfettiEffect 
          autoStart={true}
          onAnimationEnd={() => console.log('🎊 Confetti animation completed')}
        />
        
        {showContent && (
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Trophy Icon */}
            <Animated.View 
              style={[
                styles.trophyContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.trophyGradient}
              >
                <Trophy size={64} color={Colors.text.primary} />
              </LinearGradient>
            </Animated.View>

            {/* Main Celebration Text */}
            <Animated.View 
              style={[
                styles.textContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={styles.congratsText}>Congratulations!</Text>
              <Text style={styles.achievementText}>You've planted your first seed!</Text>
              <Text style={styles.descriptionText}>
                Your digital garden has begun growing with your first{' '}
                <Text style={[styles.assetText, { color: getAssetColor(investmentData.targetAsset) }]}>
                  {investmentData.assetTypeName}
                </Text>
                {' '}investment!
              </Text>
            </Animated.View>

            {/* Investment Details Card */}
            <Animated.View 
              style={[
                styles.detailsCard,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.assetIcon, { backgroundColor: Colors.background.tertiary }]}>
                    <Text style={[styles.assetEmoji, { color: getAssetColor(investmentData.targetAsset) }]}>
                      {getAssetEmoji(investmentData.targetAsset)}
                    </Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.assetName}>{investmentData.assetTypeName}</Text>
                    <Text style={styles.cardSubtitle}>Your First Digital Asset</Text>
                  </View>
                  <Award size={24} color={Colors.brand.green} />
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Investment Amount</Text>
                    <Text style={styles.statValue}>
                      ${(parseFloat(investmentData.purchaseValueUsd) / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Garden Value</Text>
                    <Text style={styles.statValue}>
                      ${(parseFloat(investmentData.purchaseValueUsd) / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.milestoneContainer}>
                  <TrendingUp size={20} color={Colors.brand.green} />
                  <Text style={styles.milestoneText}>
                    First Investment Milestone Unlocked!
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.buttonContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleViewPortfolio}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.buttonGradient}
                >
                  <TrendingUp size={20} color={Colors.text.primary} />
                  <Text style={styles.primaryButtonText}>View My Garden</Text>
                  <ArrowRight size={20} color={Colors.text.primary} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue Growing</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  trophyContainer: {
    marginBottom: Spacing['2xl'],
  },
  trophyGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  congratsText: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  achievementText: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  descriptionText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  assetText: {
    fontWeight: Typography.weight.bold,
  },
  detailsCard: {
    width: '100%',
    marginBottom: Spacing['2xl'],
  },
  cardContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
    ...Shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  assetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  assetEmoji: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
  },
  cardHeaderText: {
    flex: 1,
  },
  assetName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.background.tertiary,
    borderRadius: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.tertiary,
    borderRadius: Spacing.md,
  },
  milestoneText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.brand.green,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.base,
  },
  primaryButton: {
    borderRadius: Spacing.lg,
    ...Shadow.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
    alignItems: 'center',
    ...Shadow.sm,
  },
  secondaryButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
}); 