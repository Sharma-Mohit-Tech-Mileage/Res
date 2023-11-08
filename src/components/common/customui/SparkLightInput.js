import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../../GlobalStyles";

const SparkLightInput = ({ placeholder, onChangeText, style, accessibilityLabel, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    const handleInputChange = (text) => {
        setValue(text);
        if (onChangeText) onChangeText(text);
    };

    return (
        <View style={[styles.container, isFocused ? { borderColor: Color.sparklightBrightPurple } : {}, style]}>
            <TextInput
                placeholder={placeholder}
                value={"value"}
                onChangeText={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.textInput}
                accessibilityLabel={accessibilityLabel || placeholder}
                accessibilityHint={`Input field for ${accessibilityLabel || placeholder}`}
                importantForAccessibility="yes"
                caretColor={Color.colorGray_100} // Explicitly set the caret color
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        paddingVertical: Padding.p_5xs,
        paddingHorizontal: Padding.p_xs,
        height: 40,
        borderColor: Color.colorGray_100,
        borderWidth: 1,
        borderRadius: Border.br_11xs,
        justifyContent: 'center',
    },
    textInput: {
        color: Color.colorGray_100,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        flex: 1,
    },
});

export default SparkLightInput;
