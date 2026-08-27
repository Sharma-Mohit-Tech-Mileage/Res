import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import CircleAlertIcon from "../../../../assets/svgs/CircleAlertIcon";
import IconButton from "../../common/customui/IconButton";
import { FieldTitle, FieldContent } from "../../common/customui/Typography";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";

const ReviewField = ({ label, value, a11yValue, last, loading, showLabelIcon, onLabelIconPress, labelIconExpanded }) => {
  const interactive = showLabelIcon && !!onLabelIconPress;
  return (
    <View
      style={[styles.fieldGroup, last && styles.fieldGroupLast]}
      accessible={!interactive && !loading}
      accessibilityLabel={interactive || loading ? undefined : `${label}, ${a11yValue || value}`}
    >
      {showLabelIcon ? (
        <View style={styles.labelRow}>
          <FieldTitle style={styles.fieldLabel}>{label}</FieldTitle>
          {interactive ? (
            <IconButton
              icon={<CircleAlertIcon size={16} color="#4C5458" accessible={false} />}
              onPress={onLabelIconPress}
              accessibilityLabel={`${label} information`}
              accessibilityHint={labelIconExpanded ? "Collapses the surcharge details." : "Expands the surcharge details."}
              accessibilityState={{ expanded: !!labelIconExpanded }}
              style={styles.labelIconButton}
            />
          ) : (
            <CircleAlertIcon size={16} color="#4C5458" accessible={false} style={styles.labelIcon} />
          )}
        </View>
      ) : (
        <FieldTitle style={styles.fieldLabel}>{label}</FieldTitle>
      )}
      {loading ? (
        <SkeletonPlaceholder>
          <View style={styles.valueSkeleton} />
        </SkeletonPlaceholder>
      ) : (
        <FieldContent style={styles.fieldValue}>{value}</FieldContent>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: 16 },
  fieldGroupLast: { paddingBottom: 4 },
  fieldLabel: { textAlign: "left", lineHeight: 28 },
  labelRow: { flexDirection: "row", alignItems: "center" },
  labelIcon: { marginLeft: 6 },
  // Negative margin keeps the visual row height while the 48dp touch bounds overlap neighboring rows.
  labelIconButton: { marginLeft: -10, marginVertical: -10 },
  fieldValue: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: "400",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  valueSkeleton: { height: 18, borderRadius: 4, width: "60%" },
});

export default ReviewField;
