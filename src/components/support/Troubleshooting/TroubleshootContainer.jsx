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
import { GetApiRequest } from "../../../network/APIClient";
import { useSelector } from 'react-redux';
const stepsData = [
  {
    title: "Let's resolve your issues.",
    description: "Performing a system check...",
    resultMsg:'',
    success: false,
    pageCount: 0,
  },
  {
    title: "Checking for outages in your area...",
    resultMsg:'No outages were detected in your area...',
    description: null,
    success: false,
    pageCount: 1,
  },
  {
    title: "Checking for account issues...",
    resultMsg:'No account issues were detected.',
    description: null,
    success: false,
    pageCount: 2,
  },
  {
    title: "Checking for service issues...",
    resultMsg:'No service issues were detected.',
    description: null,
    success: false,
    pageCount: 3,
  },
];

const TroubleshootContainer = () => {
  const navigation = useNavigation();

  const user = useSelector(state => state.combinedReducers.user.userData);
  const [currentStep, setCurrentStep] = useState(0);
  const [networkStatus, setNetworkStatus] = useState([false,false,false,false]);

  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(1);

  /**
   * check Modem Outage status
   */
  const checkModemOutagStatus = () => {
    getUser().then((res) => {
      setLoading(true);
      const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (response) => {
          console.log("checkModemOutagStatus", response);
          if (response.hasOutage === true) {
            networkStatus[currentStep]=false
          } else {
            networkStatus[currentStep]=true
            setKey(2)
          }
          setLoading(false);
          setTimeout(() => {
            setCurrentStep(2);
          }, 2000);
        },
        (error) => {
          console.log(error);
        }
      );
    });
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
            if(res.currentBalance<=0){
                // Bill paide
                console.log("checkBillPaid", "res");
                networkStatus[currentStep]=true
                setKey(3)
               }else{
                 // Bill Pending
                 networkStatus[currentStep]=false
               }

        }
        setLoading(false);
        
        setTimeout(() => {
         setCurrentStep(3);
          checkModemHealth("ac:db:48:21:f2:21");
        }, 2000);
      },
      (Error) => {}
    );
  };

  const checkModemHealth = (macAddress) => {
    setLoading(true);
    const request = `mobile/api/modem/getmodemdetails?macId=${macAddress}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("checkModemHealth", res);
        if (res) {
          let temt = [];
          if (res.equipmentType === "DOCSIS") {
            temt.push(res.uTxP_State);
            temt.push(res.uRxL_State);
            temt.push(res.usnR_State);
            temt.push(res.dsnR_State);
            temt.push(res.dRxL_State);
            updateModemStatus(temt);
          } else if (res.equipmentType === "ONU") {
            temt.push(res.onutP_State);
            temt.push(res.oltrP_State);
            temt.push(res.onurP_State);
            updateModemStatus(temt);
          }
          setLoading(false);
        }
      },
      (error) => {
        console.log("Modem details", error);
      }
    );
  };

  const updateModemStatus = (temt) => {
    const allGreen = temt.every((v) => v === "Green");
    console.log("modem status", allGreen);
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed) {
        stepsData[currentStep].success=false
      } else if (checkYellow) {
        stepsData[currentStep].success=false
      }
    } else {
      // modem health is good
      networkStatus[currentStep]=true
      setKey(5)
    }
  };

  const startTroubleShooting = () => {
    
    setTimeout(() => {
    setCurrentStep(1);
    }, 4000);
  };

  useEffect(() => {
    if(currentStep===1){
        checkModemOutagStatus();
    }
    if(currentStep===2){
        checkBillPaid(user.userInfo.accountNumber);
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
  console.log('Success',networkStatus)

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
        <TroubleshootComponent
          key={key} 
          step={currentStep}
          title={step.title}
          description={step.description}
          resultMsg={step.resultMsg}
          success={networkStatus[currentStep]}
          pageCount={step.pageCount}
          loading={loading}
        />
      </SafeAreaView>
      {/* <ScrollView contentContainerStyle={{ flex: 1 }} style={{ marginBottom: "15%", paddingHorizontal: Padding.p_base, paddingTop: Padding.p_5xl }}>
                <ModemHealthy
                    step={currentStep}
                    title={'No service issues were detected.'}
                    description={null}
                    success={true}
                    pageCount={3}
                />
            </ScrollView> */}
    </View>
  );
};

export default TroubleshootContainer;
