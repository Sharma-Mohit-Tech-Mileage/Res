import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';
import { GetApiRequest } from "../../../../network/APIClient";
import moment from "moment";
const AccountCheck = ({
  accountNumber,
  onComplete,
  setIssueDetected,
  setBillIssueDetected,
  step,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for account issues..."); // Initial message
  const [issueDetected, setIsIssueDetected] = useState(false);
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      AccessibilityInfo.isScreenReaderEnabled().then((isEnabled) => {
        if (isEnabled) {
          AccessibilityInfo.announceForAccessibility(result);
          performAccountCheck(isEnabled);
        } else {
          performAccountCheck(false); // Normal flow
        }
      });
    }, 3000); // Wait for 3 seconds before starting the API call

    return () => clearTimeout(initialDelay); // Cleanup on unmount
  }, []);

  const performAccountCheck = async (isAccessibilityEnabled) => {
    const request = `account/api/account/${accountNumber}`;
    GetApiRequest(
      request,
      (response) => {
        if (moment(response.paymentDueDate).isAfter() || response.currentBalance <= 0) {
          // No account issues detected: either payment is not due yet or balance is zero
          setResult("No account issues were detected.");
          setIsIssueDetected(false); // Green wave
        } else {
          // Pending balance detected
          setResult("Pending balance detected.");
          setBillIssueDetected(true);
          setIssueDetected(true);
          setIsIssueDetected(true); // Red wave
        }
        setLoading(false);
        handlePostResult(isAccessibilityEnabled);
      },
      () => {
        setResult("Error fetching account status.");
        setLoading(false);
        handlePostResult(false); // Proceed even on error
      }
    );
  };

  const handlePostResult = (isAccessibilityEnabled) => {
    if (isAccessibilityEnabled) {
      const finishListener = AccessibilityInfo.addEventListener(
        'announcementFinished',
        () => {
          setTimeout(onComplete, 5000); // Wait 5 seconds after announcement
          finishListener.remove();
        }
      );
    } else {
      setTimeout(onComplete, 5000); // Standard 5-second wait in normal flow
    }
  };

  return <CheckStatusWrapper loading={loading} result={result} icon="WalletIcon" isIssueDetected={issueDetected} step={step}/>;
};

export default AccountCheck;