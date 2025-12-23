import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityInfo,
  findNodeHandle,
  Linking,
  Alert,
} from "react-native";
import { Color, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resentEmailVerifiction } from "../../../redux/actions/ProfileActionSuite";

import InfoIcon from "../../../../assets/svgs/InfoIcon";
import SuccessIcon from "../../../../assets/svgs/SuccessIcon";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";

// ==================== CONSTANTS ====================

const TYPE_CONFIG = {
  info: {
    backgroundColor: "#F0F8FF",
    borderColor: "#0060AE",
    iconColor: "#0060AE",
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#0060AE",
    IconComponent: InfoIcon,
    iconLabel: "Information",
    labelPrefix: "Information: ",
  },
  error: {
    backgroundColor: "#FEF3F2",
    borderColor: "#B92A1C",
    iconColor: Color.sparkLightRed,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#B92A1C",
    IconComponent: InfoIcon,
    iconLabel: "Error",
    labelPrefix: "Error: ",
  },
  success: {
    backgroundColor: "#F1FCF2",
    borderColor: "#1D7832",
    iconColor: Color.sparklightGreen,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#1D7832",
    IconComponent: SuccessIcon,
    iconLabel: "Success",
    labelPrefix: "Success: ",
  },
  warning: {
    backgroundColor: "#FFFAEB",
    borderColor: "#DD6D02",
    iconColor: Color.sparkLightInfo,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#DD6D02",
    IconComponent: WarningIcon,
    iconLabel: "Warning",
    labelPrefix: "Warning: ",
  },
};

// ==================== UTILITIES ====================

const normalizeSplitKey = (key) => {
  if (!key) return [];
  if (typeof key === "string") return [{ text: key, action: "support" }];
  if (Array.isArray(key)) {
    return key.map((item) =>
      typeof item === "string" ? { text: item, action: "support" } : { ...item }
    );
  }
  return [];
};

const parseMessage = (message, splitKeys) => {
  if (!message || splitKeys.length === 0) {
    return [{ type: "text", content: message || "", key: "text-only" }];
  }
  const segments = [];
  let remaining = message;
  let segmentIndex = 0;

  splitKeys.forEach((item) => {
    const index = remaining.indexOf(item.text);
    if (index === -1) return;
    if (index > 0) {
      segments.push({
        type: "text",
        content: remaining.substring(0, index),
        key: `text-${segmentIndex++}`,
      });
    }
    segments.push({
      type: "styled",
      content: item.text,
      action: item,
      key: `styled-${segmentIndex++}`,
    });
    if (item.addLineBreak) {
      segments.push({ type: "linebreak", key: `br-${segmentIndex++}` });
    }
    remaining = remaining.substring(index + item.text.length);
  });

  if (remaining) {
    segments.push({ type: "text", content: remaining, key: `text-${segmentIndex}` });
  }
  return segments;
};

const groupSegmentsByLineBreaks = (segments) => {
  const blocks = [];
  let currentBlock = [];
  let blockIndex = 0;
  segments.forEach((segment) => {
    if (segment.type === "linebreak") {
      if (currentBlock.length > 0) {
        blocks.push({ segments: currentBlock, key: `block-${blockIndex++}` });
        currentBlock = [];
      }
    } else {
      currentBlock.push(segment);
    }
  });
  if (currentBlock.length > 0) {
    blocks.push({ segments: currentBlock, key: `block-${blockIndex}` });
  }
  return blocks;
};

const getActionLabel = (action, content) => {
  switch (action?.action) {
    case "call": return `Call ${content}`;
    case "navigate": return `Open ${content}`;
    default: return `Action: ${content}`;
  }
};

const buildPlainText = (segments) =>
  segments.map((s) => (s.type === "linebreak" ? " " : s.content || "")).join("");

// ==================== MAIN COMPONENT ====================

