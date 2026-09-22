import React, { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { Animated, Keyboard, Platform, ScrollView, TextInput } from "react-native";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";

// 54136: shared keyboard handling for form screens — scroll the focused input above the keyboard only as far as needed, keep a small gap, keep the content scrollable while the keyboard is up.
export const KEYBOARD_GAP = 16;
const isIOS = () => Platform.OS === "ios";

// How far the content must move so the input's bottom edge clears the obstruction by `gap`; 0 when it already does.
export const computeScrollDelta = ({ inputBottom, visibleBottom, gap = KEYBOARD_GAP }) =>
  Math.max(0, inputBottom + gap - visibleBottom);

// The lowest y (window coords) an input can occupy and still be seen: iOS keeps the window and reports the keyboard frame; Android's adjustResize shrinks the window, so the scroll view's own bottom edge sits on the keyboard, but the absolute tab bar still overlays it.
export const resolveVisibleBottom = ({ scrollBottom, keyboardTop, tabBarHeight = 0, ios = isIOS() }) =>
  ios ? Math.min(scrollBottom, keyboardTop || Infinity) : scrollBottom - tabBarHeight;

const KeyboardAwareScrollView = forwardRef(function KeyboardAwareScrollView(
  { children, keyboardGap = KEYBOARD_GAP, keyboardShouldPersistTaps = "handled", onScroll, onTouchEnd, ...rest },
  forwardedRef
) {
  const scrollRef = useRef(null);
  const offsetY = useRef(0);
  const keyboardTop = useRef(0);
  const tabBarHeight = useContext(BottomTabBarHeightContext) || 0;
  const spacer = useRef(new Animated.Value(0)).current;

  const setRef = useCallback(
    (node) => {
      scrollRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const scrollFocusedInputIntoView = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const scroll = scrollRef.current;
    if (!input || !scroll) return;
    scroll.measureInWindow((sx, sy, sw, sh) => {
      const visibleBottom = resolveVisibleBottom({ scrollBottom: sy + sh, keyboardTop: keyboardTop.current, tabBarHeight });
      input.measureInWindow((ix, iy, iw, ih) => {
        const delta = computeScrollDelta({ inputBottom: iy + ih, visibleBottom, gap: keyboardGap });
        if (delta > 0) scroll.scrollTo({ y: offsetY.current + delta, animated: true });
      });
    });
  }, [keyboardGap, tabBarHeight]);

  useEffect(() => {
    const onShow = (e) => {
      keyboardTop.current = e.endCoordinates.screenY;
      // Grow the spacer at once so the scroll target below is reachable; the extra space is below the fold, so nothing visibly moves.
      spacer.setValue(isIOS() ? e.endCoordinates.height : tabBarHeight ? tabBarHeight + keyboardGap : 0);
      scrollFocusedInputIntoView();
    };
    const onHide = (e) => {
      keyboardTop.current = 0;
      // Shrink in step with the keyboard so the clamped offset eases back instead of jumping.
      Animated.timing(spacer, { toValue: 0, duration: isIOS() ? e?.duration || 250 : 0, useNativeDriver: false }).start();
    };
    const subs = [
      Keyboard.addListener(isIOS() ? "keyboardWillShow" : "keyboardDidShow", onShow),
      Keyboard.addListener(isIOS() ? "keyboardWillHide" : "keyboardDidHide", onHide),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [keyboardGap, scrollFocusedInputIntoView, spacer, tabBarHeight]);

  const handleScroll = useCallback(
    (e) => {
      offsetY.current = e.nativeEvent.contentOffset.y;
      onScroll?.(e);
    },
    [onScroll]
  );

  // Android fires no keyboard event when focus moves between inputs under an open keyboard, so re-check after any tap.
  const handleTouchEnd = useCallback(
    (e) => {
      onTouchEnd?.(e);
      if (keyboardTop.current) setTimeout(scrollFocusedInputIntoView, 80);
    },
    [onTouchEnd, scrollFocusedInputIntoView]
  );

  return (
    <ScrollView
      {...rest}
      ref={setRef}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      onScroll={handleScroll}
      onTouchEnd={handleTouchEnd}
      scrollEventThrottle={16}
    >
      {children}
      <Animated.View style={{ height: spacer }} />
    </ScrollView>
  );
});

export default KeyboardAwareScrollView;
