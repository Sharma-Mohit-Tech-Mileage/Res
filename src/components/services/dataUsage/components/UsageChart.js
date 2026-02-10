import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import { StackedBarChart, YAxis, Grid } from "react-native-svg-charts";
import { G, Rect, Text as SvgText, Path } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { cardHeader } from "../../../../styles/compositions";
import SparkLightDropdown from "../../../common/customui/SparkLightDropdown";

const SCREEN_WIDTH = Dimensions.get("window").width;

const CHART_HEIGHT = 205;
const X_LABEL_HEIGHT = 34;
const CHART_TOTAL_HEIGHT = CHART_HEIGHT + X_LABEL_HEIGHT;
const LIST_VIEW_HEIGHT = 280;

const BAR_WIDTH = 10;
const TOOLTIP_WIDTH = 120;
const TOOLTIP_HEIGHT = 46;
const MIN_SPACING = 2;

const UsageChart = ({
  data,
  type = "monthly",
  onBarPress,
  activeTab,
  onTabChange,
}) => {
  const [selectedRange, setSelectedRange] = useState("Feb 2025 - Jan 2026");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showList, setShowList] = useState(false);

  // ── Bar grow-up animation ──
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barAnim.setValue(0);
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const barScale = barAnim;
  const barTranslateY = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CHART_TOTAL_HEIGHT / 2, 0],
  });
  const legendOpacity = barAnim;

  const dateRanges = useMemo(
    () => ["Feb 2025 - Jan 2026", "Jan 2025 - Dec 2025", "Dec 2024 - Nov 2025"],
    []
  );

  const tabs = useMemo(
    () => [
      { id: "daily", label: "Daily Usage" },
      { id: "monthly", label: "Monthly Usage" },
    ],
    []
  );

  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data.map((item) => {
      const download = Number(item.downloadGB ?? item.download ?? 0);
      const upload = Number(item.uploadGB ?? item.upload ?? 0);
      return {
        download,
        upload,
        total: download + upload,
        label: type === "monthly" ? item.monthLabel : item.usageDay,
        raw: item,
      };
    });
  }, [data, type]);

  const maxValue = useMemo(() => {
    if (!chartData.length) return 1;
    return Math.max(1, Math.max(...chartData.map((d) => d.total)) * 1.12);
  }, [chartData]);

  const { contentWidth, dynamicSpacing } = useMemo(() => {
    const availableWidth = SCREEN_WIDTH - 80;
    const totalBarsWidth = chartData.length * BAR_WIDTH;
    const totalSpacingNeeded = (chartData.length + 1) * MIN_SPACING;
    const minWidth = totalBarsWidth + totalSpacingNeeded;

    const finalWidth = Math.max(minWidth, availableWidth);
    const spacing = (finalWidth - totalBarsWidth) / (chartData.length + 1);

    return { contentWidth: finalWidth, dynamicSpacing: spacing };
  }, [chartData.length]);

  const formatLabels = useCallback(
    (item) => {
      if (!item?.label) return { line1: "", line2: "" };

      if (type === "monthly") {
        const month = String(item.label || "").split(" ")[0] || "";
        return { line1: month, line2: "" };
      }

      const date = new Date(item.label);
      if (Number.isNaN(date.getTime())) return { line1: "", line2: "" };

      const day = String(date.getDate());
      return { line1: day, line2: "" };
    },
    [type]
  );

  const formatPeriodLabel = useCallback((item) => {
    if (type === "monthly") {
      return item.label;
    }
    const date = new Date(item.label);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [type]);

  const handlePressBar = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      onBarPress?.(item.raw);
    },
    [onBarPress]
  );

  if (!chartData.length) return null;

  const Tooltip = ({ x, y, bandwidth }) => {
    const item = chartData[selectedIndex];
    if (!item) return null;

    const bx = x(selectedIndex);
    const barTopY = Math.min(y(item.total), CHART_HEIGHT - 26);
    const tooltipX = Math.max(
      8,
      Math.min(bx + bandwidth / 2 - TOOLTIP_WIDTH / 2, contentWidth - TOOLTIP_WIDTH - 8)
    );
    const tooltipY = Math.max(6, barTopY - TOOLTIP_HEIGHT - 10);
    const caretX = bx + bandwidth / 2;

    return (
      <G>
        <Rect
          x={tooltipX}
          y={tooltipY}
          rx={10}
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          fill={theme.colors.white}
          stroke={theme.colors.border}
          strokeWidth={1}
        />
        <Path
          d={`M ${caretX - 5} ${tooltipY + TOOLTIP_HEIGHT} L ${caretX} ${tooltipY + TOOLTIP_HEIGHT + 6} L ${
            caretX + 5
          } ${tooltipY + TOOLTIP_HEIGHT} Z`}
          fill={theme.colors.white}
        />
        <SvgText
          x={tooltipX + 10}
          y={tooltipY + 18}
          fontSize="13"
          fontWeight="700"
          fill={theme.colors.text.primaryDark}
        >
          {item.total.toFixed(1)} GB
        </SvgText>
        <SvgText
          x={tooltipX + 10}
          y={tooltipY + 34}
          fontSize="11"
          fontWeight="600"
          fill={theme.colors.primaryDark}
        >
          DL {item.download.toFixed(1)}
        </SvgText>
        <SvgText
          x={tooltipX + 60}
          y={tooltipY + 34}
          fontSize="11"
          fill={theme.colors.text.tertiary}
        >
          â€¢
        </SvgText>
        <SvgText
          x={tooltipX + 70}
          y={tooltipY + 34}
          fontSize="11"
          fontWeight="600"
          fill={theme.colors.upload}
        >
          UL {item.upload.toFixed(1)}
        </SvgText>
      </G>
    );
  };

  const TouchOverlay = ({ x, y, bandwidth }) => (
    <G>
      {chartData.map((item, index) => {
        const isActive = index === selectedIndex;
        const bx = x(index);
        const labels = formatLabels(item);
        const labelY1 = CHART_HEIGHT + 18;

        return (
          <G key={index}>
            <Rect
              x={bx - dynamicSpacing / 2}
              y={0}
              width={bandwidth + dynamicSpacing}
              height={CHART_HEIGHT}
              fill="transparent"
              onPress={() => handlePressBar(item, index)}
            />
            <SvgText
              x={bx + bandwidth / 2}
              y={labelY1}
              fontSize="11"
              fontWeight={isActive ? "700" : "600"}
              fill={isActive ? theme.colors.primaryDark : theme.colors.text.primary}
              textAnchor="middle"
            >
              {labels.line1}
            </SvgText>
          </G>
        );
      })}
    </G>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.chartTitle}>Historical Usage</Text>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => onTabChange?.(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.dropdownWrapper}>
            <SparkLightDropdown
              items={dateRanges}
              selectedValue={selectedRange}
              onValueChange={setSelectedRange}
              dropDownStyle={styles.dropdown}
              dropdownTitle={"Select Date Range"}
            />
          </View>

          <Pressable
            style={styles.listToggle}
            onPress={() => setShowList(!showList)}
            accessibilityRole="button"
            accessibilityLabel={showList ? "Show chart view" : "Show list view"}
          >
            <MaterialCommunityIcons
              name={showList ? "chart-bar" : "format-list-bulleted"}
              size={20}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>

        {!showList ? (
          <>
            <Animated.View
              style={{
                transform: [
                  { scaleY: barScale },
                  { translateY: barTranslateY },
                ],
                opacity: barAnim,
              }}
            >
              <View style={styles.chartRow}>
                <YAxis
                  style={styles.yAxis}
                  data={[0, maxValue]}
                  numberOfTicks={5}
                  contentInset={{ top: 16, bottom: 0 + X_LABEL_HEIGHT }}
                  svg={{
                    fill: theme.colors.text.tertiary,
                    fontSize: 10.5,
                    fontWeight: "600",
                  }}
                  formatLabel={(v) => Math.round(v).toString()}
                />

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={true}
                  style={styles.chartScroll}
                >
                  <View style={{ width: contentWidth }}>
                    <StackedBarChart
                      style={{ height: CHART_TOTAL_HEIGHT }}
                      data={chartData}
                      keys={["download", "upload"]}
                      colors={[theme.colors.primaryDark, theme.colors.upload]}
                      contentInset={{ top: 16, bottom: 0 + X_LABEL_HEIGHT }}
                      gridMin={0}
                      gridMax={maxValue}
                      spacingInner={(contentWidth - chartData.length * BAR_WIDTH) / contentWidth}
                      spacingOuter={dynamicSpacing / contentWidth}
                    >
                      <Grid svg={{ strokeOpacity: 0.16 }} />
                      <Tooltip />
                      <TouchOverlay />
                    </StackedBarChart>
                  </View>
                </ScrollView>
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: legendOpacity }}>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.primaryDark }]} />
                  <Text style={styles.legendText}>Download</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.upload }]} />
                  <Text style={styles.legendText}>Upload</Text>
                </View>
              </View>
            </Animated.View>
          </>
        ) : (
          <ScrollView 
            style={styles.listScrollContainer}
            showsVerticalScrollIndicator={true}
          >
            {chartData.map((item, index) => (
              <View key={index} style={[styles.listItem, index === chartData.length - 1 && styles.lastListItem]}>
                <View style={styles.listItemHeader}>
                  <Text style={styles.periodLabel}>{formatPeriodLabel(item)}</Text>
                  <Text style={styles.totalLabel}>{item.total.toFixed(4)} GB</Text>
                </View>
                <View style={styles.listItemRow}>
                  <View style={styles.detailItem}>
                    <View style={[styles.detailDot, { backgroundColor: theme.colors.primaryDark }]} />
                    <Text style={styles.detailLabel}>Download (GB)</Text>
                    <Text style={styles.detailValue}>{item.download.toFixed(4)}</Text>
                  </View>
                </View>
                <View style={styles.listItemRow}>
                  <View style={styles.detailItem}>
                    <View style={[styles.detailDot, { backgroundColor: theme.colors.upload }]} />
                    <Text style={styles.detailLabel}>Upload (GB)</Text>
                    <Text style={styles.detailValue}>{item.upload.toFixed(4)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: theme.spacing.base, marginBottom: theme.spacing.base },
  card: { ...card.base, padding: theme.spacing.base },
  header: cardHeader.container,
  iconWrapper: cardHeader.iconWrapper,
  chartTitle: cardHeader.title,

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.sm,
    padding: 3,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: theme.radius.xs,
    minHeight: 42,
    justifyContent: "center",
  },
  activeTab: { backgroundColor: theme.colors.white, ...theme.shadows.sm },
  tabText: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.secondary,
  },
  activeTabText: { color: theme.colors.primaryDark },

  controlsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dropdownWrapper: { flex: 1 },
  dropdown: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.radius.xs,
    minHeight: 44,
    height: 44,
  },
  listToggle: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },

  chartScroll: {
    marginBottom: theme.spacing.xs,
  },
  chartRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 2 },
  yAxis: { height: CHART_TOTAL_HEIGHT, width: 36, marginRight: 8 },

  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: theme.typography.size.sm, color: theme.colors.text.secondary },

  // List View
  listScrollContainer: {
    maxHeight: LIST_VIEW_HEIGHT,
    marginTop: theme.spacing.xs,
  },
  listItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    marginBottom: theme.spacing.sm,
  },
  lastListItem: {
    marginBottom: 0,
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  periodLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },
  totalLabel: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primaryDark,
  },
  listItemRow: {
    marginBottom: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primaryDark,
  },
});

export default UsageChart;