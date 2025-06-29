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
  TreePine, 
  Sparkles, 
  ArrowRight, 
  Award,
  Heart,
  Star 
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MultiConfettiEffect } from './ConfettiEffect';

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
      case 'BTC': return '#F7931A';
      case 'ALGO': return '#000000';
      case 'USDC': return '#2775CA';
      case 'SOL': return '#9945FF';
      default: return '#58CC02';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#FFFFFF']}
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
                colors={['#FFD700', '#FFA500']}
                style={styles.trophyGradient}
              >
                <Trophy size={64} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>

            {/* Main Celebration Text */}
            <Animated.View 
              style={[
                styles.textContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
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
              <LinearGradient
                colors={['#FFFFFF', '#F8F8F8']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.assetIcon, { backgroundColor: `${getAssetColor(investmentData.targetAsset)}20` }]}>
                    <Text style={[styles.assetEmoji, { color: getAssetColor(investmentData.targetAsset) }]}>
                      {getAssetEmoji(investmentData.targetAsset)}
                    </Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.assetName}>{investmentData.assetTypeName}</Text>
                    <Text style={styles.cardSubtitle}>Your First Digital Asset</Text>
                  </View>
                  <Award size={24} color="#58CC02" />
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
                  <Sparkles size={20} color="#58CC02" />
                  <Text style={styles.milestoneText}>
                    First Investment Milestone Unlocked! 🏆
                  </Text>
                </View>
              </LinearGradient>
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
                  colors={['#58CC02', '#45A002']}
                  style={styles.buttonGradient}
                >
                  <TreePine size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>View My Garden</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue Growing 🌱</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Decorative Elements */}
            <View style={styles.decorativeContainer}>
              {[...Array(5)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.decorativeElement,
                    {
                      left: (width / 6) * (index + 1),
                      transform: [{ scale: pulseAnim }]
                    }
                  ]}
                >
                  {index % 2 === 0 ? (
                    <Star size={16} color="#FFD700" />
                  ) : (
                    <Heart size={16} color="#FF6B6B" />
                  )}
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  trophyContainer: {
    marginBottom: 32,
  },
  trophyGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#58CC02',
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  assetText: {
    fontWeight: '700',
  },
  detailsCard: {
    width: '100%',
    marginBottom: 32,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetEmoji: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardHeaderText: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(88, 204, 2, 0.05)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  milestoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#58CC02',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
    textAlign: 'center',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 60,
  },
  decorativeElement: {
    position: 'absolute',
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
  },
}); 