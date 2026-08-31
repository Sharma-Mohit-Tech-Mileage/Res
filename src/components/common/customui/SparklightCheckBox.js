import React from 'react';
import { Color } from '../../../../GlobalStyles';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';


const SparklightCheckBox = ({
  value = false,
  onValueChange,
  label,
  disabled = false,
  tintColors,
  style,
  labelStyle,
  boxStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants">
        <CheckBox
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          boxType="square"
          tintColor={Color.sparklightGray}
          onCheckColor={Color.colorMidnightblue}
          onTintColor={Color.colorMidnightblue}
          tintColors={tintColors || { true: Color.colorMidnightblue, false: Color.sparklightGray }}
          style={[styles.checkbox, !value && styles.uncheckedBorder, boxStyle]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 8,
  },
  uncheckedBorder: {
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderRadius: 1,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});

export default SparklightCheckBox;
