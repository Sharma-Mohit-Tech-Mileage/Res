import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from "react-native";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../styles/GlobalStyles";
import { A11Y } from "../../../styles/theme";
import { formatInputA11yReadout, setFocusToRef } from "../../../utils/a11y";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import EyeIcon from "../../../../assets/svgs/EyeIcon";
import EyeSlashIcon from "../../../../assets/svgs/EyeHide";
import Passwordlock from "../../../../assets/svgs/Passwordlock";
import Touchable from "./Touchable";
import {FieldTitle, Hyperlink} from "./Typography";

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
  revealValue = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secure);
  // 46381: long addresses are clipped by the field, so an eye toggle opens a popover under it showing the whole value.
  const [revealOpen, setRevealOpen] = useState(false);
  const inputRef = useRef(null);
  const fieldRef = useRef(null);
  const hasBlurred = useRef(false);
  const isFocusedRef = useRef(false);
  const valueRef = useRef(value);

  // Keep valueRef in sync with current value prop
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      hasBlurred.current = true;
      // Move the screen-reader cursor to the accessible wrapper (single node) so the field is read once; the live TextInput is hidden from a11y to avoid the double readout.
      setFocusToRef(fieldRef, { delay: 200 });
    },
  }));

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

    if (parentOnFocus) parentOnFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isFocusedRef.current = false;
    hasBlurred.current = true;
    // 46381: scroll a long value back to its start so the field shows the head of the address, not the tail.
    if (revealValue) inputRef.current?.setNativeProps({ selection: { start: 0, end: 0 } });

    if (parentOnBlur) parentOnBlur();
  };

  // Common input styles
  const getInputStyles = () => [
    styles.textInput,
    revealValue && { paddingRight: 52 },
    !editable && styles.disabledInput,
    error && { borderColor: "red" },
    !isFocused && !error && { borderColor: Color.sparklightGray1 },
  ];

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
          <View
            accessible={false}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          >
            <FieldTitle style={[styles.label, error && styles.errorLabel]}>
              {label}
            </FieldTitle>
          </View>
        )}
        {secure && (
          <Touchable
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
          >
            <View style={styles.eyeIcon}>{MyPassIcon(passwordVisible)}</View>
            <Hyperlink style={styles.eyeText}>
              {passwordVisible ? "Hide" : "Show"}
            </Hyperlink>
          </Touchable>
        )}
      </View>

      {/* Not accessible on purpose: inside the accessible field iOS merges the eye toggle into one element and VoiceOver cannot reach it. */}
      <View style={styles.fieldRow}>
        <View
          ref={fieldRef}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`${formatInputA11yReadout({
            label: accessibilityLabel || label || placeholder,
            required,
            value,
            isPhoneNumber: getKeyboardType() === "phone-pad",
            isSecure: secure,
            // The real TextInput is a11y-hidden, so iOS never auto-reads the value — compose it here.
            osAddsValue: false,
          })}${editable ? ", double tap to edit" : ""}`}
          accessibilityHint={error ? (errorHint || error) : undefined}
          importantForAccessibility="yes"
          style={[
            styles.textInputContainer,
            {
              borderColor:
                isFocused && error != undefined
                  ? "red"
                  : Color.sparklightGray1,
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
            style={getInputStyles()}
            accessible={false}
            importantForAccessibility="no"
            keyboardType={getKeyboardType()}
            returnKeyType="done"
            keyboardAppearance="default"
            maxFontSizeMultiplier={1.25}
            selection={revealValue && !isFocused ? { start: 0, end: 0 } : undefined}
            {...props}
          />
        </View>
        {revealValue && !!value && (
          <Touchable
            onPress={() => setRevealOpen(!revealOpen)}
            style={styles.revealEyeBtn}
            accessibilityRole="button"
            accessibilityState={{ expanded: revealOpen }}
            accessibilityLabel={revealOpen ? "Hide full email address" : "Show full email address"}
            accessibilityHint="Double tap to see the full email address"
          >
            {revealOpen ? <EyeSlashIcon /> : <EyeIcon />}
          </Touchable>
        )}
      </View>

      {revealValue && revealOpen && !!value && (
        <View style={styles.revealPopover} accessibilityLiveRegion="polite">
          <View style={styles.revealArrow} />
          <Text style={styles.revealText} selectable>
            {value}
          </Text>
        </View>
      )}

      {error && (
        <View
          style={styles.errorContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          accessibilityLiveRegion="none"
        >
          <View
            style={styles.errorIcon}
            accessible={false}
            importantForAccessibility="no"
          >
            <WarningIcon color={Color.sparkLightRed} />
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
    paddingHorizontal: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.sparklightWhite,
    borderColor:Color.inputBorder,
    width: "100%",
  },
  // 46381: eye toggle inside the field + popover beneath it.
  fieldRow: {
    position: "relative",
    justifyContent: "center",
  },
  revealEyeBtn: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  revealPopover: {
    marginTop: 8,
    backgroundColor: Color.sparklightWhite,
    borderWidth: 1,
    borderColor: Color.inputBorder,
    borderRadius: Border.br_5xs,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: Color.colorblack_100,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // little pointer up towards the eye toggle
  revealArrow: {
    position: "absolute",
    top: -6,
    right: 18,
    width: 10,
    height: 10,
    backgroundColor: Color.sparklightWhite,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Color.inputBorder,
    transform: [{ rotate: "45deg" }],
  },
  revealText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    flexWrap: "wrap",
  },
  textInputContainer: {
    borderWidth: 0,
    borderRadius: Border.br_5xs,

    borderColor: Color.inputBorder,
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorIcon: {
    width: 24,
    height: 24,
    marginRight: Padding.p_5xs,
  },
  errorText: {
    color: "red",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    flexShrink: 1,
  },
  disabledInput: {
    backgroundColor: Color.Gray300,
    opacity: 1,
  },
  outerContainerError: {
    paddingBottom: 0,
  },
  label: {
    textAlign: "left",
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
    lineHeight: 28,
    color: Color.sparklightPrimaryPurple,
    textDecorationLine: "underline",
    textDecorationColor: Color.sparklightPrimaryPurple,
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
});

export default SparkLightInput;
