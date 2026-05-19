import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform, findNodeHandle } from 'react-native';

// AC1 order: Label → Required → Field type → Error → Hint. Value is supplied via accessibilityValue, not the label, to avoid double-announcement (label + native value readout).

const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const digitsToWords = (s) =>
  String(s || '')
    .split('')
    .map((c) => DIGIT_WORDS[+c] ?? c)
    .join(' ');

export function formatInputA11yReadout({
  label,
  required = false,
  errorHint,
  fieldType = 'text field',
  actionHint = 'Double tap to edit',
}) {
  const cleanLabel = (label || '').replace(/\s*\*\s*$/, '').trim() || 'Input';
  const parts = [cleanLabel];
  if (required) parts.push('required');
  parts.push(fieldType);
  let result = parts.join(', ');
  if (errorHint) result += `. ${errorHint}`;
  result += `. ${actionHint}.`;
  return result;
}

// Build the accessibilityValue prop for a TextInput. Pass the result directly: <TextInput accessibilityValue={formatInputA11yValue(value, { isPhoneNumber })} />
export function formatInputA11yValue(value, { isSecure = false, isPhoneNumber = false } = {}) {
  if (isSecure || value === undefined || value === null || value === '') return undefined;
  return { text: isPhoneNumber ? digitsToWords(value) : String(value) };
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
