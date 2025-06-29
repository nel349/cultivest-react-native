import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp, ArrowDownLeft, Zap, X } from 'lucide-react-native';

interface QuickActionFABProps {
  onInvest: () => void;
  onWithdraw: () => void;
  onFund: () => void;
}

export function QuickActionFAB({ onInvest, onWithdraw, onFund }: QuickActionFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.stagger(50, [
        Animated.spring(scaleAnim, {
          toValue,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const actions = [
    {
      icon: TrendingUp,
      label: 'Invest',
      color: '#10B981',
      onPress: () => {
        onInvest();
        toggleExpanded();
      },
    },
    {
      icon: Zap,
      label: 'Fund',
      color: '#F59E0B',
      onPress: () => {
        onFund();
        toggleExpanded();
      },
    },
    {
      icon: ArrowDownLeft,
      label: 'Withdraw',
      color: '#EF4444',
      onPress: () => {
        onWithdraw();
        toggleExpanded();
      },
    },
  ];

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {actions.map((action, index) => (
        <Animated.View
          key={action.label}
          style={[
            styles.actionButton,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(60 * (index + 1))],
                  }),
                },
              ],
              opacity: scaleAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButtonInner, { backgroundColor: action.color }]}
            onPress={action.onPress}
          >
            <action.icon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </Animated.View>
      ))}

      {/* Main FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#58CC02', '#45A002']}
          style={styles.fabGradient}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            {isExpanded ? (
              <X size={24} color="#FFFFFF" />
            ) : (
              <Plus size={24} color="#FFFFFF" />
            )}
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Backdrop */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleExpanded}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 90,
    right: 24,
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: -1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  actionButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});