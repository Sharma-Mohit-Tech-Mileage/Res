import { useCallback, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

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
  }, [ref]);

  return [ref, setFocus];
}
