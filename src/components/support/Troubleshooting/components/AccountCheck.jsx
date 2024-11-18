import React, { useEffect, useState, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';
import { GetApiRequest } from "../../../../network/APIClient";
import moment from "moment";

// Keep existing calculateDelay for accessibility
const calculateDelay = (message) => {
  const wordCount = message.trim().split(/\s+/).length;
  const wordsPerMinute = 150;
  const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
  const baseDelay = wordCount * millisecondsPerWord;
  const minimumBuffer = 2000;
  const wordBuffer = wordCount * 200;
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

const AccountCheck = ({
  accountNumber,
  onComplete,
  setIssueDetected,
  setBillIssueDetected,
  step,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for account issues...");
  const [issueDetected, setIsIssueDetected] = useState(false);
  const isAnnouncingRef = useRef(false);
  const apiStartTimeRef = useRef(0);

  const handleAnnouncement = async (message, nextAction) => {
    const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    if (!isEnabled) {
      nextAction();
      return;
    }

    isAnnouncingRef.current = true;
    console.log(`Starting announcement: "${message}"`);
    AccessibilityInfo.announceForAccessibility(message);
    
    const delay = calculateDelay(message);
    setTimeout(() => {
      console.log(`Completed announcement: "${message}"`);
      isAnnouncingRef.current = false;
      nextAction();
    }, delay);
  };

  useEffect(() => {
    let mounted = true;

    const startCheck = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      
      if (isEnabled) {
        // Keep existing accessibility flow
        await handleAnnouncement(`Step ${step} of 3. Account verification starting.`, () => {
          handleAnnouncement("Beginning account status check", () => {
            handleAnnouncement(result, () => {
              if (mounted && !isAnnouncingRef.current) {
                performAccountCheck();
              }
            });
          });
        });
      } else {
        // Non-accessibility flow with fixed timing
        apiStartTimeRef.current = Date.now();
        performAccountCheck();
      }
    };

    startCheck();
    return () => { mounted = false; };
  }, []);

  const performAccountCheck = () => {
    const request = `account/api/account/${accountNumber}`;
    
    GetApiRequest(
      request,
      async (response) => {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (!isEnabled) {
          // Calculate remaining time to maintain 5-second total for API call
          const elapsedTime = Date.now() - apiStartTimeRef.current;
          const remainingTime = Math.max(0, 5000 - elapsedTime);

          setTimeout(() => {
            handleNonAccessibilityResult(response);
          }, remainingTime);
        } else {
          // Keep existing accessibility flow
          handleAccessibilityResult(response);
        }
      },
      async (error) => {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        if (!isEnabled) {
          const elapsedTime = Date.now() - apiStartTimeRef.current;
          const remainingTime = Math.max(0, 5000 - elapsedTime);

          setTimeout(() => {
            handleNonAccessibilityError();
          }, remainingTime);
        } else {
          handleAccessibilityError();
        }
      }
    );
  };

  const handleNonAccessibilityResult = (response) => {
    if (moment(response.paymentDueDate).isAfter() || response.currentBalance <= 0) {
      setResult("No account issues were detected.");
      setIsIssueDetected(false);
      setLoading(false);
      setTimeout(onComplete, 3000); // Show success for 3 seconds
    } else {
      setResult("Pending balance detected.");
      setBillIssueDetected(true);
      setIssueDetected(true);
      setIsIssueDetected(true);
      setLoading(false);
      setTimeout(onComplete, 3000); // Show result for 3 seconds
    }
  };

  const handleNonAccessibilityError = () => {
    setResult("Error checking account status.");
    setLoading(false);
    setTimeout(onComplete, 3000); // Show error for 3 seconds
  };

  // Keep existing accessibility handlers
  const handleAccessibilityResult = (response) => {
    if (moment(response.paymentDueDate).isAfter() || response.currentBalance <= 0) {
      const resultMessage = "No account issues were detected.";
      setResult(resultMessage);
      setIsIssueDetected(false);
      setLoading(false);
      
      handleAnnouncement(resultMessage, () => {
        handleAnnouncement("Account check complete. Moving to next step", onComplete);
      });
    } else {
      const resultMessage = "Pending balance detected on your account.";
      setResult(resultMessage);
      setBillIssueDetected(true);
      setIssueDetected(true);
      setIsIssueDetected(true);
      setLoading(false);
      
      handleAnnouncement(resultMessage, () => {
        handleAnnouncement("Account check complete. Moving to next step", onComplete);
      });
    }
  };

  const handleAccessibilityError = () => {
    const errorMessage = "Error checking account status. Please try again later.";
    setResult(errorMessage);
    setLoading(false);
    
    handleAnnouncement(errorMessage, () => {
      handleAnnouncement("Moving to next check due to error", onComplete);
    });
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="WalletIcon"
      isIssueDetected={issueDetected}
      step={step}
      accessible={true}
      accessibilityLabel={result}
      accessibilityRole="alert"
    />
  );
};

export default AccountCheck;