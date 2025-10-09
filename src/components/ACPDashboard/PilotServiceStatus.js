import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import PilotTick from "../../res/svgIcons/PilotTick";

/**
 * VerticalServiceStages
 *
 * Props:
 *  - currentStage: number (1..3) which stage is active/filled (default: 1)
 *  - stages: array of { key: string, label: string } (optional)
 *  - filledIcon: image source for filled state (require(...) or {uri: ...})
 *  - unfilledIcon: image source for unfilled state
 *  - onStagePress: function(stageIndex) - called when a stage is pressed (optional)
 *
 * Example:
 * <VerticalServiceStages currentStage={2} />
 */

const DEFAULT_STAGES = [
  { key: "purchase", label: "Service purchase" },
  { key: "pending", label: "Pending status" },
  { key: "activated", label: "Service activated" },
];

export default function PilotServiceStatus({
  currentStage = 1,
  stages = DEFAULT_STAGES,
  FilledIcon = PilotTick,
  UnfilledIcon = PilotTick,
  onStagePress = null,
}) {
  // normalize currentStage to 1..stages.length
  const activeIndex = Math.max(1, Math.min(currentStage, stages.length));

  return (
    <View style={styles.wrapper}>
      {stages.map((stage, idx) => {
        const index = idx + 1;
        const filled = index <= activeIndex;
        const showConnector = idx !== stages.length - 1;

        return (
          <View key={stage.key} style={styles.stageRow}>
            <View style={styles.leftColumn}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`${stage.label} ${
                  filled ? "completed" : "incomplete"
                }`}
                onPress={() => onStagePress && onStagePress(index)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconWrap, filled && styles.iconWrapFilled]}
                >
                  <View
                    style={{
                      backgroundColor: filled ? "#8D3B90" : "#CCCCCC",
                      borderRadius: 22,
                      padding: 6,
                    }}
                  >
                    {filled ? (
                      <FilledIcon isActive={true} />
                    ) : !filled ? (
                      <UnfilledIcon isActive={false} />
                    ) : (
                      // fallback: a simple colored circle with number
                      <View
                        style={[
                          styles.fallbackCircle,
                          filled && styles.fallbackCircleFilled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.fallbackText,
                            filled && styles.fallbackTextFilled,
                          ]}
                        >
                          {index}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {showConnector && (
                <View
                  style={[
                    styles.connector,
                    filled ? styles.connectorFilled : styles.connectorUnfilled,
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
    height: "100%",
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
    paddingTop: 4,
    justifyContent: "center",
  },
  iconWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  iconWrapFilled: {
    borderColor: "#8D3B90",
    backgroundColor: "#8D3B90",
  },
  icon: {
    width: SIZE * 0.7,
    height: SIZE * 0.7,
  },
  fallbackCircle: {
    width: SIZE * 0.86,
    height: SIZE * 0.86,
    borderRadius: (SIZE * 0.86) / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  fallbackCircleFilled: {
    backgroundColor: "#8D3B90",
    borderColor: "#8D3B90",
  },
  fallbackText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  fallbackTextFilled: {
    color: "#fff",
  },
  connector: {
    width: 2,
    height: CONNECTOR_HEIGHT,
    marginTop: 6,
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
    color: "#666",
  },
  labelFilled: {
    color: "#111",
    fontWeight: "600",
  },
});
