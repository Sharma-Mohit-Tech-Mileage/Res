import React, { useState } from 'react';
import { GetApiRequest } from "../../../../network/APIClient";
import moment from "moment";
import CheckStatusWrapper from './CheckStatusWrapper';

const OutageCheck = ({
  accountNumber,
  onComplete,
  setIssueDetected,
  setOutageIssueDetected,
  setEstimatedRestoreTime,
  step,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for outage in your area...");
  const [issueDetected, setIsIssueDetected] = useState(false);
  const [description, setDescription] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const handleOutageCheck = (response, startTime, isAccessibilityEnabled) => {
    const updateState = () => {
      if (response?.hasOutage) {
        const time = moment(response.estimatedTimeOfResolution).format("LT");
        setResult("Outage detected in your area.");
        setDescription(`Estimated restore time: ${time}`);
        setEstimatedRestoreTime(time);
        setOutageIssueDetected(true);
        setIssueDetected(true);
        setIsIssueDetected(true);
      } else {
        setResult("No outage were detected in your area...");
      }
      setLoading(false);
      setIsFinished(true);
    };

    if (!isAccessibilityEnabled) {
      const elapsedTime = Date.now() - startTime;
      setTimeout(updateState, Math.max(5000 - elapsedTime, 0));
    } else {
      updateState();
    }
  };

  const handleError = (startTime, isAccessibilityEnabled) => {
    const updateState = () => {
      setResult("Error fetching outage status.");
      setLoading(false);
      setIsFinished(true);
    };

    if (!isAccessibilityEnabled) {
      const elapsedTime = Date.now() - startTime;
      setTimeout(updateState, Math.max(5000 - elapsedTime, 0));
    } else {
      updateState();
    }
  };

  const performOutageCheck = async (isAccessibilityEnabled) => {
    const startTime = Date.now();
    const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${accountNumber}`;

    GetApiRequest(
      request,
      (response) => handleOutageCheck(response, startTime, isAccessibilityEnabled),
      () => handleError(startTime, isAccessibilityEnabled)
    );
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="OutageAreaIcon"
      isIssueDetected={issueDetected}
      description={description}
      step={step}
      onComplete={onComplete}
      onMount={performOutageCheck}
      isFinished={isFinished}
    />
  );
};

export default OutageCheck;