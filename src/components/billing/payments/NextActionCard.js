import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../common/customui/PrimaryButton";
import LinkText from "../../common/customui/LinkText";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import { SectionTitle, SectionContent } from "../../common/customui/Typography";
import AppStyles from "../../../styles/AppStyles";  

// One optional follow-up offer after a success — a single suggestion, never a bundled second action
const NextActionCard = ({ title, message, ctaLabel, onPress, onDismiss }) => (
  <View style={[AppStyles.card, styles.container]}>
    <SectionTitle style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
      {title}
    </SectionTitle>
    <SectionContent >
      {message}
    </SectionContent>
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
    marginBottom: 4,
  },
  message: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 20,
  },
  dismissLink: { alignSelf: "center", marginTop: 4 },
});

export default NextActionCard;
