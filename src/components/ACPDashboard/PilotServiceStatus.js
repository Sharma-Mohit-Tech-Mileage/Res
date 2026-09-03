import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import PilotTick from "../../res/svgIcons/PilotTick";
import { FontFamily } from "../../../GlobalStyles";
import Touchable from "../common/customui/Touchable";

const DEFAULT_STAGES = [
  { key: "purchase", label: "Service Purchased" },
  { key: "pending", label: "Pending Status" },
  { key: "activated", label: "Service Activated" },
];

export default function PilotServiceStatus({
  currentStage = 1,
  stages = DEFAULT_STAGES,
  FilledIcon = PilotTick,
  UnfilledIcon = PilotTick,
  onStagePress = null,
}) {
  const activeIndex = Math.max(1, Math.min(currentStage, stages.length));

  const getStatusText = (index, activeIndex) => {
    if (index < activeIndex) return "Completed.";
    if (index === activeIndex) return "In progress.";
    return "Not started.";
  };

  // Build combined label for Android
  const buildCombinedLabel = () => {
    const stageLabels = stages.map((stage, idx) => {
      const index = idx + 1;
      const statusText = getStatusText(index, activeIndex);
      return `Step ${index} of ${stages.length}: ${stage.label}. ${statusText}`;
    }).join(" ");
    return `${stageLabels}. Header.`;
  };

  const renderIcon = (filled, index) => {
    const iconContainerStyle = filled ? styles.iconFilledBg : styles.iconUnfilledBg;
    
    return (
      <View style={iconContainerStyle} accessible={false} importantForAccessibility="no">
        {filled ? (
          <FilledIcon isActive={true} />
        ) : (
          <UnfilledIcon isActive={false} />
        )}
      </View>
    );
  };

  return (
    <View
      style={styles.wrapper}
      accessible={true}
      accessibilityRole="header"
      accessibilityLevel={2}
      accessibilityLabel={Platform.OS === "android" ? buildCombinedLabel() : undefined}
    >
      {stages.map((stage, idx) => {
        const index = idx + 1;
        const filled = index <= activeIndex;
        const statusText = getStatusText(index, activeIndex);
        const isLastStage = idx === stages.length - 1;

        return (
          <View
            key={stage.key}
            accessible={Platform.OS === "ios" ? true : false}
            accessibilityLabel={Platform.OS === "ios" ? `Step ${index} of ${stages.length}. ${stage.label}. ${statusText}` : undefined}
            accessibilityRole="text"
            style={styles.stageRow}
          >
            <View style={styles.leftColumn} accessible={false} importantForAccessibility="no">
              <Touchable
                minSize={0}
                style={{ alignItems: 'stretch' }}
                accessible={false}
                importantForAccessibility="no"
                accessibilityRole="none"
                onPress={() => onStagePress && onStagePress(index)}
              >
                <View style={styles.iconWrapOuter} accessible={false} importantForAccessibility="no">
                  <View style={[styles.iconWrap, filled && styles.iconWrapFilled]} accessible={false} importantForAccessibility="no">
                    {renderIcon(filled, index)}
                  </View>
                </View>
              </Touchable>
              {!isLastStage && (
                <View
                  accessible={false}
                  importantForAccessibility="no"
                  style={[
                    styles.connector,
                    filled && index < activeIndex
                      ? styles.connectorFilled
                      : styles.connectorUnfilled,
                  ]}
                />
              )}
            </View>
            <View style={styles.rightColumn} accessible={false} importantForAccessibility="no">
              <Text style={[styles.label, filled && styles.labelFilled]} accessible={false} importantForAccessibility="no">
                {stage.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const SIZE = 44;
const CONNECTOR_HEIGHT = 36;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "white",
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  leftColumn: {
    width: 72,
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    paddingTop: 19,
    justifyContent: "center",
  },
  iconWrapOuter: {
    width: SIZE + 15,
    height: SIZE + 15,
    borderRadius: (SIZE + 15) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1eeeeff",
    overflow: "hidden",
  },
  iconWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: "#E4E7E9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  iconWrapFilled: {
    borderColor: "#8D3B90",
    backgroundColor: "#8D3B90",
  },
  iconFilledBg: {
    backgroundColor: "#8D3B90",
    borderRadius: 22,
    padding: 8,
  },
  iconUnfilledBg: {
    backgroundColor: "#CCCCCC",
    borderRadius: 22,
    padding: 8,
  },
  connector: {
    width: 4,
    height: CONNECTOR_HEIGHT,
    borderRadius: 2,
  },
  connectorFilled: {
    backgroundColor: "#8D3B90",
  },
  connectorUnfilled: {
    backgroundColor: "#E0E0E0",
  },
  label: {
    fontSize: 16,
    color: "#737373",
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
  },
  labelFilled: {
    color: "#8D3B90",
  },
});
