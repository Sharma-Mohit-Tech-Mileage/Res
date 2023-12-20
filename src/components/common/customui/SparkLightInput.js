import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image } from 'react-native';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../../GlobalStyles";
import warningIcon from '../../../../assets/alertTriangle.png';

const SparkLightInput = ({ name, placeholder, value, onChangeText, style, accessibilityLabel, secure = false, error, editable = true, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (text) => {
        if (onChangeText) {
            onChangeText({ target: { name, value: text } });
        }
    };


    return (
        <View style={[styles.outerContainer, style]}>

            <TextInput
                //placeholder={placeholder}
                value={value}
                onChangeText={handleInputChange}  // Updated to use handleInputChange
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={editable}
                style={[
                    styles.textInput,
                    !editable && styles.disabledInput,
                    isFocused && !error && { borderColor: Color.sparklightBrightPurple },
                    error && { borderColor: 'red' },
                    !isFocused && !error && { borderColor: Color.sparklightDarkGray } // Revert to default border color when not focused and no error
                ]}
                secureTextEntry={secure}
                accessibilityLabel={accessibilityLabel || placeholder}
                {...props}
            />
            {error && (
                <View style={styles.errorContainer}>
                    <Image source={warningIcon} style={styles.errorIcon} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 8,
        height: 48, // Adjusted height to accommodate the error text
        borderColor: Color.sparklightWhite,
        borderWidth: 1,
        borderRadius: Border.br_11xs,
        justifyContent: 'center',
        position: 'relative', // For absolute positioning of the error text
    },
    container: {
        height: 40, // Keep the input field height
        justifyContent: 'center',
    },
    textInput: {
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        paddingHorizontal: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        borderWidth: 1,
        borderRadius: Border.br_11xs,
    },

    errorContainer: {
        position: 'absolute', // Use absolute positioning
        bottom: -24, // Position below the input field
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorIcon: {
        width: 20,
        height: 20,
        marginRight: Padding.p_xs,
    },
    errorText: {
        color: 'red',
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
    },
    disabledInput: {
        backgroundColor: Color.Gray300, // Light gray background
        opacity: 1, // Make it look faded
    },

});

export default SparkLightInput;
