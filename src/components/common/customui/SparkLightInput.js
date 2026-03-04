import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../../GlobalStyles";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import EyeIcon from "../../../../assets/svgs/EyeIcon";
import EyeSlashIcon from "../../../../assets/svgs/EyeHide";
import Passwordlock from "../../../../assets/svgs/Passwordlock";

const MyPassIcon = (passwordVisible) => {
  return passwordVisible ? <EyeSlashIcon /> : <EyeIcon />;
};

// Convert numbers into words for TalkBack accessibility (Android only)
const numberToWordsForAccessibility = (numStr) => {
  if (!numStr) return "";
  const digitsMap = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  };
  return numStr
    .split("")
    .map((digit) => digitsMap[digit] || digit)
    .join(" ");
};

const SparkLightInput = React.forwardRef(({
  name,
  label,
  placeholder,
  value,
  onChangeText,
  style,
  accessibilityLabel,
  accessibilityHint,
  secure = false,
  error,
  errorHint,
  editable = true,
  showTextIcon = false,
  inputStyle,
  onBlur: parentOnBlur,
  onFocus: parentOnFocus,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secure);
  const inputRef = useRef(null);
  const hasBlurred = useRef(false);
  const isFocusedRef = useRef(false);
  const prevErrorRef = useRef(error);
  const valueRef = useRef(value);
  const errorAnnouncedRef = useRef(false);

  // Keep valueRef in sync with current value prop
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      hasBlurred.current = true;
      inputRef.current?.focus();
      // Workaround: secureTextEntry may clear text on programmatic focus
      if (secure && valueRef.current) {
        const currentValue = valueRef.current;
        setTimeout(() => {
          inputRef.current?.setNativeProps({ text: currentValue });
        }, 50);
      }
      setTimeout(() => {
        const handle = findNodeHandle(inputRef.current);
        if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
      }, 100);
    },
  }));

  // Announce error on transition from falsy to truthy (after blur, not during focus)
  useEffect(() => {
    const hadError = prevErrorRef.current;
    prevErrorRef.current = error;

    if (!error) {
      errorAnnouncedRef.current = false;
      return;
    }

    if (!hadError && error && hasBlurred.current && !isFocusedRef.current) {
      const hint = errorHint || error;
      AccessibilityInfo.announceForAccessibility(hint);
      errorAnnouncedRef.current = true;
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

  // Auto-detect keyboard type based on field name/placeholder
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

  // Accessibility label handling
  const getAccessibilityLabel = () => {
    if (
      Platform.OS === "android" &&
      getKeyboardType() === "phone-pad" &&
      value
    ) {
      return numberToWordsForAccessibility(value);
    }
    return accessibilityLabel || label || placeholder;
  };

  const handleFocus = () => {
    setIsFocused(true);
    isFocusedRef.current = true;

    // Announce error on focus only if useEffect hasn't already announced it.
    // This covers the submit-validation flow where useEffect is blocked by isFocusedRef.
    if (error && hasBlurred.current && !errorAnnouncedRef.current) {
      setTimeout(() => {
        const hint = errorHint || error;
        AccessibilityInfo.announceForAccessibility(hint);
      }, 500);
    }

    if (parentOnFocus) parentOnFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isFocusedRef.current = false;
    hasBlurred.current = true;

    if (parentOnBlur) parentOnBlur();
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
          <TouchableOpacity
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
          </TouchableOpacity>
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

        <TextInput
          placeholder={placeholder}
          value={value}
          ref={inputRef}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          accessibilityLabel={
            value && getKeyboardType() === "phone-pad"
              ? `${label || "Phone number"} field}`
              : error
              ? (errorHint || error)
              : getAccessibilityLabel()
          }
          accessibilityRole="text"
          accessibilityHint={
            getKeyboardType() === "phone-pad"
              ? "Required text field. double tap to edit."
              : accessibilityHint
          }
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
          accessible={true}
          accessibilityLabel={errorHint || error}
          accessibilityRole="text"
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
  container: {
    height: 40,
    justifyContent: "center",
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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

export default SparkLightInput;
