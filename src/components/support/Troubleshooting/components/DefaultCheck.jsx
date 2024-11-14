import React, { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';

const DefaultCheck = ({ onComplete, timeout = 5000 }) => {
  useEffect(() => {
    let timer; // Timer for non-accessibility flow
    let finishListener; // Listener reference

    const performCheck = async () => {
      try {
        const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();

        if (isScreenReaderEnabled) {
          AccessibilityInfo.announceForAccessibility("Let's start troubleshooting...");
          
          // Listener for when the announcement is completed
          finishListener = AccessibilityInfo.addEventListener(
            'announcementFinished',
            () => {
              onComplete();
              cleanupListener(); // Clean up the listener after completion
            }
          );
        } else {
          // Use timeout for non-accessibility mode
          timer = setTimeout(onComplete, timeout);
        }
      } catch (error) {
        console.error('Error checking Accessibility status:', error);
        onComplete(); // Proceed in case of failure
      }
    };

    const cleanupListener = () => {
      finishListener?.remove?.();
    };

    performCheck();

    return () => {
      if (timer) clearTimeout(timer); // Clean timeout if still active
      cleanupListener(); // Clean up accessibility listener if any
    };
  }, [onComplete, timeout]);

  return (
    <CheckStatusWrapper 
      loading={true} 
      result="Let's resolve your issues." 
      icon="TroubleshootIcon" 
      description="Performing a system check..."
      step={0}
    />
  );
};

export default DefaultCheck;