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
import { Color,Padding,FontFamily,Border } from "../../../GlobalStyles";

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
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignSelf: "flex-start" ,alignItems:'center'}}>
              <AlertIcon />
              <Text style={styles.alertTitle}>{"App Update"}</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
          />
          <Text style={styles.message}>
            Looks like you have an older version of the app. To get latest
            features and best experience you'll need to update now
          </Text>
          <TouchableOpacity
            style={styles.closeBtn}
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
    width: "85%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    fontFamily: FontFamily.openSansRegular,
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    marginTop: 10,
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
    fontWeight: "400",
    marginLeft: 10,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default AppUpdateAlert;
