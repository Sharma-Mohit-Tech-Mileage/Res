import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Padding, Color, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
const SparkLightLoginButton = ({ onPress, buttonText,customStyle }) => {
    return (
        <Pressable
            style={[styles.buttons, styles.buttonsBg,customStyle]}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
        >
            <Text style={styles.buttonStyl}>{buttonText}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonsBg: {
        paddingHorizontal: Padding.p_base,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
    },
    buttons: {
        //marginLeft: 10,
        backgroundColor: Color.sparklight_yellow,
    },
    buttonStyl: {
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.darkest_grey,
        padding: 16,
        fontSize: 16,
    },
});

export default SparkLightLoginButton;
