import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import PaymentPlanIcon from "../../../res/svgIcons/PaymentPlanIcon";
import Touchable from "../customui/Touchable";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle, Body, Hyperlink } from "../customui/Typography";
import { Color } from "../../../styles/GlobalStyles";
import { card } from "../../../styles/utilities";
import { theme } from "../../../styles/theme";
import { fetchPaymentPlanLink } from "../../../utils/paymentPlan";

const ERROR_TEXT = "We couldn't open your payment plan. Please try again.";

// Portal link may carry a short-lived token, so a prefetched URL is reused only for this long.
const ICON_SIZE = 20;
const LINK_MAX_AGE_MS = 4 * 60 * 1000;

const PaymentPlanCard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const linkRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchLink = useCallback((onUrl) => {
    fetchPaymentPlanLink(
      (url) => {
        if (!mountedRef.current) return;
        linkRef.current = { url, at: Date.now() };
        setHasError(false);
        onUrl(url);
      },
      () => {
        if (!mountedRef.current) return;
        linkRef.current = null;
        setHasError(true);
        onUrl(null);
      }
    );
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchLink(() => setPrefetching(false));
    return () => {
      mountedRef.current = false;
    };
  }, [fetchLink]);

  const open = (url) => navigation.navigate("ArticleWindowUtility", { name: "Payment Plan", url, quickPayToNative: true });

  const handlePress = () => {
    if (loading) return;
    const cached = linkRef.current;
    if (cached && Date.now() - cached.at < LINK_MAX_AGE_MS) {
      open(cached.url);
      return;
    }
    setLoading(true);
    setHasError(false);
    fetchLink((url) => {
      setLoading(false);
      if (url) open(url);
    });
  };

  if (prefetching) {
    return (
      <View style={[AppStyles.card, styles.outer]} accessible accessibilityLabel="Loading your payment plan" accessibilityState={{ busy: true }}>
        <View style={[card.content, styles.tint]}>
          <SkeletonPlaceholder>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonLine} />
                <View style={styles.skeletonLineShort} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  return (
    <Touchable
      style={[AppStyles.card, styles.outer]}
      minSize={0}
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel="Flexible Payment Plans. Peace of mind with manageable installments that comfortably fit your budget. View details about your plan."
      accessibilityHint="Double tap to open your payment plan."
      accessibilityState={{ busy: loading }}
    >
      <View style={[card.content, styles.tint]}>
        <View style={styles.headerRow}>
          <View accessible={false} importantForAccessibility="no-hide-descendants">
            <PaymentPlanIcon />
          </View>
          <SectionTitle accessible={false} style={styles.title}>Flexible Payment Plans</SectionTitle>
        </View>
        <View style={styles.textColumn}>
          <Body variant="secondary" style={styles.body} accessible={false}>Peace of mind with manageable installments that comfortably fit your budget.</Body>
          <View style={styles.linkRow}>
            <Hyperlink accessible={false}>View details about your plan</Hyperlink>
            {loading && <ActivityIndicator size="small" color={Color.sparklightPrimaryPurple} style={styles.spinner} />}
          </View>
          {hasError && (
            <Body style={styles.errorText} accessibilityLiveRegion="polite">{ERROR_TEXT}</Body>
          )}
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignItems: "stretch",
    borderColor: Color.sparklightPrimaryPurple,
    overflow: "hidden",
  },
  tint: { backgroundColor: theme.colors.paymentPlanSurface },
  row: { flexDirection: "row", alignItems: "flex-start" },
  headerRow: { flexDirection: "row", alignItems: "center" },
  title: { marginLeft: theme.spacing.sm, flexShrink: 1, ...(Platform.OS === "android" ? { includeFontPadding: false } : null) },
  textColumn: { marginLeft: ICON_SIZE + theme.spacing.sm },
  body: { marginTop: theme.spacing.xs },
  linkRow: { flexDirection: "row", alignItems: "center", marginTop: theme.spacing.md },
  spinner: { marginLeft: theme.spacing.sm },
  skeletonText: { flex: 1, marginLeft: theme.spacing.sm },
  skeletonIcon: { width: 40, height: 40, borderRadius: 20 },
  skeletonTitle: { width: "60%", height: 18, borderRadius: 4 },
  skeletonLine: { width: "100%", height: 14, borderRadius: 4, marginTop: theme.spacing.sm },
  skeletonLineShort: { width: "70%", height: 14, borderRadius: 4, marginTop: theme.spacing.xs },
  errorText: { marginTop: theme.spacing.sm, color: Color.errorText },
});

export default PaymentPlanCard;
