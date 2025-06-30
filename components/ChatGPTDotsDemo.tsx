import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import ChatGPTDots from './ChatGPTDots';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

export default function ChatGPTDotsDemo() {
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const [isAnimating3, setIsAnimating3] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>ChatGPT Dots Demo</Text>
        
        {/* Basic Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Usage</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsAnimating1(!isAnimating1)}
          >
            <Text style={styles.buttonText}>
              {isAnimating1 ? 'Stop Animation' : 'Start Animation'}
            </Text>
          </TouchableOpacity>
          <View style={styles.dotsContainer}>
            <ChatGPTDots isAnimating={isAnimating1} />
          </View>
          <Text style={styles.status}>
            Status: {isAnimating1 ? 'Animating' : 'Stopped'}
          </Text>
        </View>

        {/* Different Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Different Sizes</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsAnimating2(!isAnimating2)}
          >
            <Text style={styles.buttonText}>
              {isAnimating2 ? 'Stop All' : 'Animate All'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.sizesContainer}>
            <View style={styles.sizeItem}>
              <Text style={styles.sizeLabel}>Small (4px)</Text>
              <ChatGPTDots isAnimating={isAnimating2} size={4} />
            </View>
            <View style={styles.sizeItem}>
              <Text style={styles.sizeLabel}>Medium (8px)</Text>
              <ChatGPTDots isAnimating={isAnimating2} size={8} />
            </View>
            <View style={styles.sizeItem}>
              <Text style={styles.sizeLabel}>Large (12px)</Text>
              <ChatGPTDots isAnimating={isAnimating2} size={12} />
            </View>
            <View style={styles.sizeItem}>
              <Text style={styles.sizeLabel}>Extra Large (16px)</Text>
              <ChatGPTDots isAnimating={isAnimating2} size={16} />
            </View>
          </View>
        </View>

        {/* Different Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Different Colors</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsAnimating3(!isAnimating3)}
          >
            <Text style={styles.buttonText}>
              {isAnimating3 ? 'Stop Colors' : 'Animate Colors'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.colorsContainer}>
            <View style={styles.colorItem}>
              <Text style={styles.colorLabel}>Green (Brand)</Text>
              <ChatGPTDots isAnimating={isAnimating3} color={Colors.brand.green} />
            </View>
            <View style={styles.colorItem}>
              <Text style={styles.colorLabel}>Bitcoin Orange</Text>
              <ChatGPTDots isAnimating={isAnimating3} color={Colors.crypto.bitcoin} />
            </View>
            <View style={styles.colorItem}>
              <Text style={styles.colorLabel}>White</Text>
              <ChatGPTDots isAnimating={isAnimating3} color={Colors.text.primary} />
            </View>
            <View style={styles.colorItem}>
              <Text style={styles.colorLabel}>Gray</Text>
              <ChatGPTDots isAnimating={isAnimating3} color={Colors.text.tertiary} />
            </View>
          </View>
        </View>

        {/* Speed Variations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speed Variations</Text>
          <Text style={styles.description}>All animations running at different speeds</Text>
          
          <View style={styles.speedContainer}>
            <View style={styles.speedItem}>
              <Text style={styles.speedLabel}>Slow (1000ms)</Text>
              <ChatGPTDots isAnimating={true} speed={1000} />
            </View>
            <View style={styles.speedItem}>
              <Text style={styles.speedLabel}>Normal (600ms)</Text>
              <ChatGPTDots isAnimating={true} speed={600} />
            </View>
            <View style={styles.speedItem}>
              <Text style={styles.speedLabel}>Fast (300ms)</Text>
              <ChatGPTDots isAnimating={true} speed={300} />
            </View>
          </View>
        </View>

        {/* Usage Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>isAnimating:</Text> Controls whether dots animate
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>size:</Text> Dot diameter in pixels (default: 8)
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>color:</Text> Dot color (default: brand green)
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>speed:</Text> Animation speed in ms (default: 600)
          </Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeTitle}>Example Usage:</Text>
            <Text style={styles.code}>
{`<ChatGPTDots 
  isAnimating={isLoading}
  size={12}
  color="#00D26A"
  speed={600}
/>`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.heavy,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  section: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.brand.green,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  dotsContainer: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.lg,
    borderRadius: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  status: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  sizesContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  sizeItem: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.base,
    borderRadius: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  colorsContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  colorItem: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.base,
    borderRadius: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  speedContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  speedItem: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.base,
    borderRadius: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speedLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  instructionsSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  instruction: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  bold: {
    fontWeight: Typography.weight.bold,
    color: Colors.brand.green,
  },
  codeContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Spacing.md,
    padding: Spacing.base,
    marginTop: Spacing.base,
  },
  codeTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  code: {
    fontSize: Typography.size.sm,
    fontFamily: 'monospace',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
}); 