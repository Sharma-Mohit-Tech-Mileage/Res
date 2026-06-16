import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { Border, Color, FontFamily, FontSize, Layout, Padding } from "../../../../GlobalStyles";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import EyeIcon from "../../../../assets/svgs/EyeIcon";
import EyeSlashIcon from "../../../../assets/svgs/EyeHide";
import Passwordlock from "../../../../assets/svgs/Passwordlock";
import MaskInput,{ formatWithMask,Masks  } from 'react-native-mask-input'
import { formatInputA11yReadout } from "../../../utils/a11y";
import Touchable from "./Touchable";

const MyPassIcon = (passwordVisible) => {
  return passwordVisible ? <EyeSlashIcon /> : <EyeIcon />;
};

const SparklightMobileInput = React.forwardRef(({
  name,
  label,
  placeholder,
  value,
  onChangeText,
  style,
  accessibilityLabel,
  accessibilityHint,
  secure = false,
  required = false,
  errorHint,
  error,
  editable = true,
  showTextIcon = false,
  inputStyle,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secure);
  const inputRef = React.useRef(null);
  const errorRef = React.useRef(null);
  const [keyboardHidden, setKeyboardHidden] = useState(true);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const { masked, unmasked, obfuscated } = formatWithMask({
  text: value,
  mask: Masks.USA_PHONE,
});

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardHidden(false);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHidden(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!keyboardHidden) {
      inputRef.current?.focus();
    }else{
      if(error){
        errorRef.current?.focus();
      }
    }
  }, [keyboardHidden]);

  // Auto-focus input when error appears (for accessibility)
  useEffect(() => {
    if (error && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [error]);

  const handleInputChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const getKeyboardType = () => {
    const lowerName = (name || placeholder || "").toLowerCase();
    if (lowerName.includes("phone") || lowerName.includes("mobile")) {
      return "phone-pad";
    }
    if (lowerName.includes("email")) {
      return "email-address";
    }
    if (secure) {
      return "default";
    }
    return "default";
  };

  return (
    <View
      style={[
        styles.outerContainer,
        style,
        error && styles.outerContainerError,
      ]}
    >
      <View style={styles.labelContainer}>
        {label && (
          <Text
            style={[styles.label, error && styles.errorLabel]}
            accessible={false}
            importantForAccessibility="no"
          >
            {label}
          </Text>
        )}
        {secure && (
          <Touchable
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
            accessibilityRole="button"
            accessible={true}
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
          >
            <View style={styles.eyeIcon}>{MyPassIcon(passwordVisible)}</View>
            <Text style={styles.eyeText}>
              {passwordVisible ? "Hide" : "Show"}
            </Text>
          </Touchable>
        )}
      </View>

      <View
        style={[
          styles.textInputContainer,
          {
            borderColor:
              isFocused && error != undefined
                ? "red"
                : isFocused
                ? Color.sparklightBrightPurple
                : Color.sparklightDarkGray,
          },
        ]}
      >
        {showTextIcon && (
          <View style={styles.lockIcon}>
            <Passwordlock />
          </View>
        )}

        <MaskInput
          placeholder={placeholder}
          value={ value}
          mask={['+1 (', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          maxLength={16}
          ref={inputRef}
          onChangeText={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          secureTextEntry={secure && !passwordVisible}
          style={[
            styles.textInput,
            inputStyle,
            !editable && styles.disabledInput,
            {
              borderWidth: error ? 0.5 : 0,
              borderColor: error
                ? "red"
                : isFocused
                ? Color.sparklightBrightPurple
                : Color.sparklightDarkGray,
            },
          ]}
          accessibilityLabel={formatInputA11yReadout({
            label: accessibilityLabel || label || placeholder,
            required,
            value: unmasked,
            isPhoneNumber: getKeyboardType() === "phone-pad",
            isSecure: secure,
          })}
          accessibilityHint={error ? `${errorHint || error}. Double tap to edit` : undefined}
          accessibilityRole="text"
          importantForAccessibility="yes"
          keyboardType={getKeyboardType()}
          returnKeyType="done"
          keyboardAppearance="default"
          maxFontSizeMultiplier={1.25}
          {...props}
        />
      </View>

      {error && (
        <View
          style={styles.errorContainer}
          ref={errorRef}
          accessible={true}
          accessibilityLabel={errorHint || error}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          <View
            style={styles.errorIcon}
            accessible={false}
            importantForAccessibility="no"
          >
            <WarningIcon />
          </View>
          <Text
            style={styles.errorText}
            accessible={false}
            importantForAccessibility="no"
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    minHeight: 48,
    borderColor: Color.sparklightWhite,
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    justifyContent: "center",
    position: "relative",
  },
  textInput: {
    height: 48,
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    borderRadius: Border.br_11xs,
    paddingHorizontal: 10,
    flex: 1,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorIcon: {
    width: 20,
    height: 20,
    marginRight: Padding.p_xs,
  },
  errorText: {
    color: "red",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  disabledInput: {
    backgroundColor: Color.Gray300,
    opacity: 1,
  },
  outerContainerError: {
    paddingBottom: 0,
  },
  label: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    marginBottom: Padding.p_5xs,
    alignSelf: "stretch",
  },
  errorLabel: {
    color: "red",
  },
  labelContainer: Layout.rowBetween,
  eyeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    marginHorizontal: 10,
  },
});

export default SparklightMobileInput;