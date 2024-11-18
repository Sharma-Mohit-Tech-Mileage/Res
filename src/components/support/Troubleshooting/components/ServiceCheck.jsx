import React, { useEffect, useState, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import CheckStatusWrapper from './CheckStatusWrapper';
import { GetApiRequest, GetModemStatusApiRequest } from "../../../../network/APIClient";

const calculateDelay = (message) => {
  const wordCount = message.trim().split(/\s+/).length;
  const wordsPerMinute = 150; // Slower speaking rate
  const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
  const baseDelay = wordCount * millisecondsPerWord;
  const buffer = 2000; // Fixed 2-second buffer
  const totalDelay = baseDelay + buffer;

  console.log(`
    Message: "${message}"
    Words: ${wordCount}
    Delay: ${totalDelay}ms
  `);

  return totalDelay;
};

const ServiceCheck = ({ accountNumber, onComplete, step }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Checking for service issues...");
  const [issueDetected, setIssueDetected] = useState(false);
  const isAnnouncingRef = useRef(false);
  const navigation = useNavigation();

  const handleAnnouncement = async (message, nextAction) => {
    const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    if (!isEnabled) {
      nextAction();
      return;
    }

    isAnnouncingRef.current = true;
    console.log('Announcing:', message);
    AccessibilityInfo.announceForAccessibility(message);
    
    const delay = calculateDelay(message);
    setTimeout(() => {
      isAnnouncingRef.current = false;
      nextAction();
    }, delay);
  };

  useEffect(() => {
    let mounted = true;

    const startCheck = async () => {
      await handleAnnouncement(`Step ${step} of 3`, () => {
        handleAnnouncement("Starting service check", () => {
          handleAnnouncement(result, () => {
            if (mounted && !isAnnouncingRef.current) {
              fetchInternetPlanDetails();
            }
          });
        });
      });
    };

    startCheck();
    return () => { mounted = false; };
  }, []);

  // All API-related functions remain exactly the same
  const fetchInternetPlanDetails = () => {
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
          handleErrorResult();
        }
      },
      () => {
        handleErrorResult();
      }
    );
  };

  const checkModemHealth = (macAddress) => {
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;

    GetModemStatusApiRequest(
      request,
      (response) => {
        if (response?.Modem_State === "Online") {
          analyzeAndUpdateModemStatus(response);
        } else {
          handleServiceIssueResult();
        }
      },
      () => {
        handleErrorResult();
      }
    );
  };

  const analyzeAndUpdateModemStatus = (response) => {
    const statusMetrics = response.EquipmentType === "DOCSIS"
      ? [response.UTxP_State, response.URxL_State, response.USNR_State, response.DSNR_State, response.DRxL_State]
      : [response.ONUTP_State, response.OLTRP_State, response.ONURP_State];

    const hasIssues = statusMetrics.some((state) => state === "Red" || state === "Yellow");

    if (hasIssues) {
      handleServiceIssueResult();
    } else {
      handleSuccessResult();
    }
  };

  const handleSuccessResult = () => {
    setResult("No service issues were detected.");
    setIssueDetected(false);
    setLoading(false);

    handleAnnouncement("No service issues were detected", () => {
      handleAnnouncement("Check complete. Proceeding to healthy status", () => {
        navigation.navigate("ModemHealthy");
        onComplete();
      });
    });
  };

  const handleServiceIssueResult = () => {
    setResult("Service issues were detected.");
    setIssueDetected(true);
    setLoading(false);

    handleAnnouncement("Service issues were detected", () => {
      handleAnnouncement("Check complete. Proceeding to equipment management", () => {
        navigation.navigate("ManageEquipment", { isError: true });
        onComplete();
      });
    });
  };

  const handleErrorResult = () => {
    setResult("Error checking service status.");
    setIssueDetected(true);
    setLoading(false);

    handleAnnouncement("Error checking service status", () => {
      handleAnnouncement("Check complete. Proceeding to equipment management", () => {
        navigation.navigate("ManageEquipment", { isError: true });
        onComplete();
      });
    });
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