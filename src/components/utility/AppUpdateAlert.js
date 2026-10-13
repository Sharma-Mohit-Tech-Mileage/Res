import React from "react";
import { Platform, Linking } from "react-native";
import AlertModal from "../common/AlertModal";

const AppUpdateAlert = ({ visible, onClose }) => {
  const handleUpdate = () => {
    Linking.openURL(
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=com.sparklight"
        : "https://apps.apple.com/app/6469003880"
    );
    onClose();
  };

  return (
    <AlertModal
      visible={visible}
      title="New Update Required"
      message="To continue using the MySparklight app, please download the latest version. Enjoy new features, improved performance, and enhanced security."
      onRequestClose={onClose}
      actions={[
        {
          action: "UPDATE",
          label: "Update Now",
          primary: true,
          accessibilityLabel: "Update the app now",
          accessibilityHint: "Opens the app store to update the app",
          onPress: handleUpdate,
        },
      ]}
    />
  );
};

export default AppUpdateAlert;
