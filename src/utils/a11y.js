import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform, findNodeHandle } from 'react-native';

// AC1 label only; OS adds role/value/hint. iOS auto-reads text as AX value (omit here); Android needs value embedded since contentDescription suppresses auto-value. Errors go on accessibilityHint at the call site.

const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const digitsToWords = (s) => {
  const digits = String(s || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.split('').map((d) => DIGIT_WORDS[Number(d)]).join(' ');
};

export function formatInputA11yReadout({
  label,
  required = false,
  value,
  isPhoneNumber = false,
  isSecure = false,
}) {
  const cleanLabel = (label || '').replace(/\s*\*\s*$/, '').trim() || 'Input';
  const parts = [cleanLabel];
  if (required) parts.push('required');
  const includeValue =
    Platform.OS === 'android' &&
    !isSecure &&
    value !== undefined &&
    value !== null &&
    value !== '';
  if (includeValue) {
    parts.push(isPhoneNumber ? digitsToWords(value) : String(value));
  }
  return parts.join(', ');
}

// Deprecated — value now goes through formatInputA11yReadout's value param. Kept as a no-op for legacy callers.
export function formatInputA11yValue() {
  return undefined;
}

// React hook — true while a screen reader (TalkBack/VoiceOver) is active.
export function useScreenReaderStatus() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isScreenReaderEnabled().then((v) => { if (mounted) setEnabled(v); });
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', (v) => { if (mounted) setEnabled(v); });
    return () => { mounted = false; sub?.remove?.(); };
  }, []);
  return enabled;
}

// Wrapper around AccessibilityInfo.announceForAccessibility with optional delay; swallows exceptions.
export function announceA11y(message, { delay = 0 } = {}) {
  if (!message) return;
  const fire = () => {
    try { AccessibilityInfo.announceForAccessibility(message); } catch (_) { /* no-op */ }
  };
  if (delay > 0) setTimeout(fire, delay); else fire();
}

// Move screen-reader focus to a ref; uses sendAccessibilityEvent on Android, setAccessibilityFocus on iOS.
export function setFocusToRef(ref, { delay = 0 } = {}) {
  const fire = () => {
    try {
      const node = ref?.current;
      if (!node) return;
      const handle = findNodeHandle(node);
      if (!handle) return;
      if (Platform.OS === 'android') {
        AccessibilityInfo.sendAccessibilityEvent(handle, 'focus');
      } else {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    } catch (_) { /* no-op */ }
  };
  if (delay > 0) setTimeout(fire, delay); else fire();
}
