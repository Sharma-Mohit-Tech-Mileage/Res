import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../../common/customui/PrimaryButton";
import LinkText from "../../common/customui/LinkText";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle, SectionContent } from "../../common/customui/Typography";

const NextActionCard = ({ title, message, ctaLabel, onPress, onDismiss }) => (
  <>
  <View style={[AppStyles.card, styles.container]}>
    <SectionTitle style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
      {title}
    </SectionTitle>
    <SectionContent style={styles.message}>
      {message}
    </SectionContent>
    </View>
   <View style={{ marginTop: 16}}>
    <PrimaryButton title={ctaLabel} buttonType="submit" accessibilityLabel={ctaLabel} onPress={onPress} />
    {!!onDismiss && (
      <LinkText
        text="Not now"
        onPress={onDismiss}
        accessibilityHint="Dismisses this suggestion."
        style={styles.dismissLink}
        textStyle={AppStyles.hyperlink}
      />
    )}
    </View>
  </>
);

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 24, alignSelf: "stretch" },
  title: {
    marginBottom: 8,
  },
  message: {
    lineHeight: 20,
    marginBottom: 4,
  },
  dismissLink: { alignSelf: "center", marginTop: 8 },
});

export default NextActionCard;
