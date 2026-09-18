import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color } from "../../../../GlobalStyles";
import { theme } from "../../../styles/theme";
import UploadcircleIcon from "../../../res/svgIcons/UploadcircleIcon";
import DownloadcircleIcon from "../../../res/svgIcons/DownloadcircleIcon";

const SpeedBanner = ({ downloadSpeed, uploadSpeed, style }) => (
  <View style={[styles.speedBanner, style]}>
    {/* Download */}
    <View
      style={styles.speedColumn}
      accessible={true}
      accessibilityLabel={`Download Speed: ${
        downloadSpeed ?? "--"
      } Megabits per second`}
    >
      <Text style={styles.speedHeroValue}>{downloadSpeed ?? "--"}</Text>
      <Text style={styles.speedHeroUnit}>Mbps</Text>
      <View style={styles.speedTagRow}>
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
      <Text style={styles.speedHeroUnit}>Mbps</Text>
      <View style={styles.speedTagRow}>
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
  speedColumn: {
    flex: 1,
    alignItems: "center",
  },
  speedHeroValue: {
    fontSize: 36,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: Color.colorblack_100,
    lineHeight: 40,
  },
  speedHeroUnit: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
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
