import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import VoiceButton from './VoiceButton';
import { Colors, Typography, Spacing, Shadow } from '@/constants/Colors';

export default function VoiceButtonDemo() {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVoicePress = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      console.log('Voice input stopped');
    } else {
      // Start listening
      setIsListening(true);
      console.log('Voice input started');
      
      // Simulate some processing after 5 seconds
      setTimeout(() => {
        setIsListening(false);
        console.log('Voice input automatically stopped');
      }, 5000);
    }
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Voice Button Demo</Text>
        
        {/* Main Interactive Button */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Voice Button</Text>
          <Text style={styles.description}>
            Tap to {isListening ? 'stop' : 'start'} voice input
          </Text>
          <VoiceButton 
            onPress={handleVoicePress}
            isActive={isListening}
            size={100}
          />
          <Text style={styles.status}>
            Status: {isListening ? 'Listening...' : 'Ready'}
          </Text>
        </View>

        {/* Different Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Different Sizes</Text>
          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={handleLoadingDemo} size={60} />
              <Text style={styles.label}>Small</Text>
            </View>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={handleLoadingDemo} size={80} />
              <Text style={styles.label}>Medium</Text>
            </View>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={handleLoadingDemo} size={120} />
              <Text style={styles.label}>Large</Text>
            </View>
          </View>
        </View>

        {/* Different States */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Different States</Text>
          <View style={styles.row}>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={() => {}} isActive={false} />
              <Text style={styles.label}>Inactive</Text>
            </View>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={() => {}} isActive={true} />
              <Text style={styles.label}>Active</Text>
            </View>
            <View style={styles.buttonContainer}>
              <VoiceButton onPress={() => {}} disabled={true} />
              <Text style={styles.label}>Disabled</Text>
            </View>
          </View>
        </View>

        {/* Loading Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading Demo</Text>
          <Text style={styles.description}>
            Tap to see 3-second loading animation
          </Text>
          <VoiceButton 
            onPress={handleLoadingDemo}
            isActive={isLoading}
            disabled={isLoading}
          />
          <Text style={styles.status}>
            {isLoading ? 'Processing...' : 'Tap to demo loading'}
          </Text>
        </View>

        {/* Usage Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>onPress:</Text> Function called when button is tapped
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>isActive:</Text> Controls animation and button color
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>size:</Text> Button diameter (default: 80)
          </Text>
          <Text style={styles.instruction}>
            • <Text style={styles.bold}>disabled:</Text> Disables interaction
          </Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeTitle}>Example Usage:</Text>
            <Text style={styles.code}>
{`<VoiceButton 
  onPress={handleVoicePress}
  isActive={isListening}
  size={100}
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
  status: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    marginTop: Spacing.base,
    fontWeight: Typography.weight.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    margin: Spacing.md,
  },
  label: {
    marginTop: Spacing.md,
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