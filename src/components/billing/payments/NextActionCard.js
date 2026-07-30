import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../common/customui/PrimaryButton";
import LinkText from "../../common/customui/LinkText";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";

const NextActionCard = ({ title, message, ctaLabel, onPress, onDismiss }) => (
  <View style={[card.elevated, styles.container]}>
    <Text style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
      {title}
    </Text>
    <Text style={styles.message}>{message}</Text>
    <PrimaryButton title={ctaLabel} buttonType="submit" accessibilityLabel={ctaLabel} onPress={onPress} />
    {!!onDismiss && (
      <LinkText
        text="Not now"
        onPress={onDismiss}
        accessibilityHint="Dismisses this suggestion."
        style={styles.dismissLink}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 24, alignSelf: "stretch" },
  title: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.colorGray_100,
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
    marginBottom: 4,
  },
  dismissLink: { alignSelf: "center", marginTop: 4 },
});

export default NextActionCard;
