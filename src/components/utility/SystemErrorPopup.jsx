import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
} from "react-native";
import colors from "../../res/Colors";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import Touchable from "../common/customui/Touchable";


const CustomerErrorPage = ({ visible, message,title ,onAction,onActionTxt, onClose }) => {
  

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
              <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                <View style={{alignSelf:'center'}}>
                <AlertIcon />
                </View>
               
                <Text
                  style={styles.alertTitle}
                >
                  {" "}
                  {title}
                </Text>
              </View>
              
            </View>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
            />
            <Text style={styles.message}>{message}</Text>
             <Touchable
              style={styles.openBtn}
              onPress={onAction}
              accessibilityLabel={onActionTxt}
            >
              <Text
                style={styles.openPortaltxt}
              >
               {onActionTxt}
              </Text>
            </Touchable>
           {onClose!=undefined && (
            <Touchable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityLabel="Cancel"
            >
              <Text
                style={styles.closeAlertTxt}
              >
                Cancel
              </Text>
            </Touchable>
           )}
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
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.RadioCanadaRegular,
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
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 22,
    textAlign:'center',
    fontWeight: "400",
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
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.RadioCanadaRegular,
  },
});

export default CustomerErrorPage;
