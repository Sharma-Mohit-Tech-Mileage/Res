import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import LinkText from "../../common/customui/LinkText";
import PaymentMethodCard from "./PaymentMethodCard";
import ConfirmActionModal from "./ConfirmActionModal";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import PlusCircleIcon from "../../../res/svgIcons/PlusCircleIcon";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  deletePaymentMethod,
  addDemoPaymentMethod,
  isDemoPaymentData,
} from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, describePaymentMethod, openOrbipaySecureCapture } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

// Figma: Add payment method — saved methods list with Add link, Edit | Delete actions, success toast
const PaymentMethodsScreen = ({ navigation }) => {
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState(null);
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setMethods(list);
          setAutoPay(details);
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setAlert({
            type: "error",
            title: "Unable to load payment methods",
            message: "Please try again later.",
          });
        });
      return () => abortRef.current?.abort();
    }, [])
  );

  const isAutoPayLinked = (method) => !!autoPay?.enrolled && !!method.id && method.id === autoPay?.paymentMethodId;

  const onAddMethod = async () => {
    if (!isDemoPaymentData) {
      openOrbipaySecureCapture(navigation);
      return;
    }
    setBusy(true);
    try {
      const added = await addDemoPaymentMethod();
      setMethods((prev) => [...(prev || []), added]);
      setAlert({ type: "success", message: "You have successfully added a new payment method" });
      announceA11y("You have successfully added a new payment method.");
    } catch (error) {
      setAlert({
        type: "error",
        title: "Something went wrong",
        message: "We could not add a payment method right now. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  // Orbipay cannot edit PCI fields natively; edits go through the secure capture page
  const onEditMethod = () => openOrbipaySecureCapture(navigation, "Edit Payment Method");

  const onConfirmDelete = async () => {
    const method = pendingDelete;
    setPendingDelete(null);
    setBusy(true);
    try {
      await deletePaymentMethod(method.id);
      setMethods((prev) => prev?.filter((m) => m.id !== method.id));
      setAlert({ type: "success", message: `${describePaymentMethod(method)} has been deleted` });
      announceA11y("Payment method deleted.");
    } catch (error) {
      setAlert({
        type: "error",
        title: "Something went wrong",
        message: "We could not delete this payment method. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Billing Details" onPressBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
        {!!alert && (
          <NotificationAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoFocusTitle
          />
        )}

        <View style={styles.headingRow}>
          <Text style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
            Add payment method
          </Text>
          <LinkText
            onPress={() => !busy && onAddMethod()}
            disabled={busy}
            accessibilityLabel="Add payment method"
            accessibilityHint="Opens a secure page to add a card or bank account."
          >
            <View style={styles.addLinkRow}>
              <Text style={styles.addLinkText}>Add</Text>
              <PlusCircleIcon />
            </View>
          </LinkText>
        </View>

        {methods === null ? (
          <SkeletonPlaceholder>
            <View style={styles.cardSkeleton} />
            <View style={styles.cardSkeleton} />
          </SkeletonPlaceholder>
        ) : methods.length === 0 ? (
          <View style={[card.elevated, styles.emptyCard]}>
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
              onEdit={onEditMethod}
              onDelete={() => setPendingDelete(method)}
            />
          ))
        )}
      </ScrollView>

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
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 80 },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.sparklightGray1,
    flexShrink: 1,
    marginRight: 8,
  },
  addLinkRow: { flexDirection: "row", alignItems: "center" },
  addLinkText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
    marginRight: 4,
  },
  cardSkeleton: { height: 92, borderRadius: 15, marginBottom: 12 },
  emptyCard: { padding: 20, marginBottom: 16, alignItems: "flex-start" },
  emptyTitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    color: Color.colorGray_100,
    marginBottom: 8,
  },
  helperText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
  },
});

export default PaymentMethodsScreen;
