import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import colors from "../../res/Colors";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";
import warningIcon from "../../../assets/alert-triangle.png";

import logo from "../../../assets/sparklightlogo-01.png";

const CustomerDisconnectPage = ({ visible, onLogin, onClose }) => {
  const [msg1] = useState(
    "Sign in to pay your bill online, submit support tickets and much more."
  );
  const [msg2] = useState(
    "We apologize, but due to technical issues, we are unable to log you in at this time . Please call 1-877-692-2253 for further assistance."
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLogin}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={{ flexDirection: "column" }}>
            <Image
              source={logo}
              style={{ width: 200, height: 50, alignSelf: "center" }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.alertTitle}>Customer Login</Text>

          <Text style={[styles.message, { fontSize: 16 }]}>{msg1}</Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Image source={warningIcon} style={{ width: 24, height: 24 }} />
            <Text style={{ textAlign: "center", marginLeft: 5, alignSelf: "center", fontWeight: "600", fontFamily: FontFamily.openSansSemiBold, }} >
              We're sorry!
            </Text>
          </View>
          <Text style={styles.message}>{msg2}</Text>

          <TouchableOpacity style={styles.closeBtn} accessibilityRole="button" onPress={onClose}>
            <Text style={styles.closeAlertTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
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
    lineHeight: 24,
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
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
  },
  openBtn: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  openPortaltxt: {
    color: colors.snow_white,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default CustomerDisconnectPage;
