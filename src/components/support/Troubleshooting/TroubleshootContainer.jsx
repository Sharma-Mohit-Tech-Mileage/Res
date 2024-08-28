import React, { useState, useEffect } from "react";
import { AccessibilityInfo } from "react-native";  // Import AccessibilityInfo
import AccountOutages from "./AccountOutages";
import OutagesAlert from "./OutagesAlert";
import TroubleshootComponent from "./TroubleshootComponent";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { View, SafeAreaView } from "react-native";
import { Color, Padding } from "../../../../GlobalStyles";
import { GetApiRequest, GetModemStatusApiRequest } from "../../../network/APIClient";
import { useSelector } from "react-redux";
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';

const stepsData = [
  {
    title: "Let's resolve your issues.",
    description: "Performing a system check...",
    resultMsg: "",
    errorMsg: "Uh oh. Looks like there is a server error.",
    success: false,
    pageCount: 0,
  },
  {
    title: "Checking for outages in your area...",
    resultMsg: "No outages were detected in your area...",
    errorMsg: "Uh oh. Looks like there is a server error.",
    description: null,
    success: false,
    pageCount: 1,
  },
  {
    title: "Checking for account issues...",
    resultMsg: "No account issues were detected.",
    errorMsg: "Uh oh. Looks like there is a server error.",
    description: null,
    success: false,
    pageCount: 2,
  },
  {
    title: "Checking for service issues...",
    resultMsg: "No service issues were detected.",
    errorMsg: "Uh oh. Looks like there is a server error.",
    description: null,
    success: false,
    pageCount: 3,
  },
];