const NotificationAlert = ({
  type = "info",
  title,
  message,
  onClose,
  showCloseIcon = true,
  isVisible = true,
  resentemail = false,
  splitKey = "",
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const containerRef = useRef(null);
  
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const IconComponent = config.IconComponent;
  const normalizedKeys = normalizeSplitKey(splitKey);
  const segments = parseMessage(message, normalizedKeys);
  const blocks = groupSegmentsByLineBreaks(segments);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const tag = findNodeHandle(containerRef.current);
      if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, [isVisible]);

  const executeAction = (actionConfig) => {
    if (!actionConfig) return;
    if (actionConfig.action === "navigate") {
        if (actionConfig.tab) {
            navigation.navigate(actionConfig.tab, { screen: actionConfig.screen, params: actionConfig.params || {} });
        } else {
            navigation.navigate(actionConfig.screen, actionConfig.params || {});
        }
    } else if (actionConfig.action === "call" && actionConfig.value) {
        Linking.openURL(`tel:${actionConfig.value}`).catch(console.error);
    } else {
        navigation.navigate("Support", { isContactUs: true });
    }
  };

  const showActionSelection = (actions) => {
    const options = actions.map(seg => ({
      text: getActionLabel(seg.action, seg.content),
      onPress: () => executeAction(seg.action)
    }));
    Alert.alert("Available Actions", "Select an option:", [...options, { text: "Cancel", style: "cancel" }]);
  };

  const renderBlock = (block) => {
    const { segments, key } = block;
    const actionSegments = segments.filter(s => s.type === "styled");
    const hasActions = actionSegments.length > 0;
    const hasMultiple = actionSegments.length > 1;

    const handlePress = () => {
      if (hasMultiple) {
        showActionSelection(actionSegments);
      } else if (actionSegments.length === 1) {
        executeAction(actionSegments[0].action);
      }
    };

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={hasActions ? 0.7 : 1}
        onPress={handlePress}
        style={styles.blockWrapper}
        // EACH BLOCK IS ITS OWN UNIT NOW
        accessible={true}
        accessibilityRole={hasActions ? "button" : "text"}
        accessibilityLabel={config.labelPrefix + buildPlainText(segments)}
      >
        <Text style={styles.messageContainer}>
          {segments.map((segment) => (
            <Text
              key={segment.key}
              style={[
                styles.messageText,
                { color: config.textColor },
                segment.type === "styled" && styles.styledText
              ]}
            >
              {segment.content}
            </Text>
          ))}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.outer}>
      <View ref={containerRef} style={[styles.container, { backgroundColor: config.backgroundColor, borderColor: config.borderColor }]}>
        <View style={styles.iconWrapper} accessible={true} accessibilityLabel={config.iconLabel} accessibilityRole="image">
          <IconComponent width={18} height={18} color={config.iconColor} />
        </View>
        
        {/* PARENT VIEW HAS accessible={false} TO PREVENT UNIT FLATTENING */}
        <View style={styles.content} accessible={false}>
          {title && (
            <Text style={[styles.title, { color: config.titleColor }]} accessible={true} accessibilityRole="header">
              {title}
            </Text>
          )}
          
          {/* Blocks are separated by line breaks and identified as distinct stops */}
          {blocks.map(renderBlock)}

          {resentemail && (
            <TouchableOpacity onPress={() => dispatch(resentEmailVerifiction(navigation))} accessible={true} accessibilityRole="button">
              <Text style={styles.resendText}>Resend Confirmation Email</Text>
            </TouchableOpacity>
          )}
        </View>

        {showCloseIcon && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessible={true} accessibilityLabel="Close notification" accessibilityRole="button">
            <Text style={[styles.closeBtnText, { color: config.closeButtonColor }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: { position: "relative" },
  container: { flexDirection: "row", padding: 16, borderWidth: 1, borderRadius: 8, marginVertical: 8 },
  iconWrapper: { marginTop: 1, marginEnd: 10 },
  content: { flex: 1, marginLeft: 10 },
  title: { fontSize: FontSize.size_base, fontFamily: FontFamily.interBold, fontWeight: "700" },
  blockWrapper: { marginTop: 8 },
  messageContainer: { /* Natural wrapping container */ },
  messageText: { fontSize: FontSize.size_sm, fontFamily: FontFamily.openSansRegular },
  styledText: { color: Color.colorMidnightblue, fontWeight: "700", textDecorationLine: "underline" },
  resendText: { color: "#000000", fontWeight: "700", paddingTop: 8, textDecorationLine: "underline" },
  closeBtn: { marginLeft: 12, alignSelf: "center", width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  closeBtnText: { fontSize: 16, fontWeight: "700" },
});

export default NotificationAlert;