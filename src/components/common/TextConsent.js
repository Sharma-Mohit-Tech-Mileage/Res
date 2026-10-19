import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "./customui/Touchable";
import SparklightCheckBox from "./customui/SparklightCheckBox";
import { Hyperlink } from "./customui/Typography";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import { Color, FontFamily, FontSize } from "../../styles/GlobalStyles";
import { theme, A11Y } from "../../styles/theme";
import { SPARKLIGHT_URLS } from "../../constants/urls";
import { setFocusToRef } from "../../utils/a11y";
import {
  CONSENT_LABEL,
  CONSENT_ERROR,
  CONSENT_LABEL_WITH_ERROR,
  normalizePhoneDigits,
  isSamePhoneNumber,
  isCompletePhoneNumber,
} from "../../utils/textConsent";

export const openTextTerms = (navigation) =>
  navigation.navigate("ArticleWindowUtility", { url: SPARKLIGHT_URLS.textMessagingTerms, name: "Text Messaging Terms" });

export const openPrivacyPolicy = (navigation) =>
  navigation.navigate("ArticleWindowUtility", { url: SPARKLIGHT_URLS.sparklightPrivacyPolicy, name: "Privacy Policy" });

// Consent is needed when adding a number or when the saved number changes, and a tick only covers the number it was given for.
export const useTextConsent = ({ savedNumber, currentNumber, alwaysRequired = false }) => {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const checkedFor = useRef("");
  const checkboxRef = useRef(null);
  const required = alwaysRequired || !normalizePhoneDigits(savedNumber) || !isSamePhoneNumber(currentNumber, savedNumber);
  const currentDigits = normalizePhoneDigits(currentNumber);

  useEffect(() => {
    if (!required) {
      setChecked(false);
      setShowError(false);
    }
  }, [required]);

  useEffect(() => {
    if (!checked) return;
    if (isCompletePhoneNumber(checkedFor.current) && checkedFor.current !== currentDigits) {
      setChecked(false);
    } else if (!isCompletePhoneNumber(checkedFor.current)) {
      checkedFor.current = currentDigits;
    }
  }, [checked, currentDigits]);

  const onChange = useCallback(
    (value) => {
      checkedFor.current = value ? currentDigits : "";
      setChecked(value);
      if (value) setShowError(false);
    },
    [currentDigits]
  );

  // Pass focus: false when another field's error already owns screen-reader focus.
  const validate = useCallback(({ focus = true } = {}) => {
    if (!required || checked) return true;
    setShowError(true);
    // Focus only: a separate announcement gets cut off on iOS when focus moves.
    if (focus) setFocusToRef(checkboxRef, { delay: 400 });
    return false;
  }, [required, checked]);

  return { required, checked, onChange, showError, validate, checkboxRef };
};

// Only the checkbox and the two links are tappable; the rest of the sentence is plain text.
export const TextConsentCheckbox = ({ consent, navigation, style }) => {
  const { checked, onChange, showError, checkboxRef } = consent;
  const onAction = (event) => {
    if (event.nativeEvent.actionName === "viewTerms") openTextTerms(navigation);
    if (event.nativeEvent.actionName === "viewPrivacy") openPrivacyPolicy(navigation);
  };

  return (
    <View style={style}>
      <View style={styles.row}>
        <Touchable
          ref={checkboxRef}
          onPress={() => onChange(!checked)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!checked }}
          accessibilityLabel={showError ? CONSENT_LABEL_WITH_ERROR : CONSENT_LABEL}
          accessibilityActions={[
            { name: "viewTerms", label: "View Text Messaging Terms & Conditions" },
            { name: "viewPrivacy", label: "View Privacy Policy" },
          ]}
          onAccessibilityAction={onAction}
          style={styles.checkboxTarget}
          testID="textConsentCheckbox"
        >
          <SparklightCheckBox value={checked} disabled boxStyle={styles.box} />
        </Touchable>
        <View style={styles.labelBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={styles.label}>
            I agree to the{" "}
            <Hyperlink onPress={() => openTextTerms(navigation)} style={styles.inlineLink}>
              Text Messaging Terms & Conditions
            </Hyperlink>{" "}
            and{" "}
            <Hyperlink onPress={() => openPrivacyPolicy(navigation)} style={styles.inlineLink}>
              Privacy Policy
            </Hyperlink>
            .
          </Text>
        </View>
      </View>
      {showError && (
        <View style={styles.errorRow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <AlertIcon />
          <Text style={styles.errorText}>{CONSENT_ERROR}</Text>
        </View>
      )}
    </View>
  );
};

// Sentence line height; the 48dp checkbox target is centred on its first line.
const LABEL_LINE_HEIGHT = 24;
const TARGET_INSET = (A11Y.minTouch - LABEL_LINE_HEIGHT) / 2;

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  checkboxTarget: { width: A11Y.minTouch, height: A11Y.minTouch, justifyContent: "center", alignItems: "center" },
  box: { width: 16, height: 16, marginTop: 0, marginRight: 0 },
  // Inset lives on a wrapper: iOS link hit-testing ignores padding on the Text itself.
  labelBox: { flexShrink: 1, paddingVertical: TARGET_INSET },
  label: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    lineHeight: LABEL_LINE_HEIGHT,
    color: Color.sparklightGray1,
  },
  inlineLink: { lineHeight: LABEL_LINE_HEIGHT },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: theme.spacing.xs, marginLeft: TARGET_INSET },
  errorText: { flex: 1, marginLeft: theme.spacing.sm, color: Color.errorText, fontSize: FontSize.size_sm },
});
