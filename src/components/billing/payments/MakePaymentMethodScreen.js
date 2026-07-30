import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import Touchable from "../../common/customui/Touchable";
import PaymentMethodCard from "./PaymentMethodCard";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { Color, FontFamily, FontSize, Border } from "../../../../GlobalStyles";
import { SectionTitle } from "../../common/customui/Typography";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
} from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, isMethodExpired, openOrbipayPaymentExecution } from "./paymentsShared";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MakePaymentMethodScreen = ({ navigation, route }) => {
  const amount = Number(route.params?.amount) || 0;
  const headerTitle = route.params?.headerTitle || "Make a Payment";
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef(null);
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const flash = route.params?.paymentFlash;
      if (flash?.message) {
        setErrorAlert(flash.message);
        navigation.setParams({ paymentFlash: undefined });
      }
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setMethods(list);
          setAutoPay(details);
          setEmail((prev) => prev || details.email || "");
          setSelectedId((prev) => prev || list.find((m) => m.isDefault && !isMethodExpired(m))?.id || "");
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setErrorAlert("We could not load your payment methods. Please try again.");
        });
      return () => abortRef.current?.abort();
    }, [route.params?.paymentFlash, navigation])
  );

  const loading = methods === null;
  const selectedMethod = methods?.find((m) => m.id === selectedId) || null;
  const canContinue = !!selectedMethod && !isMethodExpired(selectedMethod);
  const isAutoPayLinked = (method) => !!autoPay?.enrolled && !!method.id && method.id === autoPay?.paymentMethodId;

  const needsEmailEntry = !loading && !autoPay?.email;

  const onPayWithNewMethod = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    openOrbipayPaymentExecution(navigation, { amount, headerTitle, email: email.trim() });
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} autoFocusBack />
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

        <SectionTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Select payment method
        </SectionTitle>

        {loading ? (
          <SkeletonPlaceholder>
            <View style={styles.cardSkeleton} />
            <View style={styles.cardSkeleton} />
          </SkeletonPlaceholder>
        ) : methods.length === 0 ? (
          <Text style={styles.emptyText}>You have no saved payment methods yet. Add one to continue.</Text>
        ) : (
          <View accessibilityRole="radiogroup">
            {methods.map((method, index) => (
              <PaymentMethodCard
                key={method.id || index}
                method={method}
                variant="radio"
                selected={method.id === selectedId}
                onPress={() => setSelectedId(method.id)}
                showAutoPayBadge={isAutoPayLinked(method)}
                positionLabel={`${index + 1} of ${methods.length}`}
              />
            ))}
          </View>
        )}

        {!loading && (
          <>
            {needsEmailEntry && (
              <SparkLightInput
                ref={emailRef}
                name="email"
                label="Email Address (required)"
                accessibilityLabel="Email Address"
                placeholder="Email Address"
                value={email}
                required
                error={emailError}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                accessibilityHint="A payment confirmation email will be sent to this address."
              />
            )}
            <Touchable
              onPress={onPayWithNewMethod}
              accessibilityRole="button"
              accessibilityLabel="Pay with new payment method"
              accessibilityHint="Opens a secure page to add a card or bank account."
              style={styles.newMethodCard}
            >
              <Text style={styles.newMethodText}>Pay with new payment method</Text>
            </Touchable>
            <PrimaryButton
              title="Continue"
              buttonType="submit"
              disabled={!canContinue}
              accessibilityLabel="Continue"
              onPress={() => canContinue && navigation.navigate("MakePaymentReview", { amount, methodId: selectedId, headerTitle })}
            />
            <PrimaryButton
              title="Cancel"
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
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 12,
  },
  cardSkeleton: { height: 92, borderRadius: 15, marginBottom: 12 },
  emptyText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
    marginBottom: 12,
  },
  newMethodCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: Border.br_81xl,
    borderWidth: 1,
    borderColor: Color.colorMidnightblue,
    padding: 16,
    marginTop: 4,
  },
  newMethodText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.sparklightPrimaryPurple,
  },
});

export default MakePaymentMethodScreen;
