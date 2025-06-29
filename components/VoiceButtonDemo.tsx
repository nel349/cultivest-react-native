import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import VoiceButton from './VoiceButton';

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
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 15,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    margin: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  instructionsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instruction: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: '#1F2937',
  },
  codeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  code: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#1F2937',
    lineHeight: 20,
  },
}); 