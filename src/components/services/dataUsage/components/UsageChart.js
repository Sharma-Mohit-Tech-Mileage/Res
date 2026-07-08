import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Animated, Easing, Platform, AccessibilityInfo, findNodeHandle } from "react-native";
import { StackedBarChart, YAxis, Grid } from "react-native-svg-charts";
import { G, Rect, Text as SvgText, Path, Line } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme, A11Y } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { cardHeader, dataUsageTabs } from "../../../../styles/compositions";
import SparkLightDropdown from "../../../common/customui/SparkLightDropdown";
import Touchable from "../../../common/customui/Touchable";
import AppStyles from "../../../../styles/AppStyles";

const SCREEN_WIDTH = Dimensions.get("window").width;

const CHART_HEIGHT = 205;
const X_LABEL_HEIGHT = 34;
const CHART_TOTAL_HEIGHT = CHART_HEIGHT + X_LABEL_HEIGHT;
const LIST_VIEW_HEIGHT = 280;

const BAR_WIDTH = 12;
const TOOLTIP_WIDTH = 120;
const TOOLTIP_HEIGHT = 46;
const MIN_SPACING = 14;

const TRACK_THICKNESS = 3.5;
const THUMB_MIN = 28;
const TRACK_COLOR = "rgba(0,0,0,0.07)";
const THUMB_COLOR = "rgba(0,0,0,0.22)";
const FADE_SIZE = 24;


const HScrollIndicator = ({ scrollX, contentW, viewportW }) => {
  const ratio = viewportW / contentW;
  const thumbW = Math.max(THUMB_MIN, ratio * viewportW);
  const trackUsable = viewportW - thumbW;

  const translateX = scrollX.interpolate({
    inputRange: [0, Math.max(1, contentW - viewportW)],
    outputRange: [0, trackUsable],
    extrapolate: "clamp",
  });

  if (ratio >= 1) return null;

  return (
    <View style={hStyles.track}>
      <Animated.View
        style={[hStyles.thumb, { width: thumbW, transform: [{ translateX }] }]}
      />
    </View>
  );
};

const hStyles = StyleSheet.create({
  track: {
    height: TRACK_THICKNESS,
    borderRadius: TRACK_THICKNESS / 2,
    backgroundColor: TRACK_COLOR,
    marginTop: 6,
    overflow: "hidden",
  },
  thumb: {
    height: TRACK_THICKNESS,
    borderRadius: TRACK_THICKNESS / 2,
    backgroundColor: THUMB_COLOR,
  },
});


const VScrollIndicator = ({ scrollY, contentH, viewportH }) => {
  const ratio = viewportH / contentH;
  const thumbH = Math.max(THUMB_MIN, ratio * viewportH);
  const trackUsable = viewportH - thumbH;

  const translateY = scrollY.interpolate({
    inputRange: [0, Math.max(1, contentH - viewportH)],
    outputRange: [0, trackUsable],
    extrapolate: "clamp",
  });

  if (ratio >= 1) return null;

  return (
    <View style={[vStyles.track, { height: viewportH }]}>
      <Animated.View
        style={[vStyles.thumb, { height: thumbH, transform: [{ translateY }] }]}
      />
    </View>
  );
};

const vStyles = StyleSheet.create({
  track: {
    width: TRACK_THICKNESS,
    borderRadius: TRACK_THICKNESS / 2,
    backgroundColor: TRACK_COLOR,
    marginLeft: 8,
    overflow: "hidden",
  },
  thumb: {
    width: TRACK_THICKNESS,
    borderRadius: TRACK_THICKNESS / 2,
    backgroundColor: THUMB_COLOR,
  },
});


