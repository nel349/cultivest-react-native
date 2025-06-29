import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ChatGPTDotsProps {
  isAnimating: boolean;
  size?: number;
  color?: string;
  speed?: number;
}

export default function ChatGPTDots({
  isAnimating,
  size = 8,
  color = '#58CC02',
  speed = 600,
}: ChatGPTDotsProps) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isAnimating]);

  const startAnimation = () => {
    // Stop any existing animation first
    stopAnimation();

    const delay = speed / 3;

    const createDotAnimation = (dot: Animated.Value, delayTime: number) =>
      Animated.sequence([
        Animated.delay(delayTime),
        Animated.timing(dot, {
          toValue: 1,
          duration: speed,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: speed,
          useNativeDriver: true,
        }),
      ]);

    animationRef.current = Animated.loop(
      Animated.parallel([
        createDotAnimation(dot1, 0),
        createDotAnimation(dot2, delay),
        createDotAnimation(dot3, delay * 2),
      ])
    );

    animationRef.current.start();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Reset all dots to default opacity
    Animated.parallel([
      Animated.timing(dot1, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dot2, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dot3, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot3,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 3,
  },
}); 