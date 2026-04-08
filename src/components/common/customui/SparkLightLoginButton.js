import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Padding, Color, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
const SparkLightLoginButton = ({ onPress, buttonText,customStyle }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.buttons,
                styles.buttonsBg,
                customStyle,
                pressed && styles.pressed,
            ]}
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
        backgroundColor: Color.sparklight_yellow,
    },
    buttonStyl: {
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        fontWeight:'700',
        color: Color.colorGray_200,
        padding: 16,
        fontSize: 18,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
});

export default SparkLightLoginButton;