const UsageChart = ({
  data,
  type = "monthly",
  onBarPress,
  activeTab,
  onTabChange,
  periodLabels = [],
  selectedPeriodLabel = "",
  onPeriodChange,
  loading = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showList, setShowList] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);


  const handleToggleView = useCallback(() => {
    const nextView = !showList;
    // Temporarily mark the toggle non-accessible so VoiceOver doesn't re-read the new label before our "selected" announcement fires.
    if (isScreenReaderEnabled) {
      setIsViewTransitioning(true);
    }
    setShowList(nextView);
    if (isScreenReaderEnabled) {
      const viewType = nextView ? "List View" : "Graph View";
      const delay = Platform.OS === "ios" ? 600 : 400;
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(`${viewType} selected.`);
        // Restore button accessibility after announcement is posted
        setTimeout(() => setIsViewTransitioning(false), 300);
      }, delay);
    }
  }, [showList, isScreenReaderEnabled, type, data]);

  const handleSkipChartData = useCallback(() => {
    const node = findNodeHandle(skipTargetRef.current);
    if (node) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(node);
      }, 250);
    }
    return true;
  }, []);

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };
    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );
    return () => {
      subscription?.remove?.();
    };
  }, []);

  const chartScrollX = useRef(new Animated.Value(0)).current;
  const [chartViewportW, setChartViewportW] = useState(0);
  const skipTargetRef = useRef(null);

  const listScrollY = useRef(new Animated.Value(0)).current;
  const [listContentH, setListContentH] = useState(0);
  const [listViewportH, setListViewportH] = useState(LIST_VIEW_HEIGHT);

  const fadeHintAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fadeHintAnim.setValue(1);
    Animated.sequence([
      Animated.timing(fadeHintAnim, { toValue: 0.35, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeHintAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeHintAnim, { toValue: 0.35, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeHintAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [activeTab, showList]);

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

  const dateRanges = periodLabels;

  const tabs = useMemo(
    () => [
      { id: "daily", label: "Daily Usage", description: "Shows daily data usage for the selected month" },
      { id: "monthly", label: "Monthly Usage", description: "Shows monthly data usage for the current year" },
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

  const formatPeriodLabel = useCallback(
    (item) => {
      if (type === "monthly") {
        return item.label;
      }
      const date = new Date(item.label);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    },
    [type]
  );

  const handlePressBar = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      onBarPress?.(item.raw);
      const periodLabel = formatPeriodLabel(item);
      AccessibilityInfo.announceForAccessibility(
        `${periodLabel}. Download: ${item.download.toFixed(2)} GB, Upload: ${item.upload.toFixed(2)} GB. Total: ${item.total.toFixed(2)} GB.`
      );
    },
    [onBarPress, formatPeriodLabel]
  );

  // No data state — still show tabs + dropdown so user can switch periods
  if (!chartData.length && !loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden={true}>
              <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.chartTitle} accessibilityRole="header">Historical Usage</Text>
          </View>
          <View style={styles.tabsContainer} accessibilityRole="tablist">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Touchable
                  key={tab.id}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => { if (!isActive) onTabChange?.(tab.id); }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={tab.label}
                  minSize={0}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
                </Touchable>
              );
            })}
          </View>
          <View style={styles.controlsRow}>
            {activeTab === "daily" && dateRanges.length > 0 && (
              <View style={styles.dropdownWrapper}>
                <SparkLightDropdown
                  items={dateRanges}
                  selectedValue={selectedPeriodLabel}
                  onValueChange={onPeriodChange}
                  dropDownStyle={styles.dropdown}
                  dropdownTitle={"Select Billing Period"}
                  accessibilityItemName="billing period"
                />
              </View>
            )}
            {activeTab !== "daily" && <View style={{ flex: 1 }} />}
            <Touchable
              style={styles.listToggle}
              onPress={handleToggleView}
              accessibilityRole="button"
              accessibilityLabel={showList ? "List View" : "Graph View"}
            >
              <MaterialCommunityIcons
                name={showList ? "chart-bar" : "format-list-bulleted"}
                size={20}
                color={theme.colors.primary}
                accessible={false}
                importantForAccessibility="no"
              />
            </Touchable>
          </View>
          <View style={styles.noDataContainer}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={48} color={theme.colors.borderLight} />
            <Text style={styles.noDataTitle}>No Data Available</Text>
            <Text style={styles.noDataSubtext}>
              {activeTab === "daily"
                ? "No usage data found for the selected billing period. Try selecting a different period."
                : "No monthly usage data available at this time."}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // — Chart needs horizontal scroll? —
  const chartScrollable = contentWidth > chartViewportW && chartViewportW > 0;

  const Tooltip = ({ x, y, bandwidth }) => {
    const item = chartData[selectedIndex];
    if (!item) return null;

    const bx = x(selectedIndex);
    const barCenterX = bx + bandwidth / 2;
    const barTopY = y(item.total);

    const tooltipX = Math.max(
      8,
      Math.min(barCenterX - TOOLTIP_WIDTH / 2, contentWidth - TOOLTIP_WIDTH - 8)
    );
    const tooltipGap = 12;
    const tooltipY = Math.max(6, barTopY - TOOLTIP_HEIGHT - tooltipGap);
    const caretX = barCenterX;

    const caretTipY = tooltipY + TOOLTIP_HEIGHT + 6;
    const showLeader = barTopY - caretTipY > 4;

    return (
      <G>
        <Rect
          x={bx - 3}
          y={barTopY}
          rx={3}
          width={bandwidth + 6}
          height={CHART_HEIGHT - barTopY}
          fill={theme.colors.primaryDark}
          fillOpacity={0.1}
        />

        {showLeader && (
          <Line
            x1={caretX}
            y1={caretTipY}
            x2={caretX}
            y2={barTopY}
            stroke={theme.colors.primaryDark}
            strokeWidth={1.2}
            strokeDasharray="3,3"
            strokeOpacity={0.5}
          />
        )}

        <Rect
          x={tooltipX}
          y={tooltipY}
          rx={10}
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          fill={theme.colors.white}
          stroke={theme.colors.primaryDark}
          strokeWidth={1}
          strokeOpacity={0.35}
        />
        <Path
          d={`M ${caretX - 5} ${tooltipY + TOOLTIP_HEIGHT} L ${caretX} ${tooltipY + TOOLTIP_HEIGHT + 6} L ${caretX + 5
            } ${tooltipY + TOOLTIP_HEIGHT} Z`}
          fill={theme.colors.white}
          stroke={theme.colors.primaryDark}
          strokeWidth={1}
          strokeOpacity={0.35}
        />
        <Rect
          x={caretX - 6}
          y={tooltipY + TOOLTIP_HEIGHT - 1}
          width={12}
          height={2}
          fill={theme.colors.white}
        />

        <SvgText x={tooltipX + 10} y={tooltipY + 18} fontSize="13" fontWeight="700" fill={theme.colors.text.primaryDark}>
          {item.total.toFixed(2)} GB
        </SvgText>
        <SvgText x={tooltipX + 10} y={tooltipY + 34} fontSize="11" fontWeight="600" fill={theme.colors.primaryDark}>
          DL {item.download.toFixed(2)}
        </SvgText>
        <SvgText x={tooltipX + 70} y={tooltipY + 34} fontSize="11" fontWeight="600" fill={theme.colors.upload}>
          UL {item.upload.toFixed(2)}
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
              height={CHART_TOTAL_HEIGHT}
              fill="transparent"
              pointerEvents="none"
            />

            {isActive && (
              <G>
                <SvgText
                  x={bx + bandwidth / 2}
                  y={labelY1}
                  fontSize="11"
                  fontWeight="700"
                  fill={theme.colors.primaryDark}
                  textAnchor="middle"
                >
                  {labels.line1}
                </SvgText>
                <Rect
                  x={bx + bandwidth / 2 - 2}
                  y={labelY1 + 4}
                  width={4}
                  height={4}
                  rx={2}
                  fill={theme.colors.primaryDark}
                />
              </G>
            )}

            {!isActive && (
              <SvgText
                x={bx + bandwidth / 2}
                y={labelY1}
                fontSize="11"
                fontWeight="600"
                fill={theme.colors.text.primary}
                textAnchor="middle"
              >
                {labels.line1}
              </SvgText>
            )}
          </G>
        );
      })}
    </G>
  );

  const FadeEdge = ({ side, horizontal = true }) => {
    const isStart = side === "left" || side === "top";
    const colors = isStart
      ? ["rgba(255,255,255,0.95)", "rgba(255,255,255,0)"]
      : ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"];

    if (horizontal) {
      return (
        <Animated.View
          pointerEvents="none"
          style={[
            fadeStyles.hFade,
            isStart ? fadeStyles.hLeft : fadeStyles.hRight,
            { opacity: fadeHintAnim },
          ]}
        >
          <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          fadeStyles.vFade,
          isStart ? fadeStyles.vTop : fadeStyles.vBottom,
          { opacity: fadeHintAnim },
        ]}
      >
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    );
  };

  const buildBarA11yLabel = (item, index) => {
    const periodLabel = formatPeriodLabel(item);
    const positionLabel = type === "daily"
      ? `Day ${index + 1} of ${chartData.length}`
      : `Month ${index + 1} of ${chartData.length}`;
    return `${positionLabel}. ${periodLabel}. Download: ${item.download.toFixed(2)} GB, Upload: ${item.upload.toFixed(2)} GB. Total: ${item.total.toFixed(2)} GB.`;
  };

  const barA11yHint = Platform.select({
    ios: "Two-finger double tap to skip chart",
    android: "Swipe to next heading to skip chart",
  });

  const graphSummaryLabel = `${type === "daily" ? "Daily" : "Monthly"} Stats. Graph shows ${chartData.length} ${type === "daily" ? "days" : "months"} of activity. Swipe left or right to view each ${type === "daily" ? "day" : "month"}.`;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header icon — decorative */}
        <View style={styles.header}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.chartTitle} accessibilityRole="header">Historical Usage</Text>
        </View>
        <View style={styles.tabsContainer} accessibilityRole="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Touchable
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => {
                  if (!isActive) {
                    onTabChange?.(tab.id);
                    if (Platform.OS === 'android') {
                      setTimeout(() => {
                        AccessibilityInfo.announceForAccessibility(`Switched to ${tab.label}`);
                      }, 300);
                    }
                  }
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${tab.label}. ${tab.description}`}
                accessibilityHint={
                  isActive
                    ? undefined
                    : `Double tap to switch to ${tab.label}`
                }
                minSize={0}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Touchable>
            );
          })}
        </View>

        <View style={styles.controlsRow}>
          {/* Dropdown only shows for Daily Usage — Monthly has no date range picker */}
          {activeTab === "daily" && (
            <View style={styles.dropdownWrapper}>
              <SparkLightDropdown
                items={dateRanges}
                selectedValue={selectedPeriodLabel}
                onValueChange={onPeriodChange}
                dropDownStyle={styles.dropdown}
                dropdownTitle={"Select Billing Period"}
                accessibilityItemName="billing period"
              />
            </View>
          )}

          {/* Spacer when dropdown is hidden to push toggle to the right */}
          {activeTab !== "daily" && <View style={{ flex: 1 }} />}

          <Touchable
            style={styles.listToggle}
            onPress={handleToggleView}
            accessible={!isViewTransitioning}
            accessibilityRole="button"
            accessibilityLabel={
              showList ? "List View" : "Graph View"
            }
            accessibilityHint={
              showList
                ? "Double tap to switch to Graph View"
                : "Double tap to switch to List View"
            }
          >
            <MaterialCommunityIcons
              name={showList ? "chart-bar" : "format-list-bulleted"}
              size={20}
              color={theme.colors.primary}
              accessible={false}
              importantForAccessibility="no"
            />
          </Touchable>
        </View>

        {!showList ? (
          <>
            <View
              accessible={true}
              accessibilityRole="summary"
              accessibilityLabel={`${type === "daily" ? "Daily" : "Monthly"} usage bar chart, showing ${chartData.length} ${type === "daily" ? "days" : "months"} of download and upload data`}
              style={styles.srSummary}
            />
            <Animated.View
              style={{
                transform: [{ scaleY: barScale }, { translateY: barTranslateY }],
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
                  accessibilityElementsHidden={true}
                  importantForAccessibility="no-hide-descendants"
                />

                <View style={styles.chartScrollWrapper}>
                  {chartScrollable && <FadeEdge side="right" horizontal />}

                  <ScrollView
                    horizontal
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: chartScrollX } } }],
                      { useNativeDriver: false }
                    )}
                    onLayout={(e) => setChartViewportW(e.nativeEvent.layout.width)}
                    style={styles.chartScroll}
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    <View style={{ width: contentWidth, position: "relative" }}>
                      <View
                        accessibilityElementsHidden={true}
                        importantForAccessibility="no-hide-descendants"
                      >
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

                      <View
                        style={[styles.srGraphOverlay, { height: CHART_HEIGHT }]}
                        accessible={false}
                        onAccessibilityEscape={handleSkipChartData}
                        onMagicTap={handleSkipChartData}
                      >
                        {chartData.map((item, index) => {
                          const n = chartData.length;
                          const slotWidth = contentWidth / n;
                          return (
                            <Touchable
                              key={index}
                              accessible={true}
                              accessibilityLabel={buildBarA11yLabel(item, index)}
                              accessibilityHint={barA11yHint}
                              onAccessibilityEscape={handleSkipChartData}
                              onMagicTap={handleSkipChartData}
                              minSize={0}
                              style={{
                                position: "absolute",
                                left: index * slotWidth,
                                top: 0,
                                width: slotWidth,
                                height: CHART_HEIGHT,
                                alignItems: "stretch",
                              }}
                              onPress={() => handlePressBar(item, index)}
                            />
                          );
                        })}
                      </View>
                    </View>
                  </ScrollView>

                  {chartScrollable && (
                    <HScrollIndicator
                      scrollX={chartScrollX}
                      contentW={contentWidth}
                      viewportW={chartViewportW}
                    />
                  )}
                </View>
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: legendOpacity }}>
              <View
                ref={skipTargetRef}
                accessible={true}
                accessibilityLabel={`Legend. Blue represents Download, Cyan represents Upload. ${chartData?.length ?? 0} ${type === "daily" ? "days" : "months"} shown.`}
                style={styles.legend}
              >
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

            {/* Accessible prev/next nav for TalkBack (Android) */}
            {isScreenReaderEnabled && chartData.length > 0 && (
              <View style={styles.a11yNavRow}>
                <Touchable
                  style={styles.a11yNavButton}
                  onPress={() => {
                    const prev = Math.max(0, selectedIndex - 1);
                    handlePressBar(chartData[prev], prev);
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Previous bar"
                  accessibilityHint={selectedIndex <= 0 ? "Already at first item" : undefined}
                  disabled={selectedIndex <= 0}
                >
                  <MaterialCommunityIcons name="chevron-left" size={22} color={selectedIndex <= 0 ? theme.colors.borderLight : theme.colors.primary} />
                  <Text style={[styles.a11yNavText, selectedIndex <= 0 && { color: theme.colors.borderLight }]}>Previous</Text>
                </Touchable>

                <Text
                  style={styles.a11yNavCounter}
                  accessible={true}
                  accessibilityLabel={`Item ${selectedIndex + 1} of ${chartData.length}`}
                >
                  {selectedIndex + 1} / {chartData.length}
                </Text>

                <Touchable
                  style={styles.a11yNavButton}
                  onPress={() => {
                    const next = Math.min(chartData.length - 1, selectedIndex + 1);
                    handlePressBar(chartData[next], next);
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Next bar"
                  accessibilityHint={selectedIndex >= chartData.length - 1 ? "Already at last item" : undefined}
                  disabled={selectedIndex >= chartData.length - 1}
                >
                  <Text style={[styles.a11yNavText, selectedIndex >= chartData.length - 1 && { color: theme.colors.borderLight }]}>Next</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={selectedIndex >= chartData.length - 1 ? theme.colors.borderLight : theme.colors.primary} />
                </Touchable>
              </View>
            )}
          </>
        ) : (
          <>
            <View
              accessible={true}
              accessibilityRole="summary"
              accessibilityLabel={`${type === "daily" ? "Daily" : "Monthly"} usage list, ${chartData.length} items`}
              style={styles.srSummary}
            />
            <View style={styles.listOuterWrapper}>
              <View style={styles.listScrollRow}>
                {listContentH > listViewportH && <FadeEdge side="bottom" horizontal={false} />}

                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: listScrollY } } }],
                    { useNativeDriver: false }
                  )}
                  onContentSizeChange={(_w, h) => setListContentH(h)}
                  onLayout={(e) => setListViewportH(e.nativeEvent.layout.height)}
                  style={styles.listScrollContainer}
                  accessible={false}
                >
                  {chartData.map((item, index) => (
                    <View
                      key={index}
                      style={[styles.listItem, index === chartData.length - 1 && styles.lastListItem]}
                      accessible={true}
                      accessibilityLabel={`${formatPeriodLabel(item)}. Total: ${item.total.toFixed(2)} GB. Download: ${item.download.toFixed(2)} GB. Upload: ${item.upload.toFixed(2)} GB.`}
                    >
                      {/* Hide children from screen reader — parent label covers everything */}
                      <View
                        style={styles.listItemHeader}
                        importantForAccessibility="no-hide-descendants"
                        accessibilityElementsHidden={true}
                      >
                        <Text style={styles.periodLabel}>{formatPeriodLabel(item)}</Text>
                        <Text style={styles.totalLabel}>{item.total.toFixed(2)} GB</Text>
                      </View>
                      <View
                        style={styles.listItemRow}
                        importantForAccessibility="no-hide-descendants"
                        accessibilityElementsHidden={true}
                      >
                        <View style={styles.detailItem}>
                          <View style={[styles.detailDot, { backgroundColor: theme.colors.primaryDark }]} />
                          <Text style={styles.detailLabel}>Download (GB)</Text>
                          <Text style={styles.detailValue}>{item.download.toFixed(2)}</Text>
                        </View>
                      </View>
                      <View
                        style={styles.listItemRow}
                        importantForAccessibility="no-hide-descendants"
                        accessibilityElementsHidden={true}
                      >
                        <View style={styles.detailItem}>
                          <View style={[styles.detailDot, { backgroundColor: theme.colors.upload }]} />
                          <Text style={styles.detailLabel}>Upload (GB)</Text>
                          <Text style={styles.detailValue}>{item.upload.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {listContentH > listViewportH && (
                  <VScrollIndicator
                    scrollY={listScrollY}
                    contentH={listContentH}
                    viewportH={listViewportH}
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const fadeStyles = StyleSheet.create({
  hFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: FADE_SIZE,
    zIndex: 5,
  },
  hLeft: { left: 0 },
  hRight: { right: 0 },
  vFade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: FADE_SIZE,
    zIndex: 5,
  },
  vTop: { top: 0 },
  vBottom: { bottom: 0 },
});

const styles = StyleSheet.create({
  container: { marginHorizontal: theme.spacing.base, marginBottom: theme.spacing.base },
  card: { ...AppStyles.card, padding: theme.spacing.base },
  header: cardHeader.container,
  iconWrapper: cardHeader.iconWrapper,
  chartTitle: cardHeader.title,

  tabsContainer: {
    ...dataUsageTabs.tabsContainer,
    padding: 3,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    ...dataUsageTabs.tab,
    paddingVertical: 10,
    minHeight: 42,
    justifyContent: "center",
  },
  activeTab: dataUsageTabs.activeTab,
  tabText: {
    ...dataUsageTabs.tabText,
    fontSize: theme.typography.size.base,
    fontWeight: "700",
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

  chartScrollWrapper: {
    flex: 1,
  },
  chartScroll: {},
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

  listOuterWrapper: {
    marginTop: theme.spacing.xs,
  },
  listScrollRow: {
    flexDirection: "row",
  },
  listScrollContainer: {
    maxHeight: LIST_VIEW_HEIGHT,
    flex: 1,
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
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primaryDark,
  },

  srSummary: {
    height: 1,
    overflow: "hidden",
  },
  srGraphOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  // Accessible prev/next navigation for screen readers
  a11yNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  a11yNavButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 44,
    minWidth: 44,
  },
  a11yNavText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  a11yNavCounter: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },

  // No data state
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["3xl"],
    paddingHorizontal: theme.spacing.base,
  },
  noDataTitle: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  noDataSubtext: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
});

export default UsageChart;