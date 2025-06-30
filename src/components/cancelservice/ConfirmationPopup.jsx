import React from "react";
import { View, Text, StyleSheet, Pressable, Modal,TouchableOpacity } from "react-native";
import AppStyles from "../common/styles/AppStyles";
import {
  Color,
  Padding,
  FontFamily,
  FontSize,
  Border,
} from "../../../GlobalStyles";
import colors from "../../res/Colors";

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
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={{textAlign:'center',alignSelf:'center',fontFamily:FontFamily.openSansRegular, color:colors.sparklight_grey,fontSize:22,fontWeight:'500'}}> {title} </Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.openBtn}
            onPress={onAction}
            accessible={true}
            accessibilityLabel={onActionTxt}
            accessibilityRole="button"
          >
            <Text style={styles.openPortaltxt}>{onActionTxt}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessible={true}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text style={styles.closeAlertTxt}>Update Info</Text>
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
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
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
    fontFamily: FontFamily.openSansRegular,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: FontFamily.openSansRegular,
  },
});

export default ConfimationPopup;
