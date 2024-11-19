import React, { useState } from 'react';
import { GetApiRequest } from "../../../../network/APIClient";
import moment from "moment";
import CheckStatusWrapper from './CheckStatusWrapper';

const AccountCheck = ({
  accountNumber,
  onComplete,
  setIssueDetected,
  setBillIssueDetected,
  step,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for account issues");
  const [issueDetected, setIsIssueDetected] = useState(false);
  const [description, setDescription] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const updateUIState = (data, startTime, isAccessibilityEnabled) => {
    const {
      resultText,
      descriptionText,
      hasIssue,
      hasBillIssue
    } = data;

    const updateState = () => {
      setResult(resultText);
      setDescription(descriptionText || "");
      setIsIssueDetected(hasIssue);
      setIssueDetected(hasIssue);
      if (hasBillIssue) {
        setBillIssueDetected(true);
      }
      setLoading(false);
      setIsFinished(true);
    };

    if (!isAccessibilityEnabled) {
      const elapsedTime = Date.now() - startTime;
      setTimeout(updateState, Math.max(10000 - elapsedTime, 0));
    } else {
      updateState();
    }
  };

  const handleAccountCheck = (response, startTime, isAccessibilityEnabled) => {
    if (moment(response.paymentDueDate).isAfter() || response.currentBalance <= 0) {
      updateUIState({
        resultText: "No account issues were detected.",
        hasIssue: false,
        hasBillIssue: false
      }, startTime, isAccessibilityEnabled);
    } else {
      updateUIState({
        resultText: "Pending balance detected on your account.",
        descriptionText: `Balance due: $${response.currentBalance}`,
        hasIssue: true,
        hasBillIssue: true
      }, startTime, isAccessibilityEnabled);
    }
  };

  const handleError = (startTime, isAccessibilityEnabled) => {
    updateUIState({
      resultText: "Error checking account status.",
      hasIssue: false,
      hasBillIssue: false
    }, startTime, isAccessibilityEnabled);
  };

  const performAccountCheck = async (isAccessibilityEnabled) => {
    const startTime = Date.now();
    const request = `account/api/account/${accountNumber}`;

    GetApiRequest(
      request,
      (response) => handleAccountCheck(response, startTime, isAccessibilityEnabled),
      () => handleError(startTime, isAccessibilityEnabled)
    );
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="WalletIcon"
      isIssueDetected={issueDetected}
      description={description}
      step={step}
      onComplete={onComplete}
      onMount={performAccountCheck}
      isFinished={isFinished}
    />
  );
};

export default AccountCheck;