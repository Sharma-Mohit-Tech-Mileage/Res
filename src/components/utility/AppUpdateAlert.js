import React from "react";
import {
  View,
  Platform,
  StyleSheet,
  Text,
  Modal,
  Linking,
} from "react-native";
import colors from "../../res/Colors";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import { Color, Padding, FontFamily, Border } from "../../../GlobalStyles";
import Touchable from "../common/customui/Touchable";
import { modalOverlay } from "../../styles/utilities";
import { MODAL_MAX_WIDTH } from "../../utils/responsive";


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
          <Touchable
            minSize={0}
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
                  "https://apps.apple.com/app/6469003880"
                );
              }
              onClose();
            }}
          >
            <Text style={styles.closeAlertTxt}>Update Now</Text>
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: modalOverlay,
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    maxWidth: MODAL_MAX_WIDTH,
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
  alertTitle: {
    color: colors.black,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },

});

export default AppUpdateAlert;
