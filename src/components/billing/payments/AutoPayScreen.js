import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import LinkText from "../../common/customui/LinkText";
import PaymentMethodCard from "./PaymentMethodCard";
import PlusCircleIcon from "../../../res/svgIcons/PlusCircleIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  addDemoPaymentMethod,
  isDemoPaymentData,
} from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, ordinal, isMethodExpired, openOrbipaySecureCapture } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

// Figma: Activate/Manage auto pay — select a payment method, then continue to review
const AutoPayScreen = ({ navigation }) => {
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
          setSelectedId((prev) => prev || (details.enrolled ? details.paymentMethodId : ""));
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setErrorAlert("We could not load your payment information. Please try again.");
        });
      return () => abortRef.current?.abort();
    }, [])
  );

  const loading = methods === null || autoPay === null;
  const enrolled = !!autoPay?.enrolled;
  const dueDayLabel = ordinal(autoPay?.dueDay || 22);
  const selectedMethod = methods?.find((m) => m.id === selectedId) || null;
  // Continue unlocks on any eligible selection when enrolling, or on a different method when managing
  const canContinue =
    !!selectedMethod && !isMethodExpired(selectedMethod) && (!enrolled || selectedId !== autoPay?.paymentMethodId);

  const onAddMethod = async () => {
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

  const onContinue = () => {
    if (!canContinue) return;
    navigation.navigate("AutoPayReview", {
      mode: enrolled ? "update" : "enroll",
      methodId: selectedId,
    });
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
          {enrolled ? "Manage auto pay" : "Activate auto pay"}
        </Text>
        <Text style={styles.introText}>
          {enrolled ? "You have signed up for" : "You are enrolling in"} Sparklight Auto Pay. Your payment will be
          automatically charged on the <Text style={styles.introBold}>{dueDayLabel}</Text> of each month using your
          selected payment method.
        </Text>

        <View style={styles.selectRow}>
          <Text style={styles.selectLabel} accessibilityRole="header" accessibilityLevel={3}>
            {enrolled ? "Select new payment method." : "Select payment method."}
          </Text>
          <LinkText
            onPress={onAddMethod}
            accessibilityLabel="Add payment method"
            accessibilityHint="Opens a secure page to add a card or bank account."
          >
            <View style={styles.addLinkRow}>
              <Text style={styles.addLinkText}>Add</Text>
              <PlusCircleIcon />
            </View>
          </LinkText>
        </View>

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
                showAutoPayBadge={enrolled && method.id === autoPay?.paymentMethodId}
                positionLabel={`${index + 1} of ${methods.length}`}
              />
            ))}
          </View>
        )}

        {!loading && (
          <>
            <PrimaryButton
              title="Continue"
              buttonType="submit"
              disabled={!canContinue}
              accessibilityLabel="Continue"
              onPress={onContinue}
            />
            {enrolled && (
              <PrimaryButton
                title="Deactivate"
                buttonType="outline"
                accessibilityLabel="Deactivate Auto Pay"
                onPress={() => navigation.navigate("AutoPayDeactivate")}
              />
            )}
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
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.sparklightGray1,
    marginBottom: 8,
  },
  introText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    lineHeight: 22,
    marginBottom: 20,
  },
  introBold: { fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "700" },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectLabel: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.colorGray_200,
    flexShrink: 1,
    marginRight: 8,
  },
  addLinkRow: { flexDirection: "row", alignItems: "center" },
  addLinkText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
    marginRight: 4,
  },
  cardSkeleton: { height: 92, borderRadius: 15, marginBottom: 12 },
  emptyText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default AutoPayScreen;
