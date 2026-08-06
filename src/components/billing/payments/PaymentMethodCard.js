import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "../../common/customui/Touchable";
import { FieldTitle, Hyperlink } from "../../common/customui/Typography";
import PaymentBrandIcon from "../../common/PaymentBrandIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { paymentMethodA11yLabel, paymentMethodTitle, maskedDigits, isMethodExpired, radioA11yProps } from "./paymentsShared";

const PaymentMethodCard = ({
  method,
  variant = "radio",
  selected = false,
  onPress,
  showAutoPayBadge = false,
  autoPayBadgeLabel = "Auto Pay",
  showNewAutoPayBadge = false,
  onEdit,
  onDelete,
  disabled = false,
  positionLabel = "",
}) => {
  const expired = isMethodExpired(method);

  const showEdit = !!onEdit && !expired;
  const showDelete = !!onDelete && !showAutoPayBadge;

  const infoA11yLabel = `${paymentMethodA11yLabel(method)}${showAutoPayBadge ? ", current Auto Pay method" : ""}${showNewAutoPayBadge ? ", selected as new Auto Pay method" : ""}${
    expired ? ", expired" : ""
  }${method?.expiry ? `, expires ${method.expiry}` : ""}`;

  const topContent = (
    <>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          {variant === "radio" && (
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]} accessible={false}>
              {selected && <View style={styles.radioInner} />}
            </View>
          )}
          <FieldTitle style={[styles.titleText, expired && styles.textDisabled]}>{paymentMethodTitle(method)}</FieldTitle>
        </View>
        <View style={styles.brandWrap} accessible={false} importantForAccessibility="no-hide-descendants">
          <PaymentBrandIcon type={method?.type} brand={method?.brand} height={22} />
        </View>
      </View>
      <Text style={[styles.digitsText, expired && styles.textDisabled]}>{maskedDigits(method)}</Text>
    </>
  );

  const hasActions = showEdit || showDelete || showAutoPayBadge || showNewAutoPayBadge || expired || !!method?.expiry;
  const actionsRow = hasActions ? (
    <View style={styles.bottomRow}>
      <View style={styles.actionsWrap}>
        {showEdit && (
          <Touchable
            onPress={onEdit}
            disabled={disabled}
            accessibilityRole="link"
            accessibilityLabel={`Edit ${paymentMethodA11yLabel(method)}`}
            style={styles.actionLink}
          >
            <Hyperlink style={styles.actionText}>Edit</Hyperlink>
          </Touchable>
        )}
        {showEdit && (showDelete || showAutoPayBadge) && (
          <Text style={styles.actionDivider} accessible={false} importantForAccessibility="no">
            |
          </Text>
        )}
        {showDelete && (
          <Touchable
            onPress={onDelete}
            disabled={disabled}
            accessibilityRole="link"
            accessibilityLabel={`Delete ${paymentMethodA11yLabel(method)}`}
            style={styles.actionLink}
          >
            <Hyperlink style={styles.actionText}>Delete</Hyperlink>
          </Touchable>
        )}
        {showAutoPayBadge && (
          <Text style={styles.autoPayBadge} accessible={false} importantForAccessibility="no">
            {autoPayBadgeLabel}
          </Text>
        )}
        {showNewAutoPayBadge && (
          <Text style={[styles.autoPayBadge, styles.newAutoPayBadge]} accessible={false} importantForAccessibility="no">
            New Auto Pay
          </Text>
        )}
        {expired && (
          <Text style={styles.expiredBadge} accessible={false} importantForAccessibility="no">
            Expired
          </Text>
        )}
      </View>
      {!!method?.expiry && (
        <Text style={styles.expiryText} accessible={false} importantForAccessibility="no">
          Exp {method.expiry}
        </Text>
      )}
    </View>
  ) : null;

  if (variant === "radio") {
    return (
      <View style={[styles.card, selected && styles.cardSelected]}>
        <Touchable
          onPress={onPress}
          disabled={disabled || expired}
          {...radioA11yProps(
            `${infoA11yLabel}${expired ? ", not eligible" : ""}${positionLabel ? `, ${positionLabel}` : ""}`,
            selected
          )}
          accessibilityState={{ checked: selected, disabled: disabled || expired }}
          style={[styles.radioPress, expired && styles.contentDisabled]}
        >
          {topContent}
        </Touchable>
        {actionsRow}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View accessible accessibilityLabel={infoA11yLabel} style={expired && styles.contentDisabled}>
        {topContent}
      </View>
      {actionsRow}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "transparent",
    padding: 16,
    marginBottom: 12,
    alignItems: "stretch",
    alignSelf: "stretch",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Color.colorMidnightblue,
    backgroundColor: "#F3F2FF",
  },
  contentDisabled: { opacity: 0.55 },
  radioPress: { alignItems: "stretch", alignSelf: "stretch" },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleWrap: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.sparklightGray1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioOuterSelected: { borderColor: Color.colorMidnightblue },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Color.colorMidnightblue },
  titleText: { flexShrink: 1 },
  brandWrap: { marginLeft: 12 },
  digitsText: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.colorGray_200,
    letterSpacing: 1,
    marginTop: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    minHeight: 24,
  },
  actionsWrap: { flexDirection: "row", alignItems: "center" },
  actionLink: { paddingVertical: 4, paddingHorizontal: 4 },
  actionText: {},
  actionDivider: { color: "#98A2B3", marginHorizontal: 4 },
  newAutoPayBadge: {
    backgroundColor: "#E9F8EE",
    color: "#1D7832",
  },
  autoPayBadge: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    backgroundColor: "#C8E9D0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    overflow: "hidden",
  },
  expiredBadge: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    color: "#B92A1C",
    backgroundColor: "#FEF3F2",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    overflow: "hidden",
  },
  expiryText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
  },
  textDisabled: { color: Color.sparklightGray1 },
});

export default PaymentMethodCard;