const TroubleshootContainer = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const [currentStep, setCurrentStep] = useState(0);
  const [networkStatus, setNetworkStatus] = useState([false, false, false, false]);
  const [networkError, setNetworkError] = useState([false, false, false, false]);
  const [outageIssueDetected, setOutageIssueDetected] = useState(false);
  const [billIssueDetected, setBillIssueDetected] = useState(false);
  const [issueDetected, setIssueDetected] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(1);
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  /**
   * Checks if screen reader is enabled and adjusts the logic accordingly
   */
  useEffect(() => {
    const checkAccessibility = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
      setIsReadingComplete(!enabled); // Set as complete if screen reader is off
    };

    checkAccessibility();

    const accessibilityChangeListener = AccessibilityInfo.addEventListener(
      'change',
      (enabled) => {
        setIsScreenReaderEnabled(enabled);
        setIsReadingComplete(!enabled); // Update based on screen reader state
      }
    );

    return () => {
      accessibilityChangeListener.remove();
    };
  }, []);

  /**
   * Proceeds to the next step if the screen reader has finished reading
   */
  const proceedToNextStep = () => {
    if (!isScreenReaderEnabled || isReadingComplete) {
      setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
        setIsReadingComplete(false); // Reset for the next step
      }, 2000);
    }
  };

  /**
   * Triggers Modem Outage status check
   */
  const checkModemOutagStatus = () => {
    setLoading(true);
    const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${user.userInfo.accountNumber}`;
    GetApiRequest(
      request,
      (response) => {
        if (response) {
          console.log("checkModemOutagStatus", response);
          if (response.hasOutage === true) {
            let time = moment(response.estimatedTimeOfResolution).format("LT");
            setEstimatedRestoreTime(time);
            setOutageIssueDetected(true);
            setIssueDetected(true);
          } else {
            networkStatus[currentStep] = true;
            setKey(2);
            proceedToNextStep();
          }
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        if (error === 204) {
          networkStatus[currentStep] = true;
        } else {
          networkError[currentStep] = true;
        }
        setKey(2);
        proceedToNextStep();
        setLoading(false);
      }
    );
  };

  /**
   * Triggers Bill paid status check
   */
  const checkBillPaid = (accountNumber) => {
    setLoading(true);
    const request = `account/api/account/${accountNumber}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("checkBillPaid", res);
        if (res) {
          if (moment(res.paymentDueDate).isAfter()) {
            networkStatus[currentStep] = true;
            setKey(3);
            proceedToNextStep();
          } else if (res.currentBalance <= 0) {
            networkStatus[currentStep] = true;
            setKey(3);
            proceedToNextStep();
          } else {
            setIssueDetected(true);
            setBillIssueDetected(true);
          }
        }
        setLoading(false);
      },
      (Error) => {
        console.log("checkBillPaid error", Error);
        networkError[currentStep] = true;
        setKey(3);
        proceedToNextStep();
        setLoading(false);
      }
    );
  };

  const checkModemHealth = (macAddress) => {
    setLoading(true);
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;
    GetModemStatusApiRequest(
      request,
      (res) => {
        console.log("checkModemHealth", res);
        if (res) {
          if (res?.status && res.status === 408) {
            setIssueDetected(true);
            if (isFocused) {
              navigation.navigate("ManageEquipment", { isError: true });
            }
            return;
          }

          let temt = [];
          console.log("checkModemHealth", res.EquipmentType);
          if (res.EquipmentType === "DOCSIS") {
            temt.push(res.UTxP_State);
            temt.push(res.URxL_State);
            temt.push(res.USNR_State);
            temt.push(res.DSNR_State);
            temt.push(res.DRxL_State);
            if (res.Modem_State === "Online") {
              updateModemStatus(temt);
            } else if (isFocused) {
              navigation.navigate("ManageEquipment");
            }
          } else if (res.EquipmentType === "ONU") {
            temt.push(res.ONUTP_State);
            temt.push(res.OLTRP_State);
            temt.push(res.ONURP_State);
            if (res.ONU_State === "Online") {
              updateModemStatus(temt);
            } else if (isFocused) {
              navigation.navigate("ManageEquipment");
            }
          }
          setLoading(false);
        } else if (isFocused) {
          navigation.navigate("ManageEquipment");
        }
      },
      (error) => {
        console.log("Modem details Error1", error);
        setIssueDetected(true);
        if (isFocused) {
          navigation.navigate("ManageEquipment", { isError: true });
        }
        setKey(3);
        setLoading(false);
      }
    );
  };

  const updateModemStatus = (temt) => {
    console.log("checkModemHealth", temt);
    const allGreen = temt.every((v) => v === "Green");
    if (!allGreen) {
      if (temt.includes("Yellow") || temt.includes("Red")) {
        setIssueDetected(true);
        if (isFocused) {
          navigation.navigate("ManageEquipment", { isError: true });
        }
      } else if (isFocused) {
        navigation.navigate("ManageEquipment", { isError: true });
      }
    } else {
      networkStatus[currentStep] = true;
      setKey(5);
      if (isFocused) {
        navigation.navigate("ModemHealthy");
      }
    }
  };

  /**
   * Triggers plan details check
   */
  const getInternetPlanDetails = () => {
    setLoading(true);
    const request = `internet/api/internet/${user.userInfo.accountNumber}/plan`;
    GetApiRequest(
      request,
      (response) => {
        if (response.length > 0) {
          let macAddress = response[0].macAddress;
          var mac = macAddress;
          switch (user.userInfo.accountNumber) {
            case "128387263":
            case "902880244":
              mac = "bc:3e:07:38:56:d0";
              break;
            case "902880236":
              mac = "28:7a:ee:8e:cf:8c";
              break;
            case "902880079":
              mac = "00:40:36:5f:cc:7f";
              break;
            case '136885142':
              mac = "20:73:55:89:c7:00";
              break;
            default:
              break;
          }
          checkModemHealth(mac);
        }
      },
      (error) => {
        console.log("error", error);
        networkError[currentStep] = true;
        setKey(3);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (currentStep === 1) {
      checkModemOutagStatus();
    }
    if (currentStep === 2) {
      checkBillPaid(user.userInfo.accountNumber);
    }
    if (currentStep === 3) {
      getInternetPlanDetails();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isReadingComplete) {
      proceedToNextStep();
    }
  }, [isReadingComplete]);

  const step = stepsData[currentStep];

  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        onPressBack={() => navigation.goBack()}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: Padding.p_base,
          paddingVertical: Padding.p_5xl,
          marginBottom: "15%",
        }}
      >
        {!issueDetected && (
          <TroubleshootComponent
            key={key}
            step={currentStep}
            item={step}
            success={networkStatus[currentStep]}
            pageCount={step.pageCount}
            loading={loading}
            isError={networkError[currentStep]}
            setIsReadingComplete={setIsReadingComplete}
          />
        )}
        {outageIssueDetected && (
          <OutagesAlert
            step={currentStep}
            title={""}
            description={estimatedRestoreTime}
            success={true}
            pageCount={step.pageCount}
          />
        )}
        {billIssueDetected && (
          <AccountOutages
            step={currentStep}
            title={""}
            description={estimatedRestoreTime}
            success={true}
            pageCount={step.pageCount}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default TroubleshootContainer;
