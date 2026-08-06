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
import { SectionTitle, SectionContent, HintText, FieldTitle, Hyperlink } from "../../common/customui/Typography";
import AppStyles from "../../../styles/AppStyles";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
} from "../../../network/apis/account/paymentMethods.service";
import { contentMaxWidth, ordinal, isMethodExpired, openOrbipaySecureCapture, paymentMethodTitle } from "./paymentsShared";

const AutoPayScreen = ({ navigation, route }) => {
  const headerTitle = "Manage Auto Pay";
  const [methods, setMethods] = useState(null);
  const [autoPay, setAutoPay] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
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
          setSelectedId((prev) => prev || (details.enrolled ? details.paymentMethodId : ""));
        })
        .catch(() => {
          setMethods([]);
          setAutoPay({ enrolled: false });
          setErrorAlert("We could not load your payment information. Please try again.");
        });
      return () => abortRef.current?.abort();
    }, [route.params?.paymentFlash, navigation])
  );

  const loading = methods === null || autoPay === null;
  const enrolled = !!autoPay?.enrolled;
  const dueDayLabel = ordinal(autoPay?.dueDay || 22);
  const selectedMethod = methods?.find((m) => m.id === selectedId) || null;
  const currentMethod = methods?.find((m) => m.id === autoPay?.paymentMethodId) || null;
  const isSwitching = enrolled && !!selectedMethod && !isMethodExpired(selectedMethod) && selectedId !== autoPay?.paymentMethodId;
  const methodShortName = (m) => `${paymentMethodTitle(m)} ****${m?.lastFour || ""}`;

  const canContinue =
    !!selectedMethod && !isMethodExpired(selectedMethod) && (!enrolled || selectedId !== autoPay?.paymentMethodId);

  const onAddMethod = () => openOrbipaySecureCapture(navigation, { headerTitle });

  const onContinue = () => {
    if (!canContinue) return;
    navigation.navigate("AutoPayReview", {
      mode: enrolled ? "update" : "enroll",
      methodId: selectedId,
      headerTitle,
    });
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[ contentMaxWidth,{paddingBottom: 140}]} showsVerticalScrollIndicator={false}>
        <>
        <View style={[AppStyles.card, { margin: 16 , padding: 16 }]}>
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
          {enrolled ? "Manage auto pay" : "Activate auto pay"}
        </SectionTitle>
        <SectionContent style={styles.introText}>
          {enrolled ? "You have signed up for" : "You are enrolling in"} Sparklight Auto Pay. Your payment will be
          automatically charged on the <Text style={styles.introBold}>{dueDayLabel}</Text> of each month using your
          selected payment method.
        </SectionContent>

        <View style={styles.selectRow}>
          <FieldTitle style={styles.selectLabel} accessibilityRole="header" accessibilityLevel={3}>
            {enrolled ? "Select new payment method" : "Select payment method."}
          </FieldTitle>
          <LinkText
            onPress={onAddMethod}
            accessibilityLabel="Add payment method"
            accessibilityHint="Opens a secure page to add a card or bank account."
          >
            <View style={styles.addLinkRow}>
              <Hyperlink style={styles.addLinkText}>Add</Hyperlink>
              <PlusCircleIcon color={Color.sparklightPrimaryPurple} />
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
                autoPayBadgeLabel="Current"
                showNewAutoPayBadge={isSwitching && method.id === selectedId}
                positionLabel={`${index + 1} of ${methods.length}`}
              />
            ))}
          </View>
        )}
        </View>
        <View style={{ marginHorizontal: 24 }} >
        {!loading && (
          <>
            {isSwitching && !!currentMethod && (
              <NotificationAlert
                type="warning"
                message={`Auto Pay will switch from ${methodShortName(currentMethod)} to ${methodShortName(selectedMethod)}, starting with your payment on the ${dueDayLabel}.`}
                showCloseIcon={false}
              />
            )}
            <PrimaryButton
              title={enrolled ? "Update Auto Pay" : "Continue"}
              buttonType="submit"
              disabled={!canContinue}
              accessibilityLabel={enrolled ? "Update Auto Pay" : "Continue"}
              onPress={onContinue}
            />
            {enrolled && (
              <PrimaryButton
                title="Deactivate Auto Pay"
                buttonType="outline"
                accessibilityLabel="Deactivate Auto Pay"
                onPress={() => navigation.navigate("AutoPayDeactivate", { headerTitle })}
              />
            )}
          </>
        )}
        </View>
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 24,
  },
  introText: { lineHeight: 20, marginBottom: 20 },
  introBold: { fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "700" },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectLabel: { flexShrink: 1, marginRight: 8 },
  addLinkRow: { flexDirection: "row", alignItems: "center" },
  addLinkText: { marginRight: 4 },
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
