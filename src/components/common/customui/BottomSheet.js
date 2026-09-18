import React, { useRef } from "react";
import { Modal, View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Touchable from "./Touchable";
import IconButton from "./IconButton";
import { FieldTitle } from "./Typography";
import CloseIcon from "../../../res/svgIcons/CloseIcon";
import { theme } from "../../../styles/theme";
import { setFocusToRef } from "../../../utils/a11y";

const BottomSheet = ({ visible, title, onClose, children, sheetStyle, headerStyle, titleStyle, contentContainerStyle }) => {
  const insets = useSafeAreaInsets();
  const titleRef = useRef(null);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => setFocusToRef(titleRef)}
    >
      <View style={styles.overlay}>
        <Touchable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel={`Close ${title}`}
        />
        <View
          style={[
            styles.sheet,
            sheetStyle,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) },
          ]}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
        >
          <View style={styles.handle} accessible={false} />
          <View style={[styles.header, headerStyle]}>
            <FieldTitle
              ref={titleRef}
              style={[styles.title, titleStyle]}
              accessibilityRole="header"
            >
              {title}
            </FieldTitle>
            <IconButton accessibilityLabel={`Close ${title}`} onPress={onClose}>
              <CloseIcon width={24} height={24} viewBox="0 0 18 18" accessible={false} />
            </IconButton>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, contentContainerStyle]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  sheet: {
    maxHeight: "80%",
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: theme.spacing.lg,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.spacing["2xl"],
    paddingRight: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  title: { flex: 1, fontSize: theme.typography.size["2xl"] },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: {
    paddingHorizontal: theme.spacing["2xl"],
    paddingBottom: theme.spacing.base,
  },
});
export default BottomSheet;
