import React, { useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
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

/**
 * Format phone number for screen reader accessibility
 * Converts "8885551234" to "8 8 8. 5 5 5. 1 2 3 4" for natural pronunciation
 */
const formatPhoneForScreenReader = (phoneNumber) => {
  if (!phoneNumber) return "";
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 10) {
    const part1 = digits.slice(0, 3).split("").join(" ");
    const part2 = digits.slice(3, 6).split("").join(" ");
    const part3 = digits.slice(6).split("").join(" ");
    return `${part1}. ${part2}. ${part3}`;
  }

  if (digits.length === 11 && digits[0] === "1") {
    const part1 = digits.slice(1, 4).split("").join(" ");
    const part2 = digits.slice(4, 7).split("").join(" ");
    const part3 = digits.slice(7).split("").join(" ");
    return `${part1}. ${part2}. ${part3}`;
  }

  return digits.split("").join(" ");
};

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

/**
 * UPDATED:
 * - Respects real newline(s) in `message` and turns them into "linebreak" segments.
 * - Still supports splitKey styling/action within each line.
 */
const parseMessage = (message, splitKeys) => {
  const safeMsg = message || "";
  const lines = safeMsg.split(/\n+/);

  const allSegments = [];
  let globalIndex = 0;

  lines.forEach((line, lineIdx) => {
    // No split keys -> single text segment for this line
    if (splitKeys.length === 0) {
      allSegments.push({
        type: "text",
        content: line || "",
        key: `text-${globalIndex++}`,
      });
    } else {
      // Apply split-key logic per line
      let remaining = line || "";
      splitKeys.forEach((item) => {
        const index = remaining.indexOf(item.text);
        if (index === -1) return;

        if (index > 0) {
          allSegments.push({
            type: "text",
            content: remaining.substring(0, index),
            key: `text-${globalIndex++}`,
          });
        }

        allSegments.push({
          type: "styled",
          content: item.text,
          action: item,
          key: `styled-${globalIndex++}`,
        });

        if (item.addLineBreak) {
          allSegments.push({ type: "linebreak", key: `br-${globalIndex++}` });
        }

        remaining = remaining.substring(index + item.text.length);
      });

      if (remaining) {
        allSegments.push({
          type: "text",
          content: remaining,
          key: `text-${globalIndex++}`,
        });
      }
    }

    // Real newline -> block break
    if (lineIdx < lines.length - 1) {
      allSegments.push({ type: "linebreak", key: `br-${globalIndex++}` });
    }
  });

  return allSegments;
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
    case "call":
      return `Call ${formatPhoneForScreenReader(content)}`;
    case "navigate":
      return `Navigate to ${action.screen || content}`;
    default:
      return `Contact support about ${content}`;
  }
};

const buildPlainText = (segments) =>
  segments.map((s) => (s.type === "linebreak" ? " " : s.content || "")).join("");

