import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, findNodeHandle, AccessibilityInfo } from 'react-native';
import WaveAnimation from '../../../common/WaveIcon';
import OutageAreaIcon from '../../../../res/svgIcons/troubleshooting/OutageAreaIcon';
import ServiceIcon from '../../../../res/svgIcons/troubleshooting/ServiceIcon';
import WalletIcon from '../../../../res/svgIcons/troubleshooting/WalletIcon';
import TroubleshootIcon from '../../../../res/svgIcons/troubleshooting/TroubleshootIcon';

const ICON_MAP = {
  OutageAreaIcon: OutageAreaIcon,
  ServiceIcon: ServiceIcon,
  WalletIcon: WalletIcon,
  TroubleshootIcon: TroubleshootIcon,
};

const CheckStatusWrapper = ({ loading, result, icon, isIssueDetected, description, step }) => {
  const IconComponent = ICON_MAP[icon];
  const screenHeight = Dimensions.get('window').height;
  
  const stepRef = useRef(null);
  const iconRef = useRef(null);
  const resultRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    
    const moveFocus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (!isEnabled) return;

      // Focus step number
      const stepNode = findNodeHandle(stepRef.current);
      if (stepNode) {
        AccessibilityInfo.setAccessibilityFocus(stepNode);
        
        // Wait and announce icon status
        timeoutId = setTimeout(() => {
          const iconNode = findNodeHandle(iconRef.current);
          if (iconNode) {
            AccessibilityInfo.setAccessibilityFocus(iconNode);
            
            // If we have a result, focus it after icon
            if (result) {
              setTimeout(() => {
                const resultNode = findNodeHandle(resultRef.current);
                if (resultNode) {
                  AccessibilityInfo.setAccessibilityFocus(resultNode);
                  
                  // If we have a description, focus it last
                  if (description && description.trim()) {
                    setTimeout(() => {
                      const descriptionNode = findNodeHandle(descriptionRef.current);
                      if (descriptionNode) {
                        AccessibilityInfo.setAccessibilityFocus(descriptionNode);
                      }
                    }, 1500);
                  }
                }
              }, 1500);
            }
          }
        }, 1500);
      }
    };

    moveFocus();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, loading, result, description]);

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
          <IconComponent width={80} height={80} />
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
    fontWeight: 'bold',
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