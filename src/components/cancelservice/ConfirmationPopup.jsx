import React from "react";
import { View, Text, StyleSheet,Modal,TouchableOpacity } from "react-native";
import {
  Color,
  Padding,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import colors from "../../res/Colors";
import { modalOverlay } from "../../styles/utilities";
import { MODAL_MAX_WIDTH } from "../../utils/responsive";


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
  overlay: modalOverlay,
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "85%",
    maxWidth: MODAL_MAX_WIDTH,
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
