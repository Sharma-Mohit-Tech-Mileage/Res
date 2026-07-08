import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import Touchable from "../../common/customui/Touchable";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { fetchAutoPayDetails } from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, formatCurrency, parseAmountInput } from "./paymentsShared";

const TYPE_ONE_TIME = "oneTime";
const TYPE_AUTOMATIC = "automatic";
const AMOUNT_TOTAL = "total";
const AMOUNT_PAST_DUE = "pastDue";
const AMOUNT_CUSTOM = "custom";

// Figma: Make a Payment step 1 — payment type, then payment amount for one-time payments
const MakePaymentScreen = ({ navigation }) => {
  const [details, setDetails] = useState(null);
  const [paymentType, setPaymentType] = useState(TYPE_ONE_TIME);
  const [amountOption, setAmountOption] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const amountInputRef = useRef(null);
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      fetchAutoPayDetails(abortRef.current.signal)
        .then(setDetails)
        .catch(() => {
          setDetails({});
          setErrorAlert("We could not load your balance information. Please try again.");
        });
      return () => abortRef.current?.abort();
    }, [])
  );

  const loading = details === null;
  const totalDue = Number(details?.balanceDue) || 0;
  const pastDue = Number(details?.pastDueAmount) || 0;

  const resolveAmount = () => {
    if (amountOption === AMOUNT_TOTAL) return totalDue > 0 ? totalDue : null;
    if (amountOption === AMOUNT_PAST_DUE) return pastDue > 0 ? pastDue : null;
    if (amountOption === AMOUNT_CUSTOM) return parseAmountInput(customAmount);
    return null;
  };
  const canContinue = paymentType === TYPE_AUTOMATIC || resolveAmount() !== null;

  const onSelectType = (type) => {
    setPaymentType(type);
    if (type === TYPE_AUTOMATIC) navigation.navigate("AutoPay");
  };

  const onContinue = () => {
    const amount = resolveAmount();
    if (amount === null) {
      if (amountOption === AMOUNT_CUSTOM) {
        setAmountError("Enter an amount between $0.01 and $99,999.99.");
        amountInputRef.current?.focus();
      }
      return;
    }
    setAmountError("");
    navigation.navigate("MakePaymentMethod", { amount });
  };

  const renderRadioRow = ({ key, label, sublabel, note, selected, onPress, boxed }) => (
    <Touchable
      key={key}
      style={[styles.optionRow, boxed && styles.optionRowBoxed, selected && styles.optionRowSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}${sublabel ? `, ${sublabel}` : ""}${note ? `, ${note}` : ""}`}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <View style={styles.optionTextWrap}>
        <View style={styles.optionLabelRow}>
          <Text style={styles.optionLabel}>{label}</Text>
          {!!sublabel && <Text style={styles.optionAmount}>{sublabel}</Text>}
        </View>
        {!!note && <Text style={styles.optionNote}>{note}</Text>}
      </View>
    </Touchable>
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Billing Details" onPressBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
        {!!errorAlert && (
          <NotificationAlert
            type="error"
            title="Something went wrong"
            message={errorAlert}
            onClose={() => setErrorAlert("")}
            autoFocusTitle
          />
        )}

        <Text style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Select payment type
        </Text>
        <View style={styles.typeRow} accessibilityRole="radiogroup">
          {[
            { key: TYPE_ONE_TIME, label: "One-time payment" },
            { key: TYPE_AUTOMATIC, label: "Automatic payment" },
          ].map((type) => {
            const selected = paymentType === type.key;
            return (
              <Touchable
                key={type.key}
                style={[styles.typeCard, selected && styles.typeCardSelected]}
                onPress={() => onSelectType(type.key)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={type.label}
                accessibilityHint={type.key === TYPE_AUTOMATIC ? "Opens Auto Pay setup." : undefined}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.typeLabel}>{type.label}</Text>
              </Touchable>
            );
          })}
        </View>

        {paymentType === TYPE_ONE_TIME && (
          <>
            <Text style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
              Payment amount <Text style={styles.requiredMark}>(required)</Text>
            </Text>
            {loading ? (
              <SkeletonPlaceholder>
                <View style={styles.rowSkeleton} />
                <View style={styles.rowSkeleton} />
              </SkeletonPlaceholder>
            ) : (
              <View accessibilityRole="radiogroup">
                {totalDue > 0 &&
                  renderRadioRow({
                    key: AMOUNT_TOTAL,
                    label: "Total balance due",
                    sublabel: formatCurrency(totalDue),
                    selected: amountOption === AMOUNT_TOTAL,
                    onPress: () => setAmountOption(AMOUNT_TOTAL),
                    boxed: true,
                  })}
                {pastDue > 0 &&
                  renderRadioRow({
                    key: AMOUNT_PAST_DUE,
                    label: "Past due Balance",
                    sublabel: formatCurrency(pastDue),
                    note: `The amount of ${formatCurrency(
                      pastDue
                    )} is past due. Please make a payment to avoid service interruption.`,
                    selected: amountOption === AMOUNT_PAST_DUE,
                    onPress: () => setAmountOption(AMOUNT_PAST_DUE),
                    boxed: true,
                  })}
                {renderRadioRow({
                  key: AMOUNT_CUSTOM,
                  label: "Other amount",
                  selected: amountOption === AMOUNT_CUSTOM,
                  onPress: () => setAmountOption(AMOUNT_CUSTOM),
                  boxed: true,
                })}
                {amountOption === AMOUNT_CUSTOM && (
                  <SparkLightInput
                    ref={amountInputRef}
                    name="paymentAmount"
                    label="Payment amount (required)"
                    accessibilityLabel="Payment amount"
                    placeholder="$0.00"
                    value={customAmount}
                    required
                    keyboardType="decimal-pad"
                    onChangeText={(text) => {
                      setCustomAmount(text);
                      if (amountError) setAmountError("");
                    }}
                    error={amountError || undefined}
                    errorHint={amountError}
                    style={styles.customAmountInput}
                  />
                )}
              </View>
            )}

            <PrimaryButton
              title="Continue"
              buttonType="submit"
              disabled={!canContinue}
              accessibilityLabel="Continue"
              onPress={onContinue}
            />
            <PrimaryButton
              title="Cancel"
              buttonType="outline"
              accessibilityLabel="Cancel payment"
              onPress={() => navigation.popToTop()}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 80 },
  heading: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.colorGray_100,
    marginBottom: 12,
    marginTop: 8,
  },
  requiredMark: { fontFamily: FontFamily.openSansRegular, fontWeight: "400", color: Color.sparklightGray1 },
  typeRow: { flexDirection: "row", marginBottom: 12 },
  typeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginRight: 12,
  },
  typeCardSelected: { borderWidth: 2, borderColor: Color.colorMidnightblue, backgroundColor: "#3530910D" },
  typeLabel: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    flexShrink: 1,
  },
  optionRow: { flexDirection: "row", alignItems: "center", minHeight: 56 },
  optionRowBoxed: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  optionRowSelected: { borderWidth: 2, borderColor: Color.colorMidnightblue, backgroundColor: "#3530910D" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#98A2B3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioOuterSelected: { borderColor: Color.colorMidnightblue },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Color.colorMidnightblue },
  optionTextWrap: { flex: 1 },
  optionLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionLabel: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    flexShrink: 1,
    marginRight: 8,
  },
  optionAmount: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.colorGray_100,
  },
  optionNote: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansRegular,
    color: "#B92A1C",
    lineHeight: 18,
    marginTop: 4,
  },
  rowSkeleton: { height: 56, borderRadius: 8, marginBottom: 12 },
  customAmountInput: { marginBottom: 12 },
});

export default MakePaymentScreen;
