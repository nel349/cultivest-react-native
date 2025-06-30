import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import ChatGPTDots from './ChatGPTDots';
import { Colors } from '@/constants/Colors';

interface VoiceButtonProps {
  onPress: () => void;
  isActive?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function VoiceButton({
  onPress,
  isActive = false,
  size = 80,
  disabled = false,
}: VoiceButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.5)).current;
  const waveAnim3 = useRef(new Animated.Value(0.7)).current;
  const waveAnim4 = useRef(new Animated.Value(0.4)).current;
  const waveAnim5 = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive && !disabled) {
      startActiveAnimations();
    } else {
      stopActiveAnimations();
    }
  }, [isActive, disabled]);

  const startActiveAnimations = () => {
    // Pulsing outer ring
    Animated.loop(
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
      ])
    ).start();

    // Animated sound waves
    const createWaveAnimation = (wave: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(wave, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(wave, {
            toValue: 0.2,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

    createWaveAnimation(waveAnim1, 0).start();
    createWaveAnimation(waveAnim2, 100).start();
    createWaveAnimation(waveAnim3, 200).start();
    createWaveAnimation(waveAnim4, 300).start();
    createWaveAnimation(waveAnim5, 150).start();
  };

  const stopActiveAnimations = () => {
    pulseAnim.stopAnimation(() => {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    // Reset waves to static state
    [waveAnim1, waveAnim2, waveAnim3, waveAnim4, waveAnim5].forEach((wave, index) => {
      wave.stopAnimation(() => {
        Animated.timing(wave, {
          toValue: [0.3, 0.5, 0.7, 0.4, 0.6][index],
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const waveScale1 = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const waveScale2 = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.25],
  });

  const waveScale3 = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  const waveScale4 = waveAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0.36, 1.125],
  });

  const waveScale5 = waveAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [0.44, 1.375],
  });

  return (
    <View style={styles.container}>
      {/* Outer pulse ring when active */}
      {isActive && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size * 1.4,
              height: size * 1.4,
              borderRadius: (size * 1.4) / 2,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Main button */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: disabled 
              ? Colors.background.tertiary 
              : isActive 
                ? Colors.brand.green 
                : Colors.background.secondary,
          },
          pressed && styles.buttonPressed,
        ]}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Sound wave bars */}
          <View style={styles.soundWaves}>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: waveScale1 }],
                  opacity: waveAnim1,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: waveScale2 }],
                  opacity: waveAnim2,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: waveScale3 }],
                  opacity: waveAnim3,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: waveScale4 }],
                  opacity: waveAnim4,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{ scaleY: waveScale5 }],
                  opacity: waveAnim5,
                },
              ]}
            />
          </View>

          {/* Dots when processing */}
          {isActive && (
            <View style={styles.dotsOverlay}>
              <ChatGPTDots isAnimating={true} size={12} />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.brand.green,
    opacity: 0.3,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  soundWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    gap: 3,
  },
  wave: {
    width: 3,
    height: 20,
    backgroundColor: Colors.text.primary,
    borderRadius: 1.5,
  },
  dotsOverlay: {
    position: 'absolute',
    bottom: 8,
  },
}); 