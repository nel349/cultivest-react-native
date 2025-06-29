import React, { useEffect, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface ConfettiEffectProps {
  autoStart?: boolean;
  duration?: number;
  colors?: string[];
  onAnimationEnd?: () => void;
}

export function ConfettiEffect({ 
  autoStart = true, 
  duration = 3000,
  colors = ['#58CC02', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  onAnimationEnd 
}: ConfettiEffectProps) {
  const confettiRef = useRef<any>(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (autoStart && confettiRef.current) {
      // Start confetti immediately
      confettiRef.current.start();
      
      // Stop after duration
      const timer = setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.stop();
        }
        onAnimationEnd?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoStart, duration, onAnimationEnd]);

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: width / 2, y: -10 }}
        autoStart={false}
        fadeOut={true}
        colors={colors}
        explosionSpeed={350}
        fallSpeed={2000}
      />
    </View>
  );
}

// Celebration preset with multiple bursts
export function MultiConfettiEffect({ 
  autoStart = true, 
  onAnimationEnd 
}: { 
  autoStart?: boolean; 
  onAnimationEnd?: () => void;
}) {
  const { width } = Dimensions.get('window');
  const confettiRefs = useRef<any[]>([]);

  useEffect(() => {
    if (autoStart) {
      // Create multiple bursts with delays
      const bursts = [
        { delay: 0, x: width * 0.3 },
        { delay: 500, x: width * 0.7 },
        { delay: 1000, x: width * 0.5 },
        { delay: 1500, x: width * 0.2 },
        { delay: 2000, x: width * 0.8 },
      ];

      bursts.forEach((burst, index) => {
        setTimeout(() => {
          if (confettiRefs.current[index]) {
            confettiRefs.current[index].start();
          }
        }, burst.delay);
      });

      // End animation after all bursts
      const timer = setTimeout(() => {
        onAnimationEnd?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [autoStart, width, onAnimationEnd]);

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {[0, 1, 2, 3, 4].map((index) => (
        <ConfettiCannon
          key={index}
          ref={(ref) => { confettiRefs.current[index] = ref; }}
          count={100}
          origin={{ x: index === 2 ? width * 0.5 : index < 2 ? width * 0.3 : width * 0.7, y: -10 }}
          autoStart={false}
          fadeOut={true}
          colors={['#58CC02', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
          explosionSpeed={300}
          fallSpeed={1800}
        />
      ))}
    </View>
  );
} 