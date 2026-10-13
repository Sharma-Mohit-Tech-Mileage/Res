import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import LinkText from "../../common/customui/LinkText";
import PaymentMethodCard from "./PaymentMethodCard";
import ConfirmActionModal from "./ConfirmActionModal";
import { Color, FontFamily, FontSize } from "../../../styles/GlobalStyles";
import { card } from "../../../styles/utilities";
import AppStyles from "../../../styles/AppStyles";
import PlusCircleIcon from "../../../res/svgIcons/PlusCircleIcon";
import { SectionTitle, Hyperlink } from "../../common/customui/Typography";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  deletePaymentMethod,
  paymentErrorMessage,
} from "../../../network/apis/account/paymentMethods.service";
import { describePaymentMethod, openOrbipaySecureCapture, openOrbipayEdit } from "./paymentsShared";
import { ScreenScroll } from "../../common/customui/Screen";
import { announceA11y } from "../../../utils/a11y";
import {
  usePaymentStep,
  endPaymentAttempt,
  trackPaymentMethodDeleted,
  trackPaymentMethodFailed,
  trackApiError,
  errorStatus,
} from "./paymentAnalytics";

const PaymentMethodsScreen = ({ navigation, route }) => {
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const deletingRef = useRef(false);
  const [alert, setAlert] = useState(null);
  const abortRef = useRef(null);

  usePaymentStep("manage_payment_methods");

  useFocusEffect(
    useCallback(() => {

      const flash = route.params?.paymentFlash;
      if (flash) {
        setAlert(flash);
        navigation.setParams({ paymentFlash: undefined });
      }
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setMethods(list);
          setAutoPay(details);
        })
        .catch((error) => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setAlert({
            type: "error",
            title: "Unable to load payment methods",
            message: "Please try again later.",
          });
          trackApiError("payment-methods", errorStatus(error), "manage_payment_methods");
        });
      return () => abortRef.current?.abort();
    }, [route.params?.paymentFlash, navigation])
  );

  const isAutoPayLinked = (method) => !!autoPay?.enrolled && !!method.id && method.id === autoPay?.paymentMethodId;

  const onAddMethod = () => {
    setAlert(null);
    openOrbipaySecureCapture(navigation, { returnTo: "PaymentMethods", headerTitle: "Manage Payment Method" });
  };

  const onEditMethod = (method) => {
    setAlert(null);
    openOrbipayEdit(navigation, method, { returnTo: "PaymentMethods", headerTitle: "Manage Payment Method" });
  };

  const onConfirmDelete = async () => {
    if (deletingRef.current || !pendingDelete) return;
    deletingRef.current = true;
    const method = pendingDelete;
    setPendingDelete(null);
    setBusy(true);
    try {
      await deletePaymentMethod(method.id);
      setMethods((prev) => prev?.filter((m) => m.id !== method.id));
      setAlert({ type: "success", message: `${describePaymentMethod(method)} has been deleted` });
      announceA11y("Payment method deleted.");
      trackPaymentMethodDeleted(method);
    } catch (error) {
      // 55255: portal copy for a delete that the service did not confirm.
      setAlert({
        type: "error",
        title: "Something went wrong",
        message: paymentErrorMessage(error, "METHOD_NOT_DELETED"),
      });
      trackPaymentMethodFailed(method, error?.code || "delete_failed");
      trackApiError("delete-payment-method", errorStatus(error), "manage_payment_methods");
    } finally {
      deletingRef.current = false;
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Manage Payment Method"
        onPressBack={() => {
          endPaymentAttempt();
          navigation.goBack();
        }}
      />
      <ScreenScroll framed showsVerticalScrollIndicator={false}>
         <View style={[AppStyles.card, card.content]}>
        {!!alert && (
          <NotificationAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            splitKey={
              String(alert.message || "").includes("1-877-692-2253")
                ? [{ text: "1-877-692-2253", action: "call", value: "1-877-692-2253" }]
                : ""
            }
            onClose={() => setAlert(null)}
            autoFocusTitle
          />
        )}

        <View style={styles.headingRow}>
          <SectionTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
            Add payment method
          </SectionTitle>
          <LinkText
            onPress={() => !busy && onAddMethod()}
            disabled={busy}
            accessibilityLabel="Add payment method"
            accessibilityHint="Opens a secure page to add a card or bank account."
          >
            <View style={styles.addLinkRow}>
              <Hyperlink style={styles.addLinkText}>Add</Hyperlink>
              <PlusCircleIcon color={Color.sparklightPrimaryPurple} />
            </View>
          </LinkText>
        </View>

        {methods === null ? (
          <SkeletonPlaceholder>
            <View style={styles.cardSkeleton} />
            <View style={styles.cardSkeleton} />
          </SkeletonPlaceholder>
        ) : methods.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle} accessibilityRole="header" accessibilityLevel={3}>
              No saved payment methods
            </Text>
            <Text style={styles.helperText}>
              Add a card or bank account to make payments faster and enable Auto Pay.
            </Text>
          </View>
        ) : (
          methods.map((method, index) => (
            <PaymentMethodCard
              key={method.id || index}
              method={method}
              variant="actions"
              showAutoPayBadge={isAutoPayLinked(method)}
              disabled={busy}
              onEdit={() => onEditMethod(method)}
              onDelete={() => setPendingDelete(method)}
            />
          ))
        )}
       </View>
      </ScreenScroll>

      <ConfirmActionModal
        visible={!!pendingDelete}
        title="Delete payment method?"
        message={pendingDelete ? `${describePaymentMethod(pendingDelete)} will be removed from your account.` : ""}
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
  container: { flex: 1, backgroundColor: Color.surfaceMuted },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    flexShrink: 1,
    marginRight: 8,
    marginBottom: 24,
  },
  addLinkRow: { flexDirection: "row", alignItems: "center" },
  addLinkText: { marginRight: 4 },
  cardSkeleton: { height: 92, borderRadius: 15, marginBottom: 12 },
  emptyCard: { alignItems: "flex-start" },
  emptyTitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.colorGray_100,
    marginBottom: 8,
  },
  helperText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
  },
});

export default PaymentMethodsScreen;
