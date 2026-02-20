import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  AccessibilityInfo
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
import useAccessibilityFocus from "../../../hooks/useAccessibilityFocus";

const MyPassIcon = (passwordVisible) => {
  return passwordVisible ? <EyeSlashIcon /> : <EyeIcon />;
};

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
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [errorFocus, setErrorFocus] = useAccessibilityFocus();

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };
    checkScreenReader();
  }, []);


  useEffect(() => {
      if (error && isScreenReaderEnabled) {
        // After the animation, set focus on the alert and re-announce for reliability (especially on Android)
        const t = setTimeout(() => {
          try {
            setErrorFocus();
            AccessibilityInfo.announceForAccessibility(error);
          } catch (e) {
            console.log("Accessibility focus error:", e);
          }
        }, 600);
  
        return () => clearTimeout(t);
        
      }
    }, [error, isScreenReaderEnabled]);
  

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

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
  // useEffect(() => {
  //   if (error && inputRef.current) {
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 150);
  //   }
  // }, [error]);

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


  /**
 * Formats input US number:
 * "+19876543210" → "+1 (987) 654-3210"
 * "9876543210"   → "(987) 654-3210"
 */
function formatUsPhone(input) {
  if (!input) return "";

  let digits = String(input).replace(/\D/g, ""); // keep numbers only
  let hasCountryCode = false;

  // Handle +1 or 1 prefix
  if (digits.length === 11 && digits.startsWith("1")) {
    hasCountryCode = true;
    digits = digits.slice(1); // remove country code
  }

  // Must be exactly 10 digits now
  if (digits.length !== 11) return input;

  const area = digits.substring(0, 3);
  const middle = digits.substring(3, 6);
  const last = digits.substring(6, 10);

  const formatted = `(${area}) ${middle}-${last}`;

  return hasCountryCode ? `+1 ${formatted}` : formatted;
}


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
            accessible={true}
            accessibilityLabel={accessibilityLabel}
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
          value={formatUsPhone(value)}
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
          accessibilityLabel={
            value && getKeyboardType() === "phone-pad"
              ? "Phone number " + numberToWordsForAccessibility(value)
              : secure
              ? "Password requirements are listed below. Use arrow keys to read them."
              : getAccessibilityLabel()
          }
          accessibilityRole="text"
          accessibilityHint={
            getKeyboardType() === "phone-pad"
              ? "Required text field. double tap to edit."
              : secure
              ? "secure text field, double tab to edit."
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
        <View style={styles.errorContainer} ref={errorRef}>
          <View
            style={styles.errorIcon}
            accessible={true}
            accessibilityLabel="Warning Icon"
          >
            <WarningIcon />
          </View>
          <Text
            style={styles.errorText}
            accessible={true}
            ref={errorFocus}
            accessibilityLabel={error}
            accessibilityRole="text"
            accessibilityHint="Please enter valid password"
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