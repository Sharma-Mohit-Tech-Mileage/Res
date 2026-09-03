import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import Touchable from "./customui/Touchable";
import colors from "../../res/Colors";
import { FontFamily } from "../../../GlobalStyles";
import WarningIcon from "../../../assets/svgs/Alerttriangle";

import logo from "../../../assets/sparklightlogo-01.png";
import ModalOverlay from "./customui/ModalOverlay";

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
      <ModalOverlay>
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
            <View style={{ width: 24, height: 24 }}>
              <WarningIcon />
            </View>
            <Text
              style={{
                color: colors.darkest_grey,
                textAlign: "center",
                marginLeft: 5,
                alignSelf: "center",
                fontWeight: "600",
                fontFamily: FontFamily.RadioCanadaSemiBold,
              }}
            >
              We're sorry!
            </Text>
          </View>
          <Text style={styles.message}>{msg2}</Text>

          <Touchable
            minSize={0}
            style={[styles.closeBtn, { alignItems: 'stretch' }]}
            accessibilityRole="button"
            onPress={onClose}
          >
            <Text style={styles.closeAlertTxt}>Close</Text>
          </Touchable>
        </View>
      </ModalOverlay>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "85%",
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 24,
    marginTop: 10,
  },
  alertTitle: {
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    borderRadius: 25,
    marginTop: 15,
  },
  closeAlertTxt: {
    color: colors.sparklight_bright_purple,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.RadioCanadaBold,
  },
});

export default CustomerDisconnectPage;
