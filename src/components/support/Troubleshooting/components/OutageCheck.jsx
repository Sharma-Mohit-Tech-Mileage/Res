import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';
import { GetApiRequest } from "../../../../network/APIClient";
import moment from "moment";
const OutageCheck = ({
  accountNumber,
  onComplete,
  setIssueDetected,
  setOutageIssueDetected,
  setEstimatedRestoreTime,
  step,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for outage in your area..."); // Initial message
  const [issueDetected, setIsIssueDetected] = useState(false);
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      AccessibilityInfo.isScreenReaderEnabled().then((isEnabled) => {
        if (isEnabled) {
          AccessibilityInfo.announceForAccessibility(result);
          performOutageCheck(isEnabled);
        } else {
          performOutageCheck(false); // Normal flow
        }
      });
    }, 3000); // Wait 3 seconds to display initial message

    return () => clearTimeout(initialDelay); // Cleanup on unmount
  }, []);

  const performOutageCheck = async (isAccessibilityEnabled) => {
    const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${accountNumber}`;
    GetApiRequest(
      request,
      (response) => {
        if (response?.hasOutage) {
          let time = moment(response.estimatedTimeOfResolution).format("LT");
          setResult("Outage detected in your area.");
          setEstimatedRestoreTime(time);
          setOutageIssueDetected(true);
          setIssueDetected(true);
          setIsIssueDetected(true);
        } else {
          setResult("No outage were detected in your area...");
        }
        setLoading(false);
        handlePostResult(isAccessibilityEnabled);
      },
      () => {
        setResult("Error fetching outage status.");
        setLoading(false);
        handlePostResult(false); // Error still moves forward after 5s
      }
    );
  };

  const handlePostResult = (isAccessibilityEnabled) => {
    if (isAccessibilityEnabled) {
      const finishListener = AccessibilityInfo.addEventListener(
        'announcementFinished',
        () => {
          setTimeout(onComplete, 5000); // 5 seconds after announcement
          finishListener.remove();
        }
      );
    } else {
      setTimeout(onComplete, 5000); // Standard 5-second wait in normal flow
    }
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="OutageAreaIcon"
      isIssueDetected={issueDetected}
      step={step}
    />
  );
};

export default OutageCheck;