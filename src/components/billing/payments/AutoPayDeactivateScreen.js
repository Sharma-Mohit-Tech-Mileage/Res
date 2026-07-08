import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { fetchAutoPayDetails, cancelAutoPay } from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, ordinal } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

// Figma: Deactivate auto pay — warning, T&C agreement, single Deactivate action
const AutoPayDeactivateScreen = ({ navigation }) => {
  const [details, setDetails] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    if (submitting || !agreed) return;
    setSubmitting(true);
    try {
      const result = await cancelAutoPay();
      navigation.replace("PaymentConfirmation", {
        kind: "autopay-deactivated",
        confirmationNumber: result?.confirmationNumber || "",
        email: details?.email || "",
      });
    } catch (error) {
      setErrorAlert("We could not deactivate Auto Pay right now. Please try again.");
      announceA11y("Error, Auto Pay was not deactivated.");
    } finally {
      setSubmitting(false);
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
          Deactivate auto pay
        </Text>
        <Text style={styles.introText}>You are going to deactivate your current auto pay account</Text>

        <NotificationAlert
          type="warning"
          message={`Your balance is due on the ${dueDayLabel} each month. By canceling Auto Pay, all future payments will need to be made manually.`}
          showCloseIcon={false}
        />

        <View style={styles.agreeBlock}>
          <AgreeTermsRow value={agreed} onValueChange={setAgreed} onViewTerms={() => setShowTerms(true)} />
        </View>

        <PrimaryButton
          title={submitting ? "Deactivating..." : "Deactivate"}
          buttonType="submit"
          disabled={!agreed}
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
  content: { padding: 20, paddingBottom: 80 },
  heading: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    color: Color.colorGray_100,
    marginBottom: 8,
  },
  introText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 20,
    marginBottom: 8,
  },
  agreeBlock: { marginTop: 12, marginBottom: 8 },
});

export default AutoPayDeactivateScreen;
