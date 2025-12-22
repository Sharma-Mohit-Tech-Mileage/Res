import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityInfo,
  findNodeHandle,
  Linking,
} from "react-native";
import { Color, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { resentEmailVerifiction } from "../../../redux/actions/ProfileActionSuite";
import { useDispatch } from "react-redux";
import RenderText from "../RenderText";

import InfoIcon from "../../../../assets/svgs/InfoIcon";
import SuccessIcon from "../../../../assets/svgs/SuccessIcon";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";

const NotificationAlert = ({
  type,
  title,
  message,
  onClose,
  showCloseIcon = true,
  isVisible = true,
  resentemail = false,
  splitKey = "contact us",
}) => {
  if (!isVisible) return null;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const notificationRef = useRef(null);

  const normalizeSplitKey = (key) => {
    if (typeof key === "string") {
      return [{ text: key, action: "support", addLineBreak: false }];
    }

    if (Array.isArray(key)) {
      return key.map((item) => {
        if (typeof item === "string") {
          return { text: item, action: "support", addLineBreak: false };
        }
        return { ...item, addLineBreak: item.addLineBreak || false };
      });
    }

    return [{ text: "contact us", action: "support", addLineBreak: false }];
  };

  const handleActionPress = (item) => {
    if (!item || !item.action) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Support", params: { isContactUs: true } }],
      });
      return;
    }

    switch (item.action) {
      case "call":
        if (item.value) {
          Linking.openURL(`tel:${item.value}`).catch((err) =>
            console.error("Error opening phone dialer:", err)
          );
        }
        break;

      case "navigate":
        // ✅ DYNAMIC NAVIGATION
        if (item.tab) {
          // Navigate to tab, then to screen within that tab
          navigation.navigate(item.tab, {
            screen: item.screen,
            params: item.params || {},
          });
        } else {
          // Navigate directly to screen (same stack)
          navigation.navigate(item.screen, item.params || {});
        }
        break;

      case "support":
      default:
        navigation.reset({
          index: 0,
          routes: [{ name: "Support", params: { isContactUs: true } }],
        });
        break;
    }
  };

  const typeStyles = {
    info: {
      backgroundColor: "#F0F8FF",
      borderColor: "#0060AE",
      iconColor: "#0060AE",
      textColor: "#000000",
      titleColor: "#000000",
      closeButtonColor: "#0060AE",
      IconComponent: InfoIcon,
      iconLabel: "Information icon",
      labelPrefix: "Information Notification: ",
    },
    error: {
      backgroundColor: "#FEF3F2",
      borderColor: "#B92A1C",
      iconColor: Color.sparkLightRed,
      textColor: "#000000",
      titleColor: "#000000",
      closeButtonColor: "#B92A1C",
      IconComponent: InfoIcon,
      iconLabel: "Error icon",
      labelPrefix: "Error Notification: ",
    },
    success: {
      backgroundColor: "#F1FCF2",
      borderColor: "#1D7832",
      iconColor: Color.sparklightGreen,
      textColor: "#000000",
      titleColor: "#000000",
      closeButtonColor: "#1D7832",
      IconComponent: SuccessIcon,
      iconLabel: "Success icon",
      labelPrefix: "Success Notification: ",
    },
    warning: {
      backgroundColor: "#FFFAEB",
      borderColor: "#DD6D02",
      iconColor: Color.sparkLightInfo,
      textColor: "#000000",
      titleColor: "#000000",
      closeButtonColor: "#DD6D02",
      IconComponent: WarningIcon,
      iconLabel: "Warning icon",
      labelPrefix: "Warning Notification: ",
    },
  };

  const currentTypeStyle = typeStyles[type] || typeStyles.info;

  useEffect(() => {
    const checkAccessibility = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(isEnabled);
      } catch (error) {
        setIsScreenReaderEnabled(false);
      }
    };

    checkAccessibility();
    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isVisible && notificationRef.current) {
      const reactTag = findNodeHandle(notificationRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [isVisible]);

  const handleClose = () => onClose?.();
  const handleResendEmail = () => dispatch(resentEmailVerifiction(navigation));

  const renderMessageWithBoldAccount = (message) => {
    if (splitKey === "Account") {
      const parts = message.split("Account");
      return (
        <Text
          style={[
            !title ? styles.messageOnEmpty : styles.message,
            { color: currentTypeStyle.textColor },
          ]}
          accessible={true}
          accessibilityLabel={currentTypeStyle.labelPrefix + (message || "")}
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
        >
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <Text
                  style={[
                    styles.boldText,
                    { color: currentTypeStyle.textColor },
                  ]}
                >
                  Account
                </Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }

    const normalizedSplitKeys = normalizeSplitKey(splitKey);

    if (
      normalizedSplitKeys.length > 1 ||
      (normalizedSplitKeys.length === 1 &&
        normalizedSplitKeys[0].action &&
        normalizedSplitKeys[0].action !== "support")
    ) {
      let remainingMessage = message;
      const segments = [];

      normalizedSplitKeys.forEach((item, index) => {
        const splitIndex = remainingMessage.indexOf(item.text);

        if (splitIndex > -1) {
          if (splitIndex > 0) {
            segments.push({
              type: "text",
              content: remainingMessage.substring(0, splitIndex),
              key: `text-${index}`,
            });
          }

          segments.push({
            type: "styled",
            content: item.text,
            action: item,
            key: `styled-${index}`,
          });

          remainingMessage = remainingMessage.substring(
            splitIndex + item.text.length
          );

          if (item.addLineBreak) {
            segments.push({
              type: "linebreak",
              key: `linebreak-${index}`,
            });
          }
        }
      });

      if (remainingMessage) {
        segments.push({
          type: "text",
          content: remainingMessage,
          key: "text-end",
        });
      }

      return (
        <Text
          style={[
            !title ? styles.messageOnEmpty : styles.message,
            { color: currentTypeStyle.textColor },
          ]}
          accessible={true}
          accessibilityLabel={currentTypeStyle.labelPrefix + (message || "")}
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
        >
          {segments.map((segment) => {
            if (segment.type === "text") {
              const parts = segment.content.split("\n");
              if (parts.length > 1) {
                return (
                  <Text key={segment.key}>
                    {parts.map((part, idx) => (
                      <React.Fragment key={`${segment.key}-line-${idx}`}>
                        {part}
                        {idx < parts.length - 1 && "\n"}
                      </React.Fragment>
                    ))}
                  </Text>
                );
              }
              return <Text key={segment.key}>{segment.content}</Text>;
            } else if (segment.type === "linebreak") {
              return <Text key={segment.key}>{"\n"}</Text>;
            } else {
              return (
                <Text
                  key={segment.key}
                  style={styles.styledText}
                  onPress={() => handleActionPress(segment.action)}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityHint={`Double tap to ${
                    segment.action.action === "call" ? "call" : "open"
                  } ${segment.content}`}
                >
                  {segment.content}
                </Text>
              );
            }
          })}
        </Text>
      );
    }

    return (
      <RenderText
        navigation={navigation}
        splitKey={typeof splitKey === "string" ? splitKey : splitKey[0]}
        instruction={message}
        isFromNotification={true}
        style={[
          !title ? styles.messageOnEmpty : styles.message,
          { color: currentTypeStyle.textColor },
        ]}
        onTextPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Support", params: { isContactUs: true } }],
          });
        }}
      />
    );
  };

  const IconComponent = currentTypeStyle.IconComponent;

  return (
    <View style={styles.outerContainer}>
      <View
        ref={notificationRef}
        style={[
          styles.notificationContainer,
          {
            backgroundColor: currentTypeStyle.backgroundColor,
            borderColor: currentTypeStyle.borderColor,
          },
        ]}
      >
        <View
          style={[
            styles.iconStyle,
            { marginTop: !title ? 1 : 1, marginEnd: 10 },
          ]}
          accessible={true}
          accessibilityLabel={currentTypeStyle.iconLabel}
          accessibilityRole="text"
        >
          <IconComponent
            width={18}
            height={18}
            color={currentTypeStyle.iconColor}
            accessible={false}
            importantForAccessibility="no"
          />
        </View>

        <View
          style={[
            styles.textContentContainer,
            { flex: 1 },

            !showCloseIcon && styles.textContentContainerNoClose,
          ]}
        >
          {title && (
            <Text
              style={[styles.title, { color: currentTypeStyle.titleColor }]}
              accessible={true}
              accessibilityLabel={title}
              accessibilityRole="text"
            >
              {title}
            </Text>
          )}

          {message && renderMessageWithBoldAccount(message)}

          {resentemail && (
            <TouchableOpacity
              onPress={handleResendEmail}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Resend Confirmation Email."
              accessibilityHint="Double tap to resend the confirmation email."
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.resendText}>Resend Confirmation Email</Text>
            </TouchableOpacity>
          )}
        </View>

        {showCloseIcon && (
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            accessible={true}
            accessibilityLabel="Close"
            accessibilityHint="Double tap to close"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={[
                styles.closeButtonText,
                { color: currentTypeStyle.closeButtonColor },
              ]}
            >
              {" ✕"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "relative",
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    marginVertical: 8,
  },
  textContentContainer: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 10,
  },
  textContentContainerNoClose: {
    paddingRight: 0,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 24,
    height: 24,
    marginLeft: 12,
    marginRight: 0,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  message: {
    paddingTop: 8,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    paddingLeft: 0,
    paddingRight: 0,
  },
  messageOnEmpty: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    paddingLeft: 0,
    paddingRight: 0,
  },
  boldText: {
    fontWeight: "700",
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
  },
  contactUsText: {
    color: "#000000",
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    paddingLeft: 5,
    flexWrap: "wrap",
  },
  resendText: {
    color: "#000000",
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    paddingTop: 8,
    textDecorationLine: "underline",
  },
  styledText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default NotificationAlert;
