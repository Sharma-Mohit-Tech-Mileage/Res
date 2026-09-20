import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HintText } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import UploadcircleIcon from "../../../res/svgIcons/UploadcircleIcon";
import DownloadcircleIcon from "../../../res/svgIcons/DownloadcircleIcon";

const SpeedBanner = ({ downloadSpeed, uploadSpeed, style, plain = false }) => (
  <View style={[styles.speedBanner, plain && styles.plain, style]}>
    {/* Download */}
    <View
      style={styles.speedColumn}
      accessible={true}
      accessibilityLabel={`Download Speed: ${
        downloadSpeed ?? "--"
      } Megabits per second`}
    >
      <Text style={styles.speedHeroValue}>{downloadSpeed ?? "--"}</Text>
      <HintText style={styles.speedHeroUnit}>Mbps</HintText>
      <View style={[styles.speedTagRow, plain && styles.plainTag]}>
        <DownloadcircleIcon
          width={12}
          height={12}
          style={styles.speedTagArrow}
        />
        <Text style={styles.speedTagText}>Download</Text>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.speedBannerDivider} />

    {/* Upload */}
    <View
      style={styles.speedColumn}
      accessible={true}
      accessibilityLabel={`Upload Speed: ${
        uploadSpeed ?? "--"
      } Megabits per second`}
    >
      <Text style={styles.speedHeroValue}>{uploadSpeed ?? "--"}</Text>
      <HintText style={styles.speedHeroUnit}>Mbps</HintText>
      <View style={[styles.speedTagRow, plain && styles.plainTag]}>
        <UploadcircleIcon width={12} height={12} style={styles.speedTagArrow} />
        <Text style={styles.speedTagText}>Upload</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  speedBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.speedPanel,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
  },
  plain: { backgroundColor: "transparent", borderWidth: 0, paddingHorizontal: 0 },
  plainTag: { backgroundColor: "transparent" },
  speedColumn: {
    flex: 1,
    alignItems: "center",
  },
  speedHeroValue: {
    fontSize: 36,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.secondary,
    lineHeight: 40,
  },
  speedHeroUnit: { marginTop: 2 },
  speedTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
    backgroundColor: `${theme.colors.primary}14`,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  speedTagArrow: {
    fontSize: theme.typography.size.xs,
    fontWeight: "700",
    marginRight: 4,
    color: theme.colors.primary,
  },
  speedTagText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  speedBannerDivider: {
    width: 1,
    height: 50,
    backgroundColor: `${theme.colors.primary}20`,
  },

});

export default SpeedBanner;
