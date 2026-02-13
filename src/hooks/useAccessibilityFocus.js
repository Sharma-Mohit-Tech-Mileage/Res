import { useCallback, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, Platform } from "react-native";

/**
 * Returns a ref object and a function to trigger focus on the element
 * carrying the ref for screen readers (VoiceOver/TalkBack).
 */
export default function useAccessibilityFocus() {
  const ref = useRef(null);

  const setFocus = useCallback(() => {
    setTimeout(() => {
      if (ref.current) {
        const reactTag = findNodeHandle(ref.current);
        if (reactTag) {
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        }
      }
    }, 100);
    // if (ref.current) {
    //   const reactTag = findNodeHandle(ref.current);
    //   if (reactTag) {
    //     // On Android, setAccessibilityFocus is deprecated.
    //     // We use sendAccessibilityEvent with eventType 'focus' instead.
    //     if (Platform.OS === 'android') {
    //       AccessibilityInfo.sendAccessibilityEvent(reactTag, 'focus');
    //     } else {
    //       AccessibilityInfo.setAccessibilityFocus(reactTag);
    //     }
    //   }
    // }
  }, [ref]);

  return [ref, setFocus];
}
