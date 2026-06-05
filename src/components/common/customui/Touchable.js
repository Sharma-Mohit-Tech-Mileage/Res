import React, { forwardRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { A11Y } from '../../../styles/theme';

const Touchable = forwardRef(function Touchable(
  {
    onPress,
    onLongPress,
    children,
    style,
    accessibilityLabel,
    accessibilityRole = 'button',
    accessibilityHint,
    accessibilityState,
    minSize = A11Y.minTouch,
    hitSlop = A11Y.hitSlop,
    disabled = false,
    testID,
    ...rest
  },
  ref,
) {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...(accessibilityState || {}) }}
      style={({ pressed }) => [
        styles.base,
        { minWidth: minSize, minHeight: minSize },
        pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Touchable;
