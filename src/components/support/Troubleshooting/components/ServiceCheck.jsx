import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';
import { GetApiRequest, GetModemStatusApiRequest } from "../../../../network/APIClient";
import { useNavigation } from "@react-navigation/native";

const ServiceCheck = ({ accountNumber, onComplete ,step}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for service issues...");
  const [issueDetected, setIssueDetected] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      fetchInternetPlanDetails(); // Start sequential checks
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  const fetchInternetPlanDetails = async () => {
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

          checkModemHealth(macAddress);
        } else {
          navigateBasedOnResult(true); // Treat as an error
        }
      },
      () => {
        setLoading(false);
        navigateBasedOnResult(true); // Treat as an error
      }
    );
  };

  const checkModemHealth = async (macAddress) => {
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;

    GetModemStatusApiRequest(
      request,
      (response) => {
        if (response?.Modem_State === "Online") {
          analyzeAndUpdateModemStatus(response);
        } else {
          setResult("Service issues were detected.");
          setIssueDetected(true);
          navigateBasedOnResult(true);
        }
      },
      () => {
        setResult("Error checking modem health.");
        setLoading(false);
        navigateBasedOnResult(true);
      }
    );
  };

  const analyzeAndUpdateModemStatus = (response) => {
    const statusMetrics = response.EquipmentType === "DOCSIS"
      ? [response.UTxP_State, response.URxL_State, response.USNR_State, response.DSNR_State, response.DRxL_State]
      : [response.ONUTP_State, response.OLTRP_State, response.ONURP_State];

    const hasIssues = statusMetrics.some((state) => state === "Red" || state === "Yellow");

    if (hasIssues) {
      setResult("Service issues were detected.");
      setIssueDetected(true);
      navigateBasedOnResult(true);
    } else {
      setResult("No service issues were detected.");
      setIssueDetected(false);
      navigateBasedOnResult(false);
    }

    setLoading(false);
  };

  const navigateBasedOnResult = (isError) => {
    AccessibilityInfo.isScreenReaderEnabled().then((isEnabled) => {
      if (isEnabled) {
        AccessibilityInfo.announceForAccessibility(result);
        const finishListener = AccessibilityInfo.addEventListener(
          'announcementFinished',
          () => {
            proceedNavigation(isError);
            finishListener.remove();
          }
        );
      } else {
        setTimeout(() => {
          proceedNavigation(isError);
        }, 5000); // Wait for 5 seconds before navigating
      }
    });
  };

  const proceedNavigation = (isError) => {
    if (isError || issueDetected) {
      navigation.navigate("ManageEquipment", { isError: true });
    } else {
      navigation.navigate("ModemHealthy");
    }
    onComplete(); // Signal completion of the step
  };

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="ServiceIcon"
      isIssueDetected={issueDetected}
      step={step}
    />
  );
};

export default ServiceCheck;