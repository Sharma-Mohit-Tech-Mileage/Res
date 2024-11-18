import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';

const DefaultCheck = ({ onComplete, step }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Let's resolve your issues.");

  const calculateDelay = (message) => {
    // Calculate base delay from word count
    const wordCount = message.trim().split(/\s+/).length;
    const wordsPerMinute = 150; // Slower speaking rate (was 180)
    const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
    const baseDelay = wordCount * millisecondsPerWord;

    // Add buffer time
    const minimumBuffer = 2000; // Minimum 2 second buffer
    const wordBuffer = wordCount * 200; // Additional buffer based on word count
    const totalBuffer = Math.max(minimumBuffer, wordBuffer);

    const totalDelay = Math.round(baseDelay + totalBuffer);
    
    console.log(`
      Announcement: "${message}"
      Word Count: ${wordCount}
      Base Delay: ${baseDelay}ms
      Buffer Added: ${totalBuffer}ms
      Total Delay: ${totalDelay}ms
    `);

    return totalDelay;
  };

  const makeAnnouncement = (message) => {
    return new Promise((resolve) => {
      console.log(`Starting announcement: "${message}"`);
      AccessibilityInfo.announceForAccessibility(message);
      
      const delay = calculateDelay(message);
      console.log(`Waiting ${delay}ms before next announcement`);
      
      setTimeout(() => {
        console.log(`Completed announcement: "${message}"`);
        resolve();
      }, delay);
    });
  };

  useEffect(() => {
    const startCheck = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();

      if (isEnabled) {
        console.log('Starting VoiceOver flow');
        try {
          // Step announcement with more context
          await makeAnnouncement(`Step ${step} of 3. Starting troubleshooting.`);
          // Initial message
          await makeAnnouncement(result);
          
          // Perform check
          console.log('Starting check process');
          setTimeout(async () => {
            onComplete();
          }, 2000);

        } catch (error) {
          console.error('Error in accessibility flow:', error);
          onComplete(); // Fallback
        }
      } else {
        // Normal flow remains unchanged
        console.log('Starting normal flow');
        setTimeout(() => {
          setTimeout(onComplete, 5000);
        }, 5000);
      }
    };

    startCheck();
  }, []);

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="TroubleshootIcon"
      description="Performing a system check..."
      step={step}
    />
  );
};

export default DefaultCheck;