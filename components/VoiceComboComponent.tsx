import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ChatGPTDots from './ChatGPTDots';
import VoiceAccessibilityGuide from './VoiceAccessibilityGuide';
import VoiceButton from './VoiceButton';

interface VoiceComboComponentProps {
  userID: string;
  onActivate?: (isActive: boolean) => void;
  onDeactivate?: (isActive: boolean) => void;
}

export default function VoiceComboComponent({
  userID,
  onActivate,
  onDeactivate,
}: VoiceComboComponentProps) {
  const [isActive, setIsActive] = useState(false);
  const [isVoiceGuideActive, setIsVoiceGuideActive] = useState(false);

  return (
    <View style={styles.container}>
      {/* Voice Button */}
      <VoiceButton 
        onPress={() => {
          console.log('Voice button pressed');
          setIsActive(!isActive);
          setIsVoiceGuideActive(!isVoiceGuideActive);
        }}
        isActive={isActive}
        size={70}
      />

      {/* ChatGPT Dots */}
      {/* <View style={styles.dotsContainer}>
        <ChatGPTDots 
          isAnimating={isActive} 
          size={16} 
          color="black" 
          speed={400} 
        />
      </View> */}

      {/* Voice Accessibility Guide */}
      <View style={styles.guideContainer}>
        <VoiceAccessibilityGuide 
          userID={userID} 
          onActivate={(isActive) => {
            console.log('Voice guide is now:', isActive ? 'active' : 'inactive');
            setIsActive(isActive);
            onActivate?.(isActive);
          }} 
          activate={isVoiceGuideActive}
          onDeactivate={() => {
            console.log('Voice guide is now inactive');
            setIsActive(false);
            onDeactivate?.(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    // marginBottom: 50,
  },
  dotsContainer: {
    marginTop: 20,
    marginVertical: 10,
  },
  guideContainer: {
    // width: 100,
    minHeight: 1,
  },
});
