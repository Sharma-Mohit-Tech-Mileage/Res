import React, { useState, useEffect, useCallback } from "react";
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
  const [standardtimeout, setStandardTimeout] = useState(2000);

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
          setTimeout(() => {
          console.log("checkModemOutagStatus", response);
          if (response.hasOutage === true) {
            let time = moment(response.estimatedTimeOfResolution).format("LT");
            setEstimatedRestoreTime(time);
            setOutageIssueDetected(true);
            setIssueDetected(true);
          } else {
            networkStatus[currentStep] = true;
            setKey(2);
              setCurrentStep(2);
          }
          setLoading(false);
        }, standardtimeout);
        }
      },
      (error) => {
        console.log(error);
        setTimeout(() => {
        if (error === 204) {
          networkStatus[currentStep] = true;
        } else {
          networkError[currentStep] = true;
        }
        setKey(2);
          setCurrentStep(2);
        setLoading(false);
      }
    );},  standardtimeout);
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
          setTimeout(() => {
          if(moment(res.paymentDueDate).isAfter()){
            networkStatus[currentStep] = true;
              setCurrentStep(3);
            setKey(3);
          }else
          if (res.currentBalance <= 0) {
            // Bill paide
            networkStatus[currentStep] = true;
              setCurrentStep(3);

            setKey(3);
          } else {
            // Bill Pending
            setIssueDetected(true);
            setBillIssueDetected(true);
          }
        setLoading(false);
        }, standardtimeout);
      }
      },
      (Error) => {
        setTimeout(() => {
        console.log("checkBillPaid error", Error);
        networkError[currentStep] = true;
        setKey(3);
          setCurrentStep(3);
        setLoading(false);
      }
    );}, standardtimeout);
  };

  const checkModemHealth = (macAddress) => {
    setLoading(true);
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;
    GetModemStatusApiRequest(
      request,
      (res) => {
        console.log("checkModemHealth", res);
        if (res) {
          if(res?.status){
            if(res.status===408){
              setIssueDetected(true);
              if(isFocused){
                setTimeout(() => {
                  navigation.navigate("ManageEquipment",{isError:true})
                }, standardtimeout);
              }
              return
            }
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
              console.log("checkModemHealth online", temt);
              updateModemStatus(temt);
            } else {
              if(isFocused){
                setTimeout(() => {
                  navigation.navigate("ManageEquipment")
                }, standardtimeout);
              }
            }
          } else if (res.EquipmentType === "ONU") {
            temt.push(res.ONUTP_State);
            temt.push(res.OLTRP_State);
            temt.push(res.ONURP_State);
            if (res.ONU_State === "Online") {
              updateModemStatus(temt);
            } else {
              if(isFocused){
                setTimeout(() => {
                  navigation.navigate("ManageEquipment")
                }, standardtimeout);
              }
            }
          }
          setLoading(false);
        }else{
          if(isFocused){
            setTimeout(() => {
              navigation.navigate("ManageEquipment")
            }, standardtimeout);
          }
        }
      },
      (error) => {
        console.log("Modem details Error1", error);
        console.log("Modem details Error", error);
        setIssueDetected(true);
        if(isFocused){
          setTimeout(() => {
            navigation.navigate("ManageEquipment",{isError:true})
          }, standardtimeout);
        }
        
        //networkError[currentStep] = true;
        setKey(3);
        setLoading(false);
        
      }
    );
  };
// Callback function to receive the timeout from TroubleshootComponent
const handleTimeoutReceived = useCallback((timeout) => {
  console.log('Timeout received from TroubleshootComponent:', timeout);
  setStandardTimeout(timeout);
}, []);
  const updateModemStatus = (temt) => {
    console.log("checkModemHealth", temt);
    const allGreen = temt.every((v) => v === "Green");
    console.log("modem status", allGreen);
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed || checkYellow) {
        setIssueDetected(true);
        if(isFocused){
          setTimeout(() => {
            navigation.navigate("ManageEquipment",{isError:true})
          }, standardtimeout);
        }
      } else {
        setIssueDetected(true);
        if(isFocused){
          setTimeout(() => {
            navigation.navigate("ManageEquipment",{isError:true})
          }, standardtimeout);
        }
      }
    } else {
      // modem health is good
      setIssueDetected(true);
      networkStatus[currentStep] = true;
      setKey(5);
      if(isFocused){
      setTimeout(() => {
        navigation.navigate("ModemHealthy");
      }, standardtimeout);
      }
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
            mac = "bc:3e:07:38:56:d0";
          }else if (user.userInfo.accountNumber === "902880244") {
            mac = "bc:3e:07:38:56:d0";  
          }else if (user.userInfo.accountNumber === "902880236") {
            mac = "28:7a:ee:8e:cf:8c";
          } else if (user.userInfo.accountNumber === "902880079") {
            mac = "00:40:36:5f:cc:7f";
          }
          else if(user.userInfo.accountNumber==='136885142'){
            mac="20:73:55:89:c7:00"
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
    }, standardtimeout);
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
    setTimeout(() => {
      startTroubleShooting();
    }, standardtimeout);
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
              onTimeoutReceived={handleTimeoutReceived} // Pass the callback to the child component
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
