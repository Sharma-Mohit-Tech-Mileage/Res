import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import Touchable from "../../common/customui/Touchable";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { fetchAutoPayDetails } from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, formatCurrency, parseAmountInput } from "./paymentsShared";
import AppStyles from "../../../styles/AppStyles";
import { FieldTitle, FieldContent } from "../../common/customui/Typography";

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

  // Figma: selecting Automatic only switches the type; Continue routes to Auto Pay
  const onContinue = () => {
    if (paymentType === TYPE_AUTOMATIC) {
      navigation.navigate("AutoPay");
      return;
    }
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

  const onSelectCustom = () => {
    setAmountOption(AMOUNT_CUSTOM);
    amountInputRef.current?.focus();
  };

  const renderRadioRow = ({ key, label, amount, amountStyle, note, selected, onPress, trailing }) => (
    <Touchable
      key={key}
      style={[styles.optionRow, selected && styles.optionRowSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}${amount ? `, ${amount}` : ""}${note ? `, ${note}` : ""}`}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <View style={styles.optionTextWrap}>
        <FieldContent >{label}</FieldContent>
        {!!note && <FieldContent style={styles.optionNote}>{note}</FieldContent>}
      </View>
      {!!amount && <FieldContent style={[styles.optionAmount, amountStyle]}>{amount}</FieldContent>}
      {trailing}
    </Touchable>
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Billing Details" onPressBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[ contentMaxWidth]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <>
        <View style={[AppStyles.card, { margin: 16,padding: 24 }]}>
        {!!errorAlert && (
          <NotificationAlert
            type="error"
            title="Something went wrong"
            message={errorAlert}
            onClose={() => setErrorAlert("")}
            autoFocusTitle
          />
        )}

        <FieldTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Select payment type
        </FieldTitle>
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
                onPress={() => setPaymentType(type.key)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={type.label}
              >
                <View style={[styles.radioOuter, styles.typeRadio, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <FieldContent style={styles.typeLabel}>{type.label}</FieldContent>
              </Touchable>
            );
          })}
        </View>

        {paymentType === TYPE_ONE_TIME && (
          <>
            <FieldTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
              Select payment amount <FieldContent >(required)</FieldContent>
            </FieldTitle>
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
                    amount: formatCurrency(totalDue),
                    selected: amountOption === AMOUNT_TOTAL,
                    onPress: () => setAmountOption(AMOUNT_TOTAL),
                  })}
                {pastDue > 0 &&
                  renderRadioRow({
                    key: AMOUNT_PAST_DUE,
                    label: "Past due Balance",
                    amount: formatCurrency(pastDue),
                    amountStyle: styles.pastDueAmount,
                    note: `The amount of ${formatCurrency(
                      pastDue
                    )} is past due. Please make a payment to avoid service interruption.`,
                    selected: amountOption === AMOUNT_PAST_DUE,
                    onPress: () => setAmountOption(AMOUNT_PAST_DUE),
                  })}
                {renderRadioRow({
                  key: AMOUNT_CUSTOM,
                  label: "Other amount",
                  selected: amountOption === AMOUNT_CUSTOM,
                  onPress: onSelectCustom,
                  trailing: (
                    <TextInput
                      ref={amountInputRef}
                      style={styles.inlineAmountInput}
                      value={customAmount}
                      placeholder="$"
                      placeholderTextColor={Color.sparklightGray1}
                      keyboardType="decimal-pad"
                      accessibilityLabel="Payment amount, required"
                      accessibilityHint={amountError ? amountError : undefined}
                      onFocus={() => setAmountOption(AMOUNT_CUSTOM)}
                      onChangeText={(text) => {
                        setCustomAmount(text);
                        if (amountError) setAmountError("");
                      }}
                    />
                  ),
                })}
                {!!amountError && (
                  <Text style={styles.amountErrorText} accessibilityRole="alert">
                    {amountError}
                  </Text>
                )}
              </View>
            )}
          </>
        )}

        
        </View>
        {!loading && (
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
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
          </View>
        )}
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: {  padding: 16, paddingBottom: 80 },
  heading: {
    marginBottom: 12,
    marginTop: 8,
  },
  requiredMark: { fontFamily: FontFamily.RadioCanadaRegular, fontWeight: "400" },
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
  typeCardSelected: { borderWidth: 2, borderColor: Color.colorMidnightblue, backgroundColor: "#F3F2FF" },
  typeRadio: { marginRight: 8 },
  typeLabel: {
    flexShrink: 1,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  optionRowSelected: { borderWidth: 2, borderColor: Color.colorMidnightblue, backgroundColor: "#F3F2FF" },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.sparklightGray1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioOuterSelected: { borderColor: Color.colorMidnightblue },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Color.colorMidnightblue },
  optionTextWrap: { flex: 1, marginRight: 12 },
  optionLabel: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
  },
  optionAmount: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.colorGray_200,
  },
  pastDueAmount: { color: "#DC3626" },
  optionNote: {
    lineHeight: 20,
    marginTop: 4,
  },
  amountErrorText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: "#B92A1C",
    marginBottom: 12,
  },
  inlineAmountInput: {
    width: 126,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#767676",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
  },
  rowSkeleton: { height: 56, borderRadius: 8, marginBottom: 12 },
});

export default MakePaymentScreen;
