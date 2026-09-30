import React, { useCallback, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ScreenScroll } from "../../common/customui/Screen";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { SectionTitle, SectionContent } from "../../common/customui/Typography";
import { fetchAutoPayDetails, cancelAutoPay, paymentErrorMessage } from "../../../network/apis/account/paymentMethods.service";
import { buttonsInFrame, ordinal } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";
import AppStyles from "../../../styles/AppStyles";
import { card } from "../../../styles/utilities";
import {
  usePaymentStep,
  trackAutoPayDisabled,
  trackAutoPayFailed,
  trackApiError,
  errorStatus,
} from "./paymentAnalytics";
import { Color } from "../../../styles/GlobalStyles";

const AutoPayDeactivateScreen = ({ navigation, route }) => {
  const headerTitle = route.params?.headerTitle || "Manage Auto Pay";
  const [details, setDetails] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inFlightRef = useRef(false);
  const [errorAlert, setErrorAlert] = useState("");
  const abortRef = useRef(null);

  usePaymentStep("autopay_deactivate");

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      fetchAutoPayDetails(abortRef.current.signal)
        .then(setDetails)
        .catch((error) => {
          setDetails({});
          trackApiError("autopay-details", errorStatus(error), "autopay_deactivate");
        });
      return () => abortRef.current?.abort();
    }, [])
  );

  const dueDayLabel = ordinal(details?.dueDay || 22);

  const onDeactivate = async () => {
    if (inFlightRef.current || !agreed) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      await cancelAutoPay();
      trackAutoPayDisabled(null);
      navigation.replace("PaymentConfirmation", { kind: "autopay-deactivated", headerTitle });
    } catch (error) {
      trackAutoPayFailed(error?.code || "deactivate_failed");
      trackApiError("cancel-autopay", errorStatus(error), "autopay_deactivate");
      // 55255: "deleted": false carries the portal's deactivation copy; transport errors get the request-failed copy.
      setErrorAlert(paymentErrorMessage(error));
      announceA11y("Error, Auto Pay was not deactivated.");
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <ScreenScroll framed stack showsVerticalScrollIndicator={false}>
        <>
        <View style={[AppStyles.card, card.content]}>
        {!!errorAlert && (
          <NotificationAlert
            type="error"
            title="Something went wrong"
            message={errorAlert}
            splitKey={
              errorAlert.includes("1-877-692-2253")
                ? [{ text: "1-877-692-2253", action: "call", value: "1-877-692-2253" }]
                : ""
            }
            onClose={() => setErrorAlert("")}
            autoFocusTitle
          />
        )}

        <SectionTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Deactivate auto pay
        </SectionTitle>
        <SectionContent style={styles.instructions}>
          You are going to deactivate your current auto pay account
        </SectionContent>

        <NotificationAlert
          type="warning"
          iconColor={Color.sparkLightInfo}
          message={`Your balance is due on the ${dueDayLabel} each month. By canceling Auto Pay, all future payments will need to be made manually.`}
          splitKey={[{ text: dueDayLabel, bold: true }]}
          showCloseIcon={false}
        />
       </View>
       <View style={buttonsInFrame}>
        <View style={styles.agreeBlock}>
          <AgreeTermsRow value={agreed} onValueChange={setAgreed} onViewTerms={() => setShowTerms(true)} />
        </View>

        <PrimaryButton
          title={submitting ? "Deactivating..." : "Deactivate Auto Pay"}
          buttonType="submit"
          disabled={submitting || !agreed}
          accessibilityLabel="Deactivate Auto Pay"
          onPress={onDeactivate}
        />
        <PrimaryButton title="Back" buttonType="outline" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        </View>
        </>
      </ScreenScroll>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.surfaceMuted },
  heading: {
    marginBottom: 24,
  },
  introText: { lineHeight: 20, marginBottom: 8 },
  instructions: { marginBottom: 8 },
  agreeBlock: { marginTop: 8, marginBottom: 8 },
});

export default AutoPayDeactivateScreen;
