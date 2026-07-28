import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize, Padding } from '../../../../GlobalStyles';
import { A11Y } from '../../../styles/theme';
import Touchable from './Touchable';

// Do NOT use for links inside a paragraph — extract to its own row instead.
const LinkText = ({
  text,
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityLabel={
        accessibilityLabel || (typeof text === 'string' ? text : undefined)
      }
      accessibilityHint={accessibilityHint}
      style={[styles.row, style]}
      testID={testID}
    >
      {children || <Text style={[styles.text, textStyle]}>{text}</Text>}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: Padding.p_xs, // 12 — guarantees ≥48dp with default text
    paddingHorizontal: Padding.p_5xs, // 8
    minHeight: A11Y.minTouch,
    alignSelf: 'flex-start',
  },
  text: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    textDecorationLine: 'underline',
  },
});

export default LinkText;
