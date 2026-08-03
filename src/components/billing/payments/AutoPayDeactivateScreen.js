import React, { useCallback, useRef, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { SectionTitle, HintText } from "../../common/customui/Typography";
import { fetchAutoPayDetails, cancelAutoPay } from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, ordinal } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

const AutoPayDeactivateScreen = ({ navigation, route }) => {
  const headerTitle = route.params?.headerTitle || "Manage Auto Pay";
  const [details, setDetails] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inFlightRef = useRef(false);
  const [errorAlert, setErrorAlert] = useState("");
  const abortRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      fetchAutoPayDetails(abortRef.current.signal)
        .then(setDetails)
        .catch(() => setDetails({}));
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

      navigation.replace("PaymentConfirmation", { kind: "autopay-deactivated", headerTitle });
    } catch (error) {
      setErrorAlert("We could not deactivate Auto Pay right now. Please try again.");
      announceA11y("Error, Auto Pay was not deactivated.");
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
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
          Deactivate auto pay
        </SectionTitle>
        <HintText style={styles.introText}>You are going to deactivate your current auto pay account</HintText>

        <NotificationAlert
          type="warning"
          message={`Your balance is due on the ${dueDayLabel} each month. By canceling Auto Pay, all future payments will need to be made manually.`}
          splitKey={[{ text: dueDayLabel, bold: true }]}
          showCloseIcon={false}
        />

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
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 8,
  },
  introText: { lineHeight: 20, marginBottom: 8 },
  agreeBlock: { marginTop: 12, marginBottom: 8 },
});

export default AutoPayDeactivateScreen;
