import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, AccessibilityInfo, findNodeHandle, BackHandler, Modal, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [issueDetected, setIssueDetected] = useState(false);
  const [outageIssueDetected, setOutageIssueDetected] = useState(false);
  const [billIssueDetected, setBillIssueDetected] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [isCheckingFrozen, setIsCheckingFrozen] = useState(false);
  const focusRef = useRef(null);
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const CurrentComponent = steps[currentStep].component;

  useEffect(() => {
    const backAction = () => {
      if (!showExitModal) {
        handleBackPress();
        return true;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [showExitModal]);

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

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        onPressBack={handleBackPress}
      />
      <SafeAreaView style={styles.safeArea}>
        {outageIssueDetected ? (
          <OutagesAlert description={estimatedRestoreTime} />
        ) : billIssueDetected ? (
          <AccountOutages />
        ) : (
          <Animated.View
            key={currentStep}
            entering={SlideInRight.duration(500)}
            exiting={SlideOutLeft.duration(500)}
            style={styles.animatedContainer}
            pointerEvents={isCheckingFrozen ? 'none' : 'auto'}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: 8,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Color.colorGray_200,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: Color.colorGray_100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  continueButton: {
    backgroundColor: Color.colorMidnightblue,
  },
  exitButton: {
    backgroundColor: Color.sparkLightRed,
  },
  buttonText: {
    color: Color.sparklightWhite,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default TroubleshootContainer;