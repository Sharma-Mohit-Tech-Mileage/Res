import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
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
import { A11Y } from "../../../styles/theme";
import { formatInputA11yReadout } from "../../../utils/a11y";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import EyeIcon from "../../../../assets/svgs/EyeIcon";
import EyeSlashIcon from "../../../../assets/svgs/EyeHide";
import Passwordlock from "../../../../assets/svgs/Passwordlock";
import Touchable from "./Touchable";

const MyPassIcon = (passwordVisible) => {
  return passwordVisible ? <EyeSlashIcon /> : <EyeIcon />;
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
  required = false,
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
      // Delay accessibility focus to allow re-render with error state
      setTimeout(() => {
        const handle = findNodeHandle(inputRef.current);
        if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
      }, 350);
    },
  }));

  // Announce error on transition from falsy to truthy
  useEffect(() => {
    const hadError = prevErrorRef.current;
    prevErrorRef.current = error;

    if (!error) {
      errorAnnouncedRef.current = false;
      return;
    }

    // Announce if error is new and field has been interacted with
    if (!hadError && error && hasBlurred.current) {
      const hint = errorHint || error;
      // Delay slightly to ensure the error view is rendered before announcing
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(hint);
      }, 150);
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

  const handleFocus = () => {
    setIsFocused(true);
    isFocusedRef.current = true;

    // Announce error on focus only if useEffect hasn't already (covers re-focus of an unannounced error).
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
      <View style={[styles.labelContainer, secure && styles.labelContainerSecure]}>
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
            onPress={togglePasswordVisibility}
            minSize={0}
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
          accessibilityLabel={formatInputA11yReadout({
            label: accessibilityLabel || label || placeholder,
            required,
            value,
            errorHint: error ? (errorHint || error) : undefined,
            isSecure: secure,
            isPhoneNumber: getKeyboardType() === "phone-pad",
          })}
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
  // Only password fields grow this row; non-password inputs unchanged.
  labelContainerSecure: {
    minHeight: A11Y.minTouch,
  },
  eyeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xs,
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
