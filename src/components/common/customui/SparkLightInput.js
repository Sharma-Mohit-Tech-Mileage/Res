import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../../GlobalStyles";
import WarningIcon from '../../../../assets/svgs/Alerttriangle';
import EyeIcon from '../../../../assets/svgs/EyeIcon';
import EyeSlashIcon from '../../../../assets/svgs/EyeHide';
import Passwordlock from '../../../../assets/svgs/Passwordlock';


const MyPassIcon = (passwordVisible) => {
  return passwordVisible ? <EyeSlashIcon/> : <EyeIcon />;
};
const SparkLightInput = ({
    name,
    label,
    placeholder,
    value,
    onChangeText,
    style,
    accessibilityLabel,
    secure = false,
    error,
    editable = true,
    showTextIcon = false,
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(!secure); // default to false if secure is true

    const handleInputChange = (text) => {
        if (onChangeText) {
            onChangeText(text)
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View style={[styles.outerContainer, style, error && styles.outerContainerError]}>
            <View style={styles.labelContainer}>
                {label && (
                    <Text style={[styles.label, error && styles.errorLabel]}>{label}</Text>
                )}
                {secure && (
                    <TouchableOpacity 
                    accessibilityLabel={passwordVisible ? 'Hide' : 'Show'}
                    accessibilityRole="button"
                    accessible={true}
                    onPress={togglePasswordVisibility} style={styles.eyeButton}>
                        <View style={styles.eyeIcon}>
                            {MyPassIcon(passwordVisible)}
                        </View>
                        {/* <Image
                            source={passwordVisible ? eyeSlashIcon : eyeIcon}
                            style={styles.eyeIcon}
                        /> */}
                        <Text style={styles.eyeText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={[styles.textInputContainer, {
                borderColor: isFocused && !error ? Color.sparklightBrightPurple : Color.sparklightDarkGray
            }]}>
                {showTextIcon &&
                <View style={styles.lockIcon}>
                    <Passwordlock/>
                </View>
                    // <Image style={styles.lockIcon} source={require('../../../../assets/password_lock.png')} />
                }

                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    editable={editable}
                    secureTextEntry={secure && !passwordVisible}
                    style={[
                        styles.textInput,
                        !editable && styles.disabledInput, inputStyle,
                        isFocused && !error && { borderColor: Color.sparklightBrightPurple },
                        error && { borderColor: 'red' },
                        !isFocused && !error && { borderColor: Color.sparklightDarkGray }
                    ]}
                    accessibilityLabel={accessibilityLabel || placeholder}
                    returnKeyType="done" // Set the return key type to "done"
                    keyboardAppearance="default" // Ensures the default keyboard appearance
                    maxFontSizeMultiplier={1.25}
                    {...props}
                />
            </View>
            {error && (
                <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                        <WarningIcon/>
                    </View>
                    {/* <Image source={warningIcon} style={styles.errorIcon} /> */}
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        minHeight: 48, // Use minHeight instead of height
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
        height: 48, // Keep the input field height
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        borderRadius: Border.br_11xs,
        paddingHorizontal: 10,
        flex: 1
    },
    textInputContainer: {
       // height: 48, // Keep the input field height
        color: Color.colorGray_200,
        borderWidth: 1,
        borderRadius: Border.br_11xs,
        flexDirection: "row",
        alignItems: "center"
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4, // Space between the input and the error message
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
    outerContainerError: {
        paddingBottom: 0, // Add padding to accommodate the error message
    },
    label: {
        fontSize: FontSize.size_sm,
        textAlign: "left",
        color: Color.sparklightGray1,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        marginBottom: Padding.p_5xs,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    errorLabel: {
        color: 'red', // Red color for the label when there's an error
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // If the label and eye button are not aligning correctly, adjust padding and margin here
    },
    eyeButton: {
        flexDirection: 'row', // Ensure flex direction is row
        alignItems: 'center', // Align items in the center vertically
        justifyContent: 'center', // Center the items horizontally
        // Adjust padding as needed for touch area and internal spacing
    },
    eyeIcon: {
        width: 15,
        height: 15,
    },
    eyeText: {
        marginLeft: 6,
        color: Color.colorMidnightblue,
        lineHeight: 28,
    },
    lockIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        marginHorizontal: 10
    }
});

export default SparkLightInput;
