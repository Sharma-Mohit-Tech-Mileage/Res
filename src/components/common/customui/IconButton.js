import React from 'react';
import Touchable from './Touchable';

const IconButton = ({
  icon,
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
  hitSlop,
  minSize,
  testID,
  ...rest
}) => {
  if (__DEV__ && !accessibilityLabel) {
    console.warn('IconButton: accessibilityLabel is required so screen readers can announce icon-only buttons.');
  }
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={hitSlop}
      minSize={minSize}
      style={style}
      testID={testID}
      {...rest}
    >
      {icon || children}
    </Touchable>
  );
};

export default IconButton;
