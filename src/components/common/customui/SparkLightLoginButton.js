import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Padding, Color, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
import { interaction } from "../../../styles/utilities";
import { A11Y } from "../../../styles/theme";
import Touchable from "./Touchable";
const SparkLightLoginButton = ({ onPress, buttonText,customStyle }) => {
    return (
        <Touchable
            style={({ pressed }) => [
                styles.buttons,
                styles.buttonsBg,
                customStyle,
                pressed && interaction.pressed,
            ]}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
        >
            <Text style={styles.buttonStyl}>{buttonText}</Text>
        </Touchable>
    );
};

const styles = StyleSheet.create({
    buttonsBg: {
        paddingHorizontal: Padding.p_base,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
    buttons: {
        backgroundColor: Color.sparklightWhite,
    },
    buttonStyl: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaBold,
    textAlign: "center",
    color: Color.sparklightBrightPurple,
    fontWeight:'700',
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_81xl, // Adjust as needed
    minHeight: A11Y.minTouch,
    justifyContent: "center",
    },
});

export default SparkLightLoginButton;
