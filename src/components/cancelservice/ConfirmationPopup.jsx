import React from "react";
import { Text, StyleSheet, Modal } from "react-native";;
import {
  Color,
  Padding,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import colors from "../../res/Colors";
import Touchable from "../common/customui/Touchable";
import ModalOverlay from "../common/customui/ModalOverlay";

const ConfimationPopup = ({
  visible,
  message,
  title,
  onAction,
  onActionTxt,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <View style={styles.alertContainer}>
          <Text style={{textAlign:'center',alignSelf:'center',fontFamily:FontFamily.RadioCanadaRegular, color:colors.sparklight_grey,fontSize:22,fontWeight:'500'}}> {title} </Text>
          <Text style={styles.message}>{message}</Text>
          <Touchable
            style={styles.openBtn}
            onPress={onAction}
            accessibilityLabel={onActionTxt}
          >
            <Text style={styles.openPortaltxt}>{onActionTxt}</Text>
          </Touchable>
          <Touchable
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Cancel"
          >
            <Text style={styles.closeAlertTxt}>Update Info</Text>
          </Touchable>
        </View>
      </ModalOverlay>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
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
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
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
    textAlign: "center",
    fontWeight: "400",
  },
  openBtn: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  closeBtn: {
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
    textDecorationLine: "underline",
    fontFamily: FontFamily.RadioCanadaRegular,
  },
});

export default ConfimationPopup;
