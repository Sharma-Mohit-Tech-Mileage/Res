import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Padding } from '../../../../GlobalStyles';
import EditIcon from "../../../../src/res/svgIcons/EditIcon";

const EditActionButton = ({ onPress, accessibilityLabel, testID }) => {
  return (
    <Pressable
      style={styles.editButton}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <EditIcon />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  editButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditActionButton;