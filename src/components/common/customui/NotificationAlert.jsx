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
  Platform,
} from "react-native";
import { Color, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resentEmailVerifiction } from "../../../redux/actions/ProfileActionSuite";
import InfoIcon from "../../../../assets/svgs/InfoIcon";
import SuccessIcon from "../../../../assets/svgs/SuccessIcon";
import CloseIcon from "../../../res/svgIcons/CloseIcon";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import { A11y } from "react-native-a11y-order";


const TYPE_CONFIG = {
  info: {
    backgroundColor: "#F0F8FF",
    borderColor: "#0060AE",
    iconColor: "#0060AE",
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#000000",
    IconComponent: InfoIcon,
    iconLabel: "Information icon",
    labelPrefix: "Information: ",
  },
  error: {
    backgroundColor: "#FEF3F2",
    borderColor: "#B92A1C",
    iconColor: Color.sparkLightRed,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#000000",
    IconComponent: InfoIcon,
    iconLabel: "Error icon",
    labelPrefix: "Error: ",
  },
  success: {
    backgroundColor: "#F1FCF2",
    borderColor: "#1D7832",
    iconColor: Color.sparklightGreen,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#000000",
    IconComponent: SuccessIcon,
    iconLabel: "Success icon",
    labelPrefix: "Success: ",
  },
  warning: {
    backgroundColor: "#FFFAEB",
    borderColor: "#DD6D02",
    iconColor: Color.sparkLightInfo,
    textColor: "#000000",
    titleColor: "#000000",
    closeButtonColor: "#000000",
    IconComponent: WarningIcon,
    iconLabel: "Warning icon",
    labelPrefix: "Warning: ",
  },
};

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

const parseMessage = (message, splitKeys) => {
  const safeMsg = message || "";
  const lines = safeMsg.split(/\n+/);

  const allSegments = [];
  let globalIndex = 0;

  lines.forEach((line, lineIdx) => {
    if (splitKeys.length === 0) {
      allSegments.push({
        type: "text",
        content: line || "",
        key: `text-${globalIndex++}`,
      });
    } else {
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
  segments
    .map((s) => (s.type === "linebreak" ? " " : s.content || ""))
    .join("");

const buildAccessibilityLabel = (segments, config, hasActions) => {
  const plainText = buildPlainText(segments);

  if (!hasActions) {
    return plainText;
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

  return `${plainText}. Contains ${actionDescriptions}`;
};

const NotificationAlert = ({
  type = "info",
  title,
  message,
  onClose,
  showCloseIcon = true,
  isVisible = true,
  resentemail = false,
  autoFocusTitle = false,
  splitKey = "",
  iconRef = null,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const closeRef = useRef(null);
  const resendRef = useRef(null);
  const blockRefs = useRef([]);
  const internalIconRef = useRef(null);
  
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const IconComponent = config.IconComponent;


  // Aggressively force focus to the success icon on Android after alert is visible
  useEffect(() => {
    if (!isVisible || type !== 'success' || !internalIconRef.current) return;
    let timeouts = [];
    const focusIcon = () => {
      const handle = findNodeHandle(internalIconRef.current);
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    };
    // Multiple retries to override navigation focus stealing
    const delays = Platform.OS === 'android' ? [50, 150, 300, 600, 1000, 1500, 2000] : [100, 300, 600];
    delays.forEach((ms) => {
      timeouts.push(setTimeout(focusIcon, ms));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isVisible, type]);

  const normalizedKeys = useMemo(() => normalizeSplitKey(splitKey), [splitKey]);
  const segments = useMemo(
    () => parseMessage(message, normalizedKeys),
    [message, normalizedKeys]
  );
  const blocks = useMemo(() => groupSegmentsByLineBreaks(segments), [segments]);


  // Expose the icon ref to parent if callback provided
  useEffect(() => {
    if (iconRef && internalIconRef.current) {
      if (typeof iconRef === 'function') {
        iconRef(internalIconRef.current);
      } else {
        iconRef.current = internalIconRef.current;
      }
    }
  }, [iconRef]);

  // Initialize block refs array
  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, blocks.length);
  }, [blocks.length]);

  // Set accessibility focus and force correct order on iOS
  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      // Set initial focus
      let focusTarget = null;
      // For success alerts (iOS + Android), prefer focusing the icon so screen readers land on "Success icon".
      if (type === "success" && internalIconRef.current) {
        focusTarget = findNodeHandle(internalIconRef.current);
      } else if (autoFocusTitle && titleRef.current) {
        focusTarget = findNodeHandle(titleRef.current);
      } else if (titleRef.current) {
        focusTarget = findNodeHandle(titleRef.current);
      } else if (containerRef.current) {
        focusTarget = findNodeHandle(containerRef.current);
      }
      
      if (focusTarget) {
        AccessibilityInfo.setAccessibilityFocus(focusTarget);
      }

      // Do NOT announce here - let parent component handle announcements to avoid duplication

      // Force correct accessibility order on iOS
      if (Platform.OS === "ios" && containerRef.current) {
        const elements = [];
        
        // Add title
        if (titleRef.current) {
          const titleHandle = findNodeHandle(titleRef.current);
          if (titleHandle) elements.push(titleHandle);
        }
        
        // Add all message blocks in order
        blockRefs.current.forEach((ref) => {
          if (ref) {
            const handle = findNodeHandle(ref);
            if (handle) elements.push(handle);
          }
        });
        
        // Add resend button if present
        if (resentemail && resendRef.current) {
          const resendHandle = findNodeHandle(resendRef.current);
          if (resendHandle) elements.push(resendHandle);
        }
        
        // Add close button last
        if (showCloseIcon && closeRef.current) {
          const closeHandle = findNodeHandle(closeRef.current);
          if (closeHandle) elements.push(closeHandle);
        }

        // Apply the order
        if (elements.length > 0) {
          const containerHandle = findNodeHandle(containerRef.current);
          if (containerHandle) {
            // This forces iOS to respect our ordering
            containerRef.current.setNativeProps({
              accessibilityElements: elements,
            });

            // Avoid stealing focus away from the success icon.
            if (type !== "success") {
              AccessibilityInfo.setAccessibilityFocus(containerHandle);
            } else if (internalIconRef.current) {
              // Some iOS versions reset focus after setNativeProps; re-focus the icon.
              const iconHandle = findNodeHandle(internalIconRef.current);
              if (iconHandle) {
                setTimeout(() => {
                  AccessibilityInfo.setAccessibilityFocus(iconHandle);
                }, 50);
              }
            }
          }
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [isVisible, title, config.labelPrefix, blocks.length, resentemail, showCloseIcon, autoFocusTitle]);

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
    (block, index) => {
      const { segments: blockSegments, key } = block;
      const actionSegments = blockSegments.filter((s) => s.type === "styled");
      const hasActions = actionSegments.length > 0;
      const plainText = buildPlainText(blockSegments);

      if (!hasActions) {
        return (
          <View
            key={key}
            ref={(el) => (blockRefs.current[index] = el)}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={plainText}
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
            ref={(el) => (blockRefs.current[index] = el)}
            accessible={true}
            accessibilityRole="link"
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
            <Text>
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
        ...actionSegments.map((seg, idx) => ({
          name: `action_${idx}`,
          label: getActionLabel(seg.action, seg.content),
        })),
      ];

      const handleAccessibilityAction = (event) => {
        const actionName = event.nativeEvent.actionName;

        if (actionName === "activate") {
          showActionSelection(actionSegments, plainText);
          return;
        }

        const actionIndex = parseInt(actionName.split("_")[1], 10);
        if (!Number.isNaN(actionIndex) && actionSegments[actionIndex]) {
          executeAction(actionSegments[actionIndex].action);
        }
      };

      return (
        <Pressable
          key={key}
          ref={(el) => (blockRefs.current[index] = el)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={buildAccessibilityLabel(
            blockSegments,
            config,
            true
          )}
          accessibilityHint="Actions available. Double tap to show options, or use rotor to access individual actions"
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={handleAccessibilityAction}
          onPress={() => showActionSelection(actionSegments, plainText)}
          style={styles.blockWrapper}
        >
          <Text>
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
    <View style={styles.outer}>
      <A11y.Order style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
      <View
        ref={containerRef}
        accessible={false}
          importantForAccessibility="no"
        style={[
          styles.container,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
      >
        <A11y.Index index={0}>
        <View
          ref={internalIconRef}
          style={[styles.iconWrapper, !title && styles.iconWithoutTitle]}
          accessible={true}
          importantForAccessibility="yes"
          accessibilityRole="text"
          accessibilityLabel={config.iconLabel}
          focusable={false}
          accessibilityState={undefined}
          accessibilityHint={undefined}
        >
          <IconComponent
            width={24}
            height={24}
            color={config.iconColor}
            accessible={false}
          />
        </View>
    </A11y.Index>
       
        <View 
          ref={contentRef}
          style={styles.content}
          accessible={false}
          importantForAccessibility="yes"
        >

          {title && (
            <A11y.Index index={1}>
            <View accessible={true} accessibilityRole="header">
              <Text ref={titleRef} 
              style={[styles.title, { color: config.titleColor }]}
              accessible={true}
              accessibilityRole="header" accessibilityLevel={2}
            >
                {title}
              </Text>
            </View>
            </A11y.Index>
          )}
          <A11y.Index index={2}> 
           <View > 
          {blocks.map((block, index) => renderBlock(block, index))}
          </View>
          </A11y.Index>

          {resentemail && (
            <A11y.Index index={3}>
            <Pressable
              ref={resendRef}
              onPress={() => dispatch(resentEmailVerifiction(navigation))}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Resend confirmation email"
              accessibilityHint="Double tap to resend"
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>Resend Confirmation Email</Text>
            </Pressable>
            </A11y.Index>
          )}
        </View>

        {showCloseIcon && (
          <A11y.Index index={4}>
            <Pressable
              ref={closeRef}
              onPress={onClose}
              style={styles.closeBtn}
              accessible={true}
              accessibilityLabel="Close notification"
              accessibilityRole="button"
              accessibilityHint="Double tap to dismiss"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >

              {Platform.OS === "ios" ? (
                <CloseIcon
                  width={16}
                  height={16}
                  color={config.closeButtonColor}
                />
              ) : (
                <Text style={[styles.closeBtnText, { color: config.closeButtonColor }]}>
                  ✕
                </Text>
              )}
            </Pressable>
          </A11y.Index>
        )}
      </View>
      </A11y.Order>
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
    alignSelf: "flex-start",
    padding: 8,
    marginTop: 4,
    marginRight: 4,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default NotificationAlert;