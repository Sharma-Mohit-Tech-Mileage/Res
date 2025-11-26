import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PilotTick from "../../res/svgIcons/PilotTick";
import { FontFamily } from "../../../GlobalStyles";

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

  const renderIcon = (filled, index) => {
    const iconContainerStyle = filled ? styles.iconFilledBg : styles.iconUnfilledBg;
    
    return (
      <View style={iconContainerStyle}>
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
      accessibilityLabel="Service Progress, heading level 2. Step 1 of 3. Service Purchased. Completed. Step 2 of 3. Pending Status. In progress. Step 3 of 3. Service Activated. Not started."
      accessibilityRole="none"
    >
      {stages.map((stage, idx) => {
        const index = idx + 1;
        const filled = index <= activeIndex;
        const statusText = getStatusText(index, activeIndex);
        const isLastStage = idx === stages.length - 1;

        return (
          <View
            key={stage.key}
            accessible={true}
            accessibilityLabel={`Step ${index} of ${stages.length}. ${stage.label}. ${statusText}`}
            accessibilityRole="text"
            style={styles.stageRow}
          >
            <View style={styles.leftColumn}>
              <TouchableOpacity
                accessibilityRole="none"
                onPress={() => onStagePress && onStagePress(index)}
                activeOpacity={0.8}
              >
                <View style={styles.iconWrapOuter}>
                  <View style={[styles.iconWrap, filled && styles.iconWrapFilled]}>
                    {renderIcon(filled, index)}
                  </View>
                </View>
              </TouchableOpacity>
              {!isLastStage && (
                <View
                  style={[
                    styles.connector,
                    filled && index < activeIndex
                      ? styles.connectorFilled
                      : styles.connectorUnfilled,
                  ]}
                />
              )}
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.label, filled && styles.labelFilled]}>
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
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  labelFilled: {
    color: "#8D3B90",
  },
});
