import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform, findNodeHandle } from 'react-native';

// AC1 label only; OS adds role/value/hint. iOS auto-reads text as AX value (omit here); Android needs value embedded since contentDescription suppresses auto-value. Errors go on accessibilityHint at the call site.

const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const digitsToWords = (s) => {
  const digits = String(s || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.split('').map((d) => DIGIT_WORDS[Number(d)]).join(' ');
};

// Spell out digit characters individually while keeping non-digits, so numbers embedded in a value (e.g. in an email) are read digit-by-digit, not as a cardinal ("million").
export const spellOutDigits = (s) => {
  if (s === undefined || s === null) return '';
  return String(s).replace(/[0-9]/g, (d) => ` ${DIGIT_WORDS[Number(d)]} `).replace(/\s{2,}/g, ' ').trim();
};

// Spell out every alphanumeric character individually (letters by name, digits as words), comma-separated so the screen reader pauses per character — for IDs like model/MAC/serial that must not be read as words or cardinals.
export const spellOutChars = (s) => {
  if (s === undefined || s === null) return '';
  return String(s).toUpperCase().split('').map((c) => (/[0-9]/.test(c) ? DIGIT_WORDS[Number(c)] : /[A-Z]/.test(c) ? c : '')).filter(Boolean).join(', ');
};

export function formatInputA11yReadout({
  label,
  required = false,
  value,
  isPhoneNumber = false,
  isSecure = false,
  osAddsValue = true,
}) {
  // Compose the full readout on Android (contentDescription suppresses auto-value); iOS auto-reads the value only when the label sits on the real TextInput — callers whose input is a11y-hidden pass osAddsValue: false.
  const cleanLabel = (label || '').replace(/\s*\*\s*$/, '').trim() || 'Input';
  const parts = [cleanLabel];
  if (required) parts.push('required');
  const includeValue = Platform.OS === 'android' || !osAddsValue;
  if (includeValue && !isSecure && value !== undefined && value !== null && value !== '') {
    parts.push(isPhoneNumber ? digitsToWords(value) : spellOutDigits(value));
  }
  if (Platform.OS === 'android') parts.push('text field');
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

// Move screen-reader focus to a ref via setAccessibilityFocus, fired once — repeated focus sets re-read the field (double/multiple readout on iOS/Android).
export function setFocusToRef(ref, { delay = 0 } = {}) {
  const fire = () => {
    try {
      const node = ref?.current;
      if (!node) return;
      const handle = findNodeHandle(node);
      if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
    } catch (_) { /* no-op */ }
  };
  if (delay > 0) setTimeout(fire, delay); else fire();
}
