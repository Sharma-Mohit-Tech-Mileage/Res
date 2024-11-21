import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, findNodeHandle, AccessibilityInfo } from 'react-native';
import WaveAnimation from '../../../common/WaveIcon';
// import OutageAreaIcon from '../../../../res/svgIcons/troubleshooting/OutageAreaIcon';
// import ServiceIcon from '../../../../res/svgIcons/troubleshooting/ServiceIcon';
// import WalletIcon from '../../../../res/svgIcons/troubleshooting/WalletIcon';
// import TroubleshootIcon from '../../../../res/svgIcons/troubleshooting/TroubleshootIcon';
import OutageAreaIcon from '../../../../res/svgIcons/troubleshooting/icon-marker';
import ServiceIcon from '../../../../res/svgIcons/troubleshooting/icon-globe';
import WalletIcon from '../../../../res/svgIcons/troubleshooting/icon-wallet';
import TroubleshootIcon from '../../../../res/svgIcons/troubleshooting/icon-tool';

const ICON_MAP = {
  OutageAreaIcon,
  ServiceIcon,
  WalletIcon,
  TroubleshootIcon,
};

const CheckStatusWrapper = ({ loading, result, icon, isIssueDetected, description, step, onComplete ,onMount,isFinished}) => {
  const IconComponent = ICON_MAP[icon];
  const screenHeight = Dimensions.get('window').height;
  
  const stepRef = useRef(null);
  const iconRef = useRef(null);
  const resultRef = useRef(null);
  const descriptionRef = useRef(null);


  const calculateDelay = (message) => {
    const wordCount = message.trim().split(/\s+/).length;
    const wordsPerMinute = 150; // Slower speaking rate
    const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
    const baseDelay = wordCount * millisecondsPerWord;
    const buffer = 2000; // Fixed 2-second buffer
    const totalDelay = baseDelay + buffer;
  
    return totalDelay;
  };

  const focusAndAnnounce = async (ref, text) => {
    const node = findNodeHandle(ref.current);
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node);
      await new Promise(resolve => setTimeout(resolve, calculateDelay(text)));
    }
  };

  useEffect(() => {
    if (onMount) {
      const init = async () => {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (!isEnabled) {
          onMount();
        }
      };
      init();
    }
  }, []); // Empty dependency array for initialization
  useEffect(() => {
    const init = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      (isFinished && !isEnabled) && setTimeout(onComplete, 3000);
    };
    init();
  }, [isFinished]);

  useEffect(() => {
    let isActive = true;
    
    const manageFocus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (!isEnabled) {
        return;
      }

      try {
        // Step announcement
        await focusAndAnnounce(stepRef, `Step ${step} of 3`);
        if (!isActive) return;

        // Icon status
        await focusAndAnnounce(iconRef, loading ? 'Check in progress' : isIssueDetected ? 'Issue detected' : 'Check complete');
        if (!isActive) return;

        // Result
        if (result) {
          await focusAndAnnounce(resultRef, result);
          if (!isActive) return;
        }

        // Description
        if (description?.trim()) {
          await focusAndAnnounce(descriptionRef, description);
          if (!isActive) return;
        }

        if (isFinished) {
          onComplete();
        }else{
          onMount(true);
        }
      } catch (error) {
        onComplete?.();
      }
    };

    manageFocus();
    return () => {
      isActive = false;
    };
  }, [step, loading, result, description, isIssueDetected, onComplete,isFinished]);

  return (
    <View style={styles.container}>
      <Text 
        ref={stepRef}
        style={styles.topLeftText}
        accessible={true}
        accessibilityRole="header"
        importantForAccessibility="yes"
        accessibilityLabel={`Step ${step} of 3`}
      >
        {step} of 3
      </Text>

      <View 
        ref={iconRef}
        style={[styles.iconContainer, { marginTop: screenHeight * 0.01 }]}
        accessible={true}
        accessibilityRole="image"
        importantForAccessibility="yes"
        accessibilityLabel={loading ? 'Check in progress' : isIssueDetected ? 'Issue detected' : 'Check complete'}
      >
        <WaveAnimation loading={loading} isIssueDetected={isIssueDetected}>
          <IconComponent  />
        </WaveAnimation>
      </View>

      <View style={[styles.textContainer, { marginTop: screenHeight * 0.05 }]}>
        <Text 
          ref={resultRef}
          style={styles.resultText}
          accessible={true}
          accessibilityRole="text"
          importantForAccessibility="yes"
          accessibilityLabel={result}
        >
          {result}
        </Text>
        
        {description && description.trim() && (
          <Text 
            ref={descriptionRef}
            style={styles.description}
            accessible={true}
            accessibilityRole="text"
            importantForAccessibility="yes"
            accessibilityLabel={description}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#292929',
    lineHeight: 28,
    fontWeight: '400',
  },
  description: {
    lineHeight: 28,
    fontWeight: '400',
    fontSize: 16,
    color: '#4C5458',
    textAlign: 'center',
    paddingVertical: 8,
  },
  topLeftText: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#292929',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});

export default CheckStatusWrapper;