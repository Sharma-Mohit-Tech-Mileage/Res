import React, { useRef } from 'react';
import { StyleSheet  } from 'react-native';
import { Select, Box, CheckIcon } from 'native-base';
import { Padding, Color,FontFamily,FontSize } from "../../../../GlobalStyles";
import { useIsFocused } from "@react-navigation/native";

const SparkLightDropdown = ({ items, selectedValue, onValueChange, style , dropDownStyle , isDropDownOpen = () => {}}) => {
    const validItems = Array.isArray(items) ? items : [];

      const getAccessibilityLabel = () => {
        return selectedValue 
          ? `${selectedValue}.`
          : "Select an option.";
      };

    return (
        <Box 
        accessible={true}
            accessibilityRole="menu"
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityHint="Double tap to open the menu and select an option"
        style={[styles.container, style]}>
            <Select
                selectedValue={selectedValue}
                minWidth="200"
                placeholder="Select an option"
                maxFontSizeMultiplier={1.25}
                _selectedItem={{
                    bg: Color.Gray300,
                    endIcon: <CheckIcon size="5" />,
                }}
                style={[styles.dropdown,dropDownStyle]}
                onOpen={()=> {
                    isDropDownOpen(true)
                }}
                onClose={() => {
                    isDropDownOpen(false)
                }}
                onValueChange={itemValue => onValueChange(itemValue)}
        
            >
                {validItems.map((item, index) => (
                    <Select.Item
                    key={index} label={item} value={item} />
                ))}
            </Select>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        borderColor: Color.sparklightDarkGray, // Set the border color here
        borderWidth: 1, // Set the border width here
        borderRadius: 2, // Set the border radius here
    },
    dropdown: {
        flexDirection: 'row', // Ensure text and icon are in a row
        justifyContent: 'space-between', // Space the text and icon
        alignItems: 'center', // Center the items vertically
        paddingHorizontal: Padding.p_base,
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        paddingVertical: Padding.p_xs,
        height:48
    },
    item: {
        padding: Padding.p_base,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

export default SparkLightDropdown;
