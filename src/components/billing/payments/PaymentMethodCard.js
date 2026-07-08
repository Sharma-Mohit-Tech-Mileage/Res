import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "../../common/customui/Touchable";
import PaymentBrandIcon from "../../common/PaymentBrandIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { paymentMethodA11yLabel, paymentMethodTitle, maskedDigits, isMethodExpired } from "./paymentsShared";

// Figma method card: radio variant for AutoPay selection, actions variant for the Payment Methods list
const PaymentMethodCard = ({
  method,
  variant = "radio",
  selected = false,
  onPress,
  showAutoPayBadge = false,
  showDefaultBadge = false,
  onEdit,
  onDelete,
  onSetDefault,
  disabled = false,
  positionLabel = "",
}) => {
  const expired = isMethodExpired(method);
  const brandMark = (
    <View style={styles.brandWrap} accessible={false} importantForAccessibility="no-hide-descendants">
      <PaymentBrandIcon type={method?.type} brand={method?.brand} height={22} />
    </View>
  );

  const badges = (
    <View style={styles.badgeRow}>
      {showAutoPayBadge && <Text style={styles.autoPayBadge}>Auto Pay</Text>}
      {showDefaultBadge && !!method?.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      {expired && <Text style={styles.expiredBadge}>Expired</Text>}
    </View>
  );

  const infoA11yLabel = `${paymentMethodA11yLabel(method)}${showAutoPayBadge ? ", used for Auto Pay" : ""}${
    showDefaultBadge && method?.isDefault ? ", default" : ""
  }${expired ? ", expired" : ""}${method?.expiry ? `, expires ${method.expiry}` : ""}`;

  const info = (
    <View accessible={variant === "actions"} accessibilityLabel={variant === "actions" ? infoA11yLabel : undefined}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          {variant === "radio" && (
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]} accessible={false}>
              {selected && <View style={styles.radioInner} />}
            </View>
          )}
          <Text style={[styles.titleText, expired && styles.textDisabled]}>{paymentMethodTitle(method)}</Text>
        </View>
        {brandMark}
      </View>
      <Text style={[styles.digitsText, expired && styles.textDisabled]}>{maskedDigits(method)}</Text>
    </View>
  );

  const body = (
    <>
      {info}
      <View style={styles.bottomRow}>
        {variant === "actions" ? (
          <View style={styles.actionsWrap}>
            {!!onEdit && !expired && (
              <Touchable
                onPress={onEdit}
                disabled={disabled}
                accessibilityRole="link"
                accessibilityLabel={`Edit ${paymentMethodA11yLabel(method)}`}
                style={styles.actionLink}
              >
                <Text style={styles.actionText}>Edit</Text>
              </Touchable>
            )}
            {!!onEdit && !!onDelete && !expired && <Text style={styles.actionDivider}>|</Text>}
            {!!onDelete && (
              <Touchable
                onPress={onDelete}
                disabled={disabled}
                accessibilityRole="link"
                accessibilityLabel={`Delete ${paymentMethodA11yLabel(method)}`}
                style={styles.actionLink}
              >
                <Text style={styles.actionText}>Delete</Text>
              </Touchable>
            )}
            {!!onSetDefault && !method?.isDefault && !expired && (
              <>
                <Text style={styles.actionDivider}>|</Text>
                <Touchable
                  onPress={onSetDefault}
                  disabled={disabled}
                  accessibilityRole="link"
                  accessibilityLabel={`Set ${paymentMethodA11yLabel(method)} as default`}
                  style={styles.actionLink}
                >
                  <Text style={styles.actionText}>Set as Default</Text>
                </Touchable>
              </>
            )}
            {badges}
          </View>
        ) : (
          badges
        )}
        {!!method?.expiry && <Text style={styles.expiryText}>Exp {method.expiry}</Text>}
      </View>
    </>
  );

  if (variant === "radio") {
    return (
      <Touchable
        onPress={onPress}
        disabled={disabled || expired}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled: disabled || expired }}
        accessibilityLabel={`${paymentMethodA11yLabel(method)}${showAutoPayBadge ? ", current Auto Pay method" : ""}${
          expired ? ", expired, not eligible" : ""
        }${positionLabel ? `, ${positionLabel}` : ""}`}
        style={[styles.card, selected && styles.cardSelected, expired && styles.cardDisabled]}
      >
        {body}
      </Touchable>
    );
  }

  return <View style={[styles.card, expired && styles.cardDisabled]}>{body}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    padding: 16,
    marginBottom: 12,
    alignItems: "stretch",
    alignSelf: "stretch",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Color.colorMidnightblue,
    backgroundColor: "#3530910D",
  },
  cardDisabled: { opacity: 0.55 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleWrap: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#98A2B3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioOuterSelected: { borderColor: Color.colorMidnightblue },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Color.colorMidnightblue },
  titleText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    flexShrink: 1,
  },
  brandWrap: { marginLeft: 12 },
  digitsText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.colorGray_100,
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
  actionText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    color: Color.colorMidnightblue,
    textDecorationLine: "underline",
  },
  actionDivider: { color: "#98A2B3", marginHorizontal: 6 },
  badgeRow: { flexDirection: "row", alignItems: "center", marginLeft: 4 },
  autoPayBadge: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorMidnightblue,
    backgroundColor: "#3530911A",
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    overflow: "hidden",
  },
  defaultBadge: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansSemiBold,
    color: "#1D7832",
    backgroundColor: Color.success50,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    overflow: "hidden",
  },
  expiredBadge: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansSemiBold,
    color: "#B92A1C",
    backgroundColor: "#FEF3F2",
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
  expiryText: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
  },
  textDisabled: { color: Color.sparklightGray1 },
});

export default PaymentMethodCard;
