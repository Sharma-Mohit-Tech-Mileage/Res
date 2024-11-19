import React, { useState } from 'react';
import { GetApiRequest, GetModemStatusApiRequest } from "../../../../network/APIClient";
import { useNavigation } from "@react-navigation/native";
import CheckStatusWrapper from './CheckStatusWrapper';

const ServiceCheck = ({ accountNumber, onComplete, step }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for service issues");
  const [issueDetected, setIssueDetected] = useState(false);
  const [description, setDescription] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const updateUIState = (data, startTime, isAccessibilityEnabled) => {
    const {
      resultText,
      descriptionText,
      hasIssue,
      navigateTo
    } = data;

    const updateState = () => {
      setResult(resultText);
      setDescription(descriptionText || "");
      setIssueDetected(hasIssue);
      setLoading(false);
      setIsFinished(true);
      setTimeout(() => {
        navigation.navigate(navigateTo, hasIssue ? { isError: true } : undefined);
      }, 3000);
    };



    if (!isAccessibilityEnabled) {
      const elapsedTime = Date.now() - startTime;
      setTimeout(updateState, Math.max(5000 - elapsedTime, 0));
    } else {
      updateState();
    }
  };
  const navigateToResult = (navigateTo, hasIssue) => {
   // setLoading(false);
    setTimeout(() => {
      navigation.navigate(navigateTo, hasIssue ? { isError: true } : undefined);
    }, 3000); // Adjust delay if needed
  };
  const handleSuccessResult = (startTime, isAccessibilityEnabled) => {
    navigateToResult("ModemHealthy", false);
  };

  const handleServiceIssueResult = (startTime, isAccessibilityEnabled) => {
    navigateToResult("ManageEquipment", true);
  };

  const handleErrorResult = (startTime, isAccessibilityEnabled) => {
    navigateToResult("ManageEquipment", true);
  };

  const analyzeAndUpdateModemStatus = (response, startTime, isAccessibilityEnabled) => {
    const statusMetrics = response.EquipmentType === "DOCSIS"
      ? [response.UTxP_State, response.URxL_State, response.USNR_State, response.DSNR_State, response.DRxL_State]
      : [response.ONUTP_State, response.OLTRP_State, response.ONURP_State];

    const hasIssues = statusMetrics.some((state) => state === "Red" || state === "Yellow");

    if (hasIssues) {
      handleServiceIssueResult(startTime, isAccessibilityEnabled);
    } else {
      handleSuccessResult(startTime, isAccessibilityEnabled);
    }
  };

  const checkModemHealth = (macAddress, startTime, isAccessibilityEnabled) => {
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;

    GetModemStatusApiRequest(
      request,
      (response) => {
        if (response?.Modem_State === "Online") {
          analyzeAndUpdateModemStatus(response, startTime, isAccessibilityEnabled);
        } else {
          handleServiceIssueResult(startTime, isAccessibilityEnabled);
        }
      },
      () => handleErrorResult(startTime, isAccessibilityEnabled)
    );
  };

  const fetchInternetPlanDetails = (isAccessibilityEnabled) => {
    const startTime = Date.now();
    const request = `internet/api/internet/${accountNumber}/plan`;

    GetApiRequest(
      request,
      (response) => {
        if (response?.length > 0) {
          let macAddress = response[0].macAddress;
          if (accountNumber === "128387263") macAddress = "bc:3e:07:38:56:d0";
          else if (accountNumber === "902880244") macAddress = "bc:3e:07:38:56:d0";
          else if (accountNumber === "902880236") macAddress = "28:7a:ee:8e:cf:8c";
          else if (accountNumber === "902880079") macAddress = "00:40:36:5f:cc:7f";
          else if (accountNumber === "136885142") macAddress = "20:73:55:89:c7:00";
          
          checkModemHealth(macAddress, startTime, isAccessibilityEnabled);
        } else {
          handleErrorResult(startTime, isAccessibilityEnabled);
        }
      },
      () => handleErrorResult(startTime, isAccessibilityEnabled)
    );
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="ServiceIcon"
      isIssueDetected={issueDetected}
      description={description}
      step={step}
      onComplete={onComplete}
      onMount={fetchInternetPlanDetails}
      isFinished={isFinished}
    />
  );
};

export default ServiceCheck;