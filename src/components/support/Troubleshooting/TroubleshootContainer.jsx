import React, { useState, useEffect } from "react";
import AccountOutages from "./AccountOutages";
import OutagesAlert from "./OutagesAlert";
import TroubleshootComponent from "./TroubleshootComponent";
import { useNavigation } from "@react-navigation/native";
import ModemHealthy from "./ModemHealthy";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import {
  Color,
  Padding,
  Border,
  FontSize,
  FontFamily,
} from "../../../../GlobalStyles";
import { getUser } from "../../../redux/utils/LocalStorage";
import {
  GetApiRequest,
  GetModemStatusApiRequest,
} from "../../../network/APIClient";
import { useSelector } from "react-redux";
import moment from "moment";
import ModemConnectivityGuide from "./ModemConnectivityGuide";
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

  const user = useSelector((state) => state.combinedReducers.user.userData);
  const [currentStep, setCurrentStep] = useState(0);
  const [networkStatus, setNetworkStatus] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [networkError, setNetworkError] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [outageIssueDetected, setOutageIssueDetected] = useState(false);
  const [billIssueDetected, setBillIssueDetected] = useState(false);
  const [modemsIsueDetected, setModemIssueDetected] = useState(false);
  const [issueDetected, setIssueDetected] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(1);
  const [macAddress, setMacAddress] = useState("");

  /**
   * check Modem Outage status
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
            setTimeout(() => {
              setCurrentStep(2);
            }, 2000);
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
        setTimeout(() => {
          setCurrentStep(2);
        }, 2000);
        setLoading(false);
      }
    );
  };

  /**
   *  Check Bill paid status
   */
  const checkBillPaid = (accountNumber) => {
    setLoading(true);
    const request = `account/api/account/${accountNumber}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("checkBillPaid", res);
        if (res) {
          // if(res.currentCollectionStep=='Soft Disconnect'){
          //     // Soft disconnect

          //   }
          if (res.currentBalance <= 0) {
            // Bill paide
            networkStatus[currentStep] = true;
            setTimeout(() => {
              setCurrentStep(3);
            }, 2000);

            setKey(3);
          } else {
            // Bill Pending
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
        setTimeout(() => {
          setCurrentStep(3);
        }, 2000);
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

          if(res.status===408){
            navigation.navigate("ModemConnectivityGuide");
            return;
          }
          let temt = [];
          console.log("checkModemHealth", res.EquipmentType);
          if (res.equipmentType === "DOCSIS") {
            temt.push(res.uTxP_State);
            temt.push(res.uRxL_State);
            temt.push(res.usnR_State);
            temt.push(res.dsnR_State);
            temt.push(res.dRxL_State);

            if (res.modem_State === "Online") {
              console.log("checkModemHealth online", temt);
              updateModemStatus(temt);
            } else {
              navigation.navigate("ModemConnectivityGuide");
            }
          } else if (res.equipmentType === "ONU") {
            temt.push(res.OnutP_State);
            temt.push(res.OltrP_State);
            temt.push(res.OnurP_State);
            if (res.onU_State === "Online") {
              updateModemStatus(temt);
            } else {
              navigation.navigate("ModemConnectivityGuide");
            }
          }
          setLoading(false);
        }else{
          navigation.navigate("ModemConnectivityGuide");
        }
      },
      (error) => {
        navigation.navigate("ModemConnectivityGuide");
        console.log("Modem details", error);
        //networkError[currentStep] = true;
        setKey(3);
        setLoading(false);
        
      }
    );
  };

  const updateModemStatus = (temt) => {
    console.log("checkModemHealth", temt);
    const allGreen = temt.every((v) => v === "Green");
    console.log("modem status", allGreen);
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed || checkYellow) {
        // stepsData[currentStep].success = false;
        //setModemIssueDetected(true);
        setIssueDetected(true);
        navigation.navigate("ModemRebootScreen",{isError:true});;
      } else {
        //stepsData[currentStep].success = false;
        //setModemIssueDetected(true);
        setIssueDetected(true);
        navigation.navigate("ModemRebootScreen",{isError:true});
      }
    } else {
      // modem health is good
      setIssueDetected(true);
      networkStatus[currentStep] = true;
      setKey(5);
      navigation.navigate("ModemHealthy");
    }
  };

  /**
   * check plan details
   */
  const getInternetPlanDetails = () => {
    setLoading(true)
    const request = `internet/api/internet/${user.userInfo.accountNumber}/plan`;
    GetApiRequest(
      request,
      (response) => {
        if (response.length > 0) {
          let macAddress = response[0].macAddress;
          var mac = macAddress;
          if (user.userInfo.accountNumber === "128387263") {
            mac = "00:1d:d0:d4:f8:02";
          } else if (user.userInfo.accountNumber === "133370775") {
            mac = "0c:f8:93:09:2c:85";
          }
          else if(user.userInfo.accountNumber==='133437285'){
            mac="1c:ab:c0:18:a8:79"
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

  const startTroubleShooting = () => {
    setTimeout(() => {
      setCurrentStep(1);
    }, 4000);
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
    // const interval = setInterval(() => {
    //     setCurrentStep((prevStep) => (prevStep === 6 ? 1 : prevStep + 1));
    // }, 4000);

    // return () => clearInterval(interval);
    startTroubleShooting();
  }, []);

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
        <>
          {!issueDetected && (
            <TroubleshootComponent
              key={key}
              step={currentStep}
              item={step}
              success={networkStatus[currentStep]}
              pageCount={step.pageCount}
              loading={loading}
              isError={networkError[currentStep]}
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
        </>
      </SafeAreaView>
    </View>
  );
};

export default TroubleshootContainer;
