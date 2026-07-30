import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SparkLightInput from "../../common/customui/SparkLightInput";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import AppStyles from "../../../styles/AppStyles";
import {
  SectionTitle,
  SectionContent,
  FieldTitle,
  FieldContent,
  Hyperlink,
} from "../../common/customui/Typography";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  enrollAutoPay,
  updateAutoPayPaymentMethod,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  ordinal,
  describePaymentMethod,
  paymentMethodA11yLabel,
  formatCurrency,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Figma: Review Auto Pay — summary, required email, T&C agreement, single Activate/Update action
const AutoPayReviewScreen = ({ navigation, route }) => {
  const mode = route.params?.mode === "update" ? "update" : "enroll";
  const methodId = route.params?.methodId || "";
  const fromOffer = !!route.params?.fromOffer;
  const [method, setMethod] = useState(null);
  const [details, setDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const emailRef = useRef(null);
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, autoPay]) => {
          setMethod(list.find((m) => m.id === methodId) || null);
          setDetails(autoPay);
          setEmail((prev) => prev || autoPay.email || "");
        })
        .catch(() => {
          setDetails({});
          setErrorAlert(
            "We could not load your payment information. Please try again.",
          );
        });
      return () => abortRef.current?.abort();
    }, [methodId]),
  );

  const loading = details === null;
  const dueDayLabel = ordinal(details?.dueDay || 22);
  const balanceDue = Number(details?.balanceDue) || 0;

  const onSubmit = async () => {
    if (submitting || !agreed) return;
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const submit =
        mode === "update" ? updateAutoPayPaymentMethod : enrollAutoPay;
      const result = await submit(methodId, email.trim());
      navigation.replace("PaymentConfirmation", {
        kind: mode === "update" ? "autopay-updated" : "autopay-activated",
        confirmationNumber: result?.confirmationNumber || "",
        email: email.trim(),
        nextAction:
          balanceDue > 0 && !fromOffer
            ? { type: "payBalance", amount: balanceDue, methodId }
            : null,
      });
    } catch (error) {
      setErrorAlert(
        mode === "update"
          ? "We could not update your Auto Pay payment method. Please try again."
          : "We could not complete your Auto Pay enrollment. Please try again.",
      );
      announceA11y("Error, your Auto Pay changes were not saved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Billing Details"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[contentMaxWidth]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ paddingBottom: 100 }}
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
              Review Auto Pay
            </SectionTitle>
            <SectionContent style={styles.introText}>
              {mode === "update"
                ? "You have signed up for"
                : "You are enrolling in"}{" "}
              Sparklight Auto Pay. Your payment will be automatically charged on
              the <Text style={styles.introBold}>{dueDayLabel}</Text> of each
              month using your selected payment method.
            </SectionContent>

            {loading ? (
              <SkeletonPlaceholder>
                <View style={styles.cardSkeleton} />
                <View style={styles.cardSkeleton} />
              </SkeletonPlaceholder>
            ) : (
              <>
                {balanceDue > 0 && (
                  <NotificationAlert
                    type="warning"
                    title="Your Balance Needs Attention"
                    message={`Your current balance of ${formatCurrency(
                      balanceDue,
                    )} won't be processed by Auto Pay before the due date. You can pay it after finishing this setup.`}
                    showCloseIcon={false}
                  />
                )}

                <View style={[card.elevated, styles.summaryCard]}>
                  <View
                    style={styles.fieldGroup}
                    accessible
                    accessibilityLabel={`Payment Method, ${paymentMethodA11yLabel(
                      method,
                    )}`}
                  >
                    <FieldTitle style={styles.fieldLabel}>
                      Payment Method
                    </FieldTitle>
                    <FieldContent>{describePaymentMethod(method)}</FieldContent>
                  </View>
                  <View
                    style={[styles.fieldGroup, styles.fieldGroupLast]}
                    accessible
                    accessibilityLabel={`Payment Date, on the ${dueDayLabel} of each month`}
                  >
                    <FieldTitle style={styles.fieldLabel}>
                      Payment Date
                    </FieldTitle>
                    <FieldContent>
                      On the {dueDayLabel} of each month
                    </FieldContent>
                  </View>
                </View>

                <View style={[card.elevated, styles.emailCard]}>
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
                    accessibilityHint="A confirmation email will be sent to this address."
                  />
                </View>

                <AgreeTermsRow
                  value={agreed}
                  onValueChange={setAgreed}
                  onViewTerms={() => setShowTerms(true)}
                />
              </>
            )}
          </View>
          <View style={{ marginHorizontal: 24 }}>
            <PrimaryButton
              title={
                submitting
                  ? "Saving..."
                  : mode === "update"
                  ? "Update Auto Pay"
                  : "Activate Auto Pay"
              }
              buttonType="submit"
              disabled={!agreed}
              accessibilityLabel={
                mode === "update" ? "Update Auto Pay" : "Activate Auto Pay"
              }
              onPress={onSubmit}
            />
            <PrimaryButton
              title="Cancel"
              buttonType="outline"
              accessibilityLabel="Back"
              onPress={() => navigation.goBack()}
            />
          </View>
        </>
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 100 },
  heading: {
    marginBottom: 8,
  },
  introText: {
    marginBottom: 16,
  },
  introBold: { fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "700" },
  cardSkeleton: { height: 92, borderRadius: 8, marginBottom: 12 },
  summaryCard: { padding: 16, marginTop: 8 },
  fieldGroup: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    marginBottom: 12,
  },
  fieldGroupLast: { paddingBottom: 0, borderBottomWidth: 0, marginBottom: 0 },
  fieldLabel: {
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.colorGray_200,
  },
  emailCard: { padding: 16 },
});

export default AutoPayReviewScreen;
