import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import ChatGPTDots from './ChatGPTDots';

export default function ChatGPTDotsDemo() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatGPT Dots Demo</Text>
      
      <View style={styles.dotsContainer}>
        <ChatGPTDots isAnimating={isAnimating} />
      </View>

      <Pressable
        style={[styles.button, isAnimating && styles.buttonActive]}
        onPress={() => setIsAnimating(!isAnimating)}
      >
        <Text style={styles.buttonText}>
          {isAnimating ? 'Stop Animation' : 'Start Animation'}
        </Text>
      </Pressable>

      <Text style={styles.description}>
        Tap the button to {isAnimating ? 'stop' : 'start'} the ChatGPT-style dots animation
      </Text>

      {/* Different variations */}
      <View style={styles.variationsContainer}>
        <Text style={styles.variationTitle}>Different Sizes & Colors:</Text>
        
        <View style={styles.variationRow}>
          <ChatGPTDots isAnimating={isAnimating} size={6} color="#3B82F6" />
          <Text style={styles.variationLabel}>Small Blue</Text>
        </View>

        <View style={styles.variationRow}>
          <ChatGPTDots isAnimating={isAnimating} size={12} color="#EF4444" />
          <Text style={styles.variationLabel}>Large Red</Text>
        </View>

        <View style={styles.variationRow}>
          <ChatGPTDots isAnimating={isAnimating} size={10} color="#A855F7" speed={400} />
          <Text style={styles.variationLabel}>Fast Purple</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 30,
  },
  dotsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#58CC02',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonActive: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  variationsContainer: {
    width: '100%',
  },
  variationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  variationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  variationLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
}); 