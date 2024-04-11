import React, { useEffect } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import colors from "../../res/Colors";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import { Color, Padding, FontFamily, Border } from "../../../GlobalStyles";

const AppUpdateAlert = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <AlertIcon />
              <Text style={styles.alertTitle}>{"New Update Required"}</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
          />
          <Text style={{ ...styles.message, textAlign: 'center' }}>
            To continue using the MySparklight app, please download the latest version. Enjoy new features, improved performance, and enhanced security.
          </Text>
          <TouchableOpacity
            style={styles.closeBtn}
            accessibilityLabel="Update the app now"
            accessibilityHint="Opens the app store to update the app"
            onPress={() => {
              if (Platform.OS === "android") {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=com.sparklight"
                );
              } else {
                Linking.openURL(
                  "https://apps.apple.com/us/app/mysparklight/id6469003880"
                );
              }
              onClose();
            }}
          >
            <Text style={styles.closeAlertTxt}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: colors.sparklight_purple_blue,
    width: '100%',
    marginTop: 15,
    paddingVertical: 8,
  },
  closeAlertTxt: {
    color: colors.snow_white,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttons: {
    backgroundColor: Color.colorWhitesmoke_300,
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 50,
    width: "45%",
    marginTop: 20,
  },
  alertTitle: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },

});

export default AppUpdateAlert;
