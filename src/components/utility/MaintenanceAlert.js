import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaintenaceIcon from "../../res/svgIcons/MaintenanceIcon";
import AppStyles from "../common/styles/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";
import { Color,Padding,
  FontFamily, FontSize, Border
 } from "../../../GlobalStyles";


const MaintenanceAlert = ({
  navigation,
  message = "Our app is currently undergoing scheduled maintenance and will be temporarily unavailable. Thanks for your patience as we work to improve your experience.",
  onClose,
  buttonText = "OK",
}) => {
  return (
    <View style={{ flexDirection: "column", margin: 8 }}>
      <View style={[AppStyles.card, { margin: 16 }]}>
        <View style={styles.errorContainer}>
          <MaintenaceIcon color="red" size={24} style={{ marginBottom: 8 }} />
          <Text style={styles.errorTxt}>
            {message}
          </Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: Color.colorMidnightblue },
          styles.buttonsLayout,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => {     
          navigation.goBack();
        }}
        accessibilityRole="button"
        accessibilityLabel="Return to previous screen"
      >
        <Text style={[styles.makePayment, styles.makeTypo]}>
          {buttonText}
        </Text>
      </Pressable>
      <View style={styles.buttonsParent}>
        <SecondaryButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Cancel"
          accessibilityHint="Double tap to return to the previous screen"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },buttonsLayout: {
      paddingHorizontal: 0,
      marginHorizontal:16,
      marginTop:16,
      paddingVertical: Padding.p_base,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Border.br_11xs,
      height: 56,
    },
    makeTypo: {
      width: 282,
      fontFamily: FontFamily.openSansRegular,
      fontSize: FontSize.size_base,
      textAlign: "center",
    },makePayment: {
      color: Color.sparklightWhite,
      width: 282,
    },
    buttons1: {
      marginTop: Padding.p_base,
      backgroundColor: Color.colorWhitesmoke_200,
      paddingHorizontal: 0,
      width: 382,
    },
    buttonsParent: {
      marginTop: Padding.p_base,
      alignSelf: "stretch",
    },errorTxt: {
        color: "#001321",
        fontSize: FontSize.size_base,
        fontWeight: "400",
        fontFamily: FontFamily.openSansRegular,
        marginTop: 8,
      },
});

export default MaintenanceAlert;