const buildAccessibilityLabel = (segments, config, hasActions) => {
  const plainText = buildPlainText(segments);

  if (!hasActions) {
    return config.labelPrefix + plainText;
  }

  const actionSegments = segments.filter((s) => s.type === "styled");
  const actionDescriptions = actionSegments
    .map((seg) => {
      if (seg.action?.action === "call") {
        return `phone number ${formatPhoneForScreenReader(seg.content)}`;
      }
      if (seg.action?.action === "navigate") {
        return `link to ${seg.action.screen || seg.content}`;
      }
      return `action: ${seg.content}`;
    })
    .join(", and ");

  return `${config.labelPrefix}${plainText}. Contains ${actionDescriptions}`;
};

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
  const titleRef = useRef(null);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const IconComponent = config.IconComponent;

  const normalizedKeys = useMemo(() => normalizeSplitKey(splitKey), [splitKey]);
  const segments = useMemo(
    () => parseMessage(message, normalizedKeys),
    [message, normalizedKeys]
  );
  const blocks = useMemo(() => groupSegmentsByLineBreaks(segments), [segments]);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const titleNode = findNodeHandle(titleRef.current);
      if (titleNode) {
        AccessibilityInfo.setAccessibilityFocus(titleNode);
      }

      AccessibilityInfo.announceForAccessibility(
        `${config.labelPrefix}${title || "Notification"}`
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [isVisible, title, config.labelPrefix]);

  const executeAction = useCallback(
    (actionConfig) => {
      if (!actionConfig) return;

      if (actionConfig.action === "navigate") {
        if (actionConfig.tab) {
          navigation.navigate(actionConfig.tab, {
            screen: actionConfig.screen,
            params: actionConfig.params || {},
          });
        } else {
          navigation.navigate(actionConfig.screen, actionConfig.params || {});
        }
        return;
      }

      if (actionConfig.action === "call" && actionConfig.value) {
        const phoneNumber = actionConfig.value.replace(/\D/g, "");
        Linking.openURL(`tel:${phoneNumber}`).catch((error) => {
          console.error("Failed to open phone dialer:", error);
          Alert.alert("Error", "Unable to open phone dialer");
        });
        return;
      }

      navigation.navigate("Support", { isContactUs: true });
    },
    [navigation]
  );

  const showActionSelection = useCallback(
    (actionSegments, blockText) => {
      const options = actionSegments.map((seg) => ({
        text: getActionLabel(seg.action, seg.content),
        onPress: () => executeAction(seg.action),
      }));

      Alert.alert(
        "Choose Action",
        blockText,
        [...options, { text: "Cancel", style: "cancel" }],
        { cancelable: true }
      );
    },
    [executeAction]
  );

  const renderBlock = useCallback(
    (block) => {
      const { segments: blockSegments, key } = block;
      const actionSegments = blockSegments.filter((s) => s.type === "styled");
      const hasActions = actionSegments.length > 0;
      const plainText = buildPlainText(blockSegments);

      // ✅ UPDATED: NO ACTIONS => render *one separate Text element per block*
      // This makes each block independently focusable + identifiable by SR.
      if (!hasActions) {
        return (
          <View
            key={key}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={config.labelPrefix + plainText}
            style={styles.blockWrapper}
          >
            <Text style={[styles.messageText, { color: config.textColor }]}>
              {plainText}
            </Text>
          </View>
        );
      }


      if (actionSegments.length === 1) {
        const action = actionSegments[0].action;
        const actionType = action?.action;

        return (
          <Pressable
            key={key}
            accessible={true}
            accessibilityRole={actionType === "call" ? "button" : "link"}
            accessibilityLabel={buildAccessibilityLabel(
              blockSegments,
              config,
              true
            )}
            accessibilityHint={
              actionType === "call"
                ? "Double tap to call"
                : actionType === "navigate"
                ? "Double tap to navigate"
                : "Double tap to contact support"
            }
            onPress={() => executeAction(action)}
            style={styles.blockWrapper}
          >
            <Text >
              {blockSegments.map((segment) => (
                <Text
                  key={segment.key}
                  style={[
                    styles.messageText,
                    { color: config.textColor },
                    segment.type === "styled" && styles.styledText,
                  ]}
                >
                  {segment.content}
                </Text>
              ))}
            </Text>
          </Pressable>
        );
      }

      const accessibilityActions = [
        { name: "activate", label: "Show all options" },
        ...actionSegments.map((seg, index) => ({
          name: `action_${index}`,
          label: getActionLabel(seg.action, seg.content),
        })),
      ];

      const handleAccessibilityAction = (event) => {
        const actionName = event.nativeEvent.actionName;

        if (actionName === "activate") {
          showActionSelection(actionSegments, plainText);
          return;
        }

        const index = parseInt(actionName.split("_")[1], 10);
        if (!Number.isNaN(index) && actionSegments[index]) {
          executeAction(actionSegments[index].action);
        }
      };

      return (
        <Pressable
          key={key}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={buildAccessibilityLabel(blockSegments, config, true)}
          accessibilityHint="Actions available. Double tap to show options, or use rotor to access individual actions"
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={handleAccessibilityAction}
          onPress={() => showActionSelection(actionSegments, plainText)}
          style={styles.blockWrapper}
        >
          <Text >
            {blockSegments.map((segment) => (
              <Text
                key={segment.key}
                style={[
                  styles.messageText,
                  { color: config.textColor },
                  segment.type === "styled" && styles.styledText,
                ]}
              >
                {segment.content}
              </Text>
            ))}
          </Text>
        </Pressable>
      );
    },
    [config, executeAction, showActionSelection]
  );

  if (!isVisible) return null;

  return (
    <View style={styles.outer} accessibilityLiveRegion="polite">
      <View
        ref={containerRef}
        style={[
          styles.container,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            !title && styles.iconWithoutTitle
          ]}
          accessible={true}
          accessibilityLabel={config.iconLabel}
          accessibilityRole="image"
        >
          <IconComponent width={18} height={18} color={config.iconColor} />
        </View>

       
        <View style={styles.content} accessible={false}>
         
          {title && (
            <View ref={titleRef} accessible={true} accessibilityRole="header">
              <Text style={[styles.title, { color: config.titleColor }]}>
                {title}
              </Text>
            </View>
          )}

          {blocks.map(renderBlock)}

          {resentemail && (
            <Pressable
              onPress={() => dispatch(resentEmailVerifiction(navigation))}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Resend confirmation email"
              accessibilityHint="Double tap to resend"
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>Resend Confirmation Email</Text>
            </Pressable>
          )}
        </View>

        {showCloseIcon && (
          <Pressable
            onPress={onClose}
            style={styles.closeBtn}
            accessible={true}
            accessibilityLabel="Close notification"
            accessibilityRole="button"
            accessibilityHint="Double tap to dismiss"
          >
            <Text style={[styles.closeBtnText, { color: config.closeButtonColor }]}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: "relative",
  },
  container: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  iconWrapper: {
    marginTop: 1,
    marginEnd: 10,
  },
  iconWithoutTitle: {
    marginTop: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  blockWrapper: {
    marginTop: 8,
  },
  messageText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  styledText: {
    color: Color.colorMidnightblue,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  resendButton: {
    marginTop: 8,
  },
  resendText: {
    color: "#000000",
    fontWeight: "700",
    paddingTop: 8,
    textDecorationLine: "underline",
  },
  closeBtn: {
    marginLeft: 12,
    alignSelf: "center",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default NotificationAlert;