import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, AccessibilityInfo, findNodeHandle } from "react-native";
import { useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import DefaultCheck from "../Troubleshooting/components/DefaultCheck";
import OutageCheck from "../Troubleshooting/components/OutageCheck";
import AccountCheck from "../Troubleshooting/components/AccountCheck";
import ServiceCheck from "../Troubleshooting/components/ServiceCheck";
import OutagesAlert from "./OutagesAlert";
import AccountOutages from "./AccountOutages";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { Color } from "../../../../GlobalStyles";

const steps = [
  { component: DefaultCheck, title: "Default Check" },
  { component: OutageCheck, title: "Outage Check" },
  { component: AccountCheck, title: "Account Check" },
  { component: ServiceCheck, title: "Service Check" },
];

const TroubleshootContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [issueDetected, setIssueDetected] = useState(false);
  const [outageIssueDetected, setOutageIssueDetected] = useState(false);
  const [billIssueDetected, setBillIssueDetected] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const focusRef = useRef(null);

  const user = useSelector((state) => state.combinedReducers.user.userData);
  const CurrentComponent = steps[currentStep].component;

  useEffect(() => {
    if (focusRef.current) {
      const node = findNodeHandle(focusRef.current);
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, [outageIssueDetected, billIssueDetected]);

  const handleNextStep = () => {
    if (issueDetected) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("All checks completed.");
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Troubleshooting" />
      <SafeAreaView style={styles.safeArea}>
        {outageIssueDetected ? (
          <OutagesAlert ref={focusRef} description={estimatedRestoreTime} />
        ) : billIssueDetected ? (
          <AccountOutages ref={focusRef} />
        ) : (
          <Animated.View
            key={currentStep}
            entering={SlideInRight.duration(500)}
            exiting={SlideOutLeft.duration(500)}
            style={styles.animatedContainer}
          >
            <CurrentComponent
              accountNumber={user?.userInfo?.accountNumber}
              onComplete={handleNextStep}
              setIssueDetected={setIssueDetected}
              setOutageIssueDetected={setOutageIssueDetected}
              setBillIssueDetected={setBillIssueDetected}
              setEstimatedRestoreTime={setEstimatedRestoreTime}
              step={currentStep}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  safeArea: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: hp("12.5%"),
    backgroundColor: Color.sparklightWhite,
  },
  animatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TroubleshootContainer;