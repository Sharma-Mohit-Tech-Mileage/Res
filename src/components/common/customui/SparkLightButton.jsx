import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Padding, Color, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
const SparkLightButton = ({ onPress, buttonText }) => {
    return (
        <Pressable
            style={[styles.buttons, styles.buttonsBg]}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
        >
            <Text style={styles.makePayment}>{buttonText}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonsBg: {
        paddingHorizontal: Padding.p_base,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
    },
    buttons: {
        marginLeft: 10,
        backgroundColor: Color.colorMidnightblue,
    },
    makePayment: {
        fontSize: FontSize.size_xs,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
});

export default SparkLightButton;
