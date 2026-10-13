import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding } from '../../../styles/GlobalStyles';
import { A11Y } from '../../../styles/theme';
import Touchable from './Touchable';

// Whole row is the tap target; pass an inert checkbox via the `checkbox` prop.
const CheckboxRow = ({
  value,
  onValueChange,
  label,
  checkbox,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  style,
  labelStyle,
  testID,
}) => {
  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <Touchable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!value, disabled }}
      accessibilityLabel={
        accessibilityLabel || (typeof label === 'string' ? label : undefined)
      }
      accessibilityHint={accessibilityHint}
      style={[styles.row, style]}
      testID={testID}
    >
      <View pointerEvents="none" style={styles.checkboxBox}>
        {checkbox}
      </View>
      {typeof label === 'string' ? (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      ) : (
        label
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Padding.p_5xs, // 8
    paddingHorizontal: Padding.p_5xs, // 8
    minHeight: A11Y.minTouch,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  checkboxBox: {
    marginRight: Padding.p_xs, // 12
  },
  label: {
    flexShrink: 1,
    color: Color.colorGray_200,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
  },
});

export default CheckboxRow;
