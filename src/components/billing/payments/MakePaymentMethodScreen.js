import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import Touchable from "../../common/customui/Touchable";
import PaymentMethodCard from "./PaymentMethodCard";
import ConfirmActionModal from "./ConfirmActionModal";
import RightArrow from "../../../res/svgIcons/RightArrow";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  deletePaymentMethod,
  addDemoPaymentMethod,
  isDemoPaymentData,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  describePaymentMethod,
  isMethodExpired,
  openOrbipaySecureCapture,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle, Hyperlink } from "../../common/customui/Typography";

// Figma: Make a Payment step 2 — pick a saved method or pay with a new one
const MakePaymentMethodScreen = ({ navigation, route }) => {
  const amount = Number(route.params?.amount) || 0;
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
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
          setSelectedId(
            (prev) =>
              prev ||
              list.find((m) => m.isDefault && !isMethodExpired(m))?.id ||
              "",
          );
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setErrorAlert(
            "We could not load your payment methods. Please try again.",
          );
        });
      return () => abortRef.current?.abort();
    }, []),
  );

  const loading = methods === null;
  const selectedMethod = methods?.find((m) => m.id === selectedId) || null;
  const canContinue = !!selectedMethod && !isMethodExpired(selectedMethod);
  const isAutoPayLinked = (method) =>
    !!autoPay?.enrolled &&
    !!method.id &&
    method.id === autoPay?.paymentMethodId;

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
      setErrorAlert(
        "We could not add a payment method right now. Please try again.",
      );
    }
  };

  // Orbipay cannot edit PCI fields natively; edits go through the secure capture page
  const onEditMethod = () =>
    openOrbipaySecureCapture(navigation, "Edit Payment Method");

  const onConfirmDelete = async () => {
    const method = pendingDelete;
    setPendingDelete(null);
    try {
      await deletePaymentMethod(method.id);
      setMethods((prev) => prev?.filter((m) => m.id !== method.id));
      setSelectedId((prev) => (prev === method.id ? "" : prev));
      announceA11y("Payment method deleted.");
    } catch (error) {
      setErrorAlert(
        "We could not delete this payment method. Please try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Billing Details"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[contentMaxWidth, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View style={[AppStyles.card, { margin: 16, padding: 24 }]}>
            {!!errorAlert && (
              <NotificationAlert
                type="error"
                title="Something went wrong"
                message={errorAlert}
                onClose={() => setErrorAlert("")}
                autoFocusTitle
              />
            )}

            <SectionTitle
              style={styles.heading}
              accessibilityRole="header"
              accessibilityLevel={2}
            >
              Select payment method
            </SectionTitle>

            {loading ? (
              <SkeletonPlaceholder>
                <View style={styles.cardSkeleton} />
                <View style={styles.cardSkeleton} />
              </SkeletonPlaceholder>
            ) : methods.length === 0 ? (
              <Text style={styles.emptyText}>
                You have no saved payment methods yet. Add one to continue.
              </Text>
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
                    onEdit={onEditMethod}
                    onDelete={() => setPendingDelete(method)}
                    positionLabel={`${index + 1} of ${methods.length}`}
                  />
                ))}
              </View>
            )}
          </View>
          {!loading && (
            <View style={{ marginHorizontal: 24 }}>
              <PrimaryButton
                title="Pay with new payment method"
                buttonType="submit"
                onPress={onPayWithNewMethod}
                accessibilityRole="button"
                accessibilityLabel="Pay with new payment method"
                accessibilityHint="Opens a secure page to add a card or bank account."
               />
              <PrimaryButton
                title="Continue"
                buttonType="submit"
                disabled={!canContinue}
                accessibilityLabel="Continue"
                onPress={() =>
                  canContinue &&
                  navigation.navigate("MakePaymentReview", {
                    amount,
                    methodId: selectedId,
                  })
                }
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

      <ConfirmActionModal
        visible={!!pendingDelete}
        title="Delete payment method?"
        message={
          pendingDelete
            ? `${describePaymentMethod(
                pendingDelete,
              )} will be removed from your account.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 100 },
  heading: {
    marginBottom: 16,
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
    borderRadius: 4,
    padding: 16,
    marginTop: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  newMethodText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.sparklightBrightPurple,
    marginRight: 4,
  },
});

export default MakePaymentMethodScreen;
