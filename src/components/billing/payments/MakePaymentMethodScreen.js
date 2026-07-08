import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PaymentMethodCard from "./PaymentMethodCard";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  addDemoPaymentMethod,
  isDemoPaymentData,
} from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, isMethodExpired, openOrbipaySecureCapture } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

// Figma: Make a Payment step 2 — pick a saved method or pay with a new one
const MakePaymentMethodScreen = ({ navigation, route }) => {
  const amount = Number(route.params?.amount) || 0;
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setMethods(list);
          setAutoPay(details);
          setSelectedId((prev) => prev || list.find((m) => m.isDefault && !isMethodExpired(m))?.id || "");
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setErrorAlert("We could not load your payment methods. Please try again.");
        });
      return () => abortRef.current?.abort();
    }, [])
  );

  const loading = methods === null;
  const selectedMethod = methods?.find((m) => m.id === selectedId) || null;
  const canContinue = !!selectedMethod && !isMethodExpired(selectedMethod);

  const onPayWithNewMethod = async () => {
    if (!isDemoPaymentData) {
      openOrbipaySecureCapture(navigation);
      return;
    }
    try {
      const added = await addDemoPaymentMethod();
      setMethods((prev) => [...(prev || []), added]);
      setSelectedId(added.id);
      announceA11y("New payment method added and selected.");
    } catch (error) {
      setErrorAlert("We could not add a payment method right now. Please try again.");
    }
  };

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
          Select payment method
        </Text>

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
                showAutoPayBadge={!!autoPay?.enrolled && method.id === autoPay?.paymentMethodId}
                positionLabel={`${index + 1} of ${methods.length}`}
              />
            ))}
          </View>
        )}

        {!loading && (
          <>
            <PrimaryButton
              title="Pay with new payment method"
              buttonType="outline"
              accessibilityLabel="Pay with new payment method"
              onPress={onPayWithNewMethod}
            />
            <PrimaryButton
              title="Continue"
              buttonType="submit"
              disabled={!canContinue}
              accessibilityLabel="Continue"
              onPress={() => canContinue && navigation.navigate("MakePaymentReview", { amount, methodId: selectedId })}
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
  },
  cardSkeleton: { height: 92, borderRadius: 8, marginBottom: 12 },
  emptyText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default MakePaymentMethodScreen;
