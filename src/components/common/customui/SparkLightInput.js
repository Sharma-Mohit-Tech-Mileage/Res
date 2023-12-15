import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../../GlobalStyles";

const SparkLightInput = ({ name, placeholder, value, onChangeText, style, accessibilityLabel, secure = false, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (text) => {
        if (onChangeText) {
            // Creating a synthetic event object
            const event = {
                target: {
                    name,
                    value: text,
                },
                preventDefault: () => { }, // Include this if needed
            };
            onChangeText(event);
        }
    };


    return (
        <View style={[styles.outerContainer, isFocused ? { borderColor: Color.sparklightBrightPurple } : {}, style]}>
            <View style={styles.container}>
                <TextInput
                    // placeholder={placeholder} // Uncomment this if placeholder is needed
                    value={value} // Controlled by the parent component
                    onChangeText={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={styles.textInput}
                    secureTextEntry={secure} 
                    accessibilityLabel={accessibilityLabel || placeholder}
                    accessibilityHint={`Input field for ${accessibilityLabel || placeholder}`}
                    importantForAccessibility="yes"
                    caretColor={Color.colorGray_100}
                    {...props}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        // Apply the border to this outer container instead
        marginTop: 8,
        height: 42, // Increase the height by the border width to keep input size
        borderColor: Color.sparklightDarkGray,
        borderWidth: 1,
        borderRadius: Border.br_11xs,
        justifyContent: 'center',
        overflow: 'hidden', // Ensures the child View conforms to this View's border radius
    },
    container: {
        height: 40,
        justifyContent: 'center',
    },
    textInput: {
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        paddingHorizontal: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
       
    },
});

export default SparkLightInput;
