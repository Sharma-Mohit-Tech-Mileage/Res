import React from 'react';
import { StyleSheet } from 'react-native';
import { Select, Box, CheckIcon } from 'native-base';
import { Padding, Color,FontFamily,FontSize } from "../../../../GlobalStyles";

const SparkLightDropdown = ({ items, selectedValue, onValueChange, style , dropDownStyle }) => {
    const validItems = Array.isArray(items) ? items : [];

    return (
        <Box style={[styles.container, style]}>
            <Select
                selectedValue={selectedValue}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Select an option"
                maxFontSizeMultiplier={1.25}
                _selectedItem={{
                    bg: Color.Gray300,
                    endIcon: <CheckIcon size="5" />,
                }}
                style={[styles.dropdown,dropDownStyle]}
                onValueChange={itemValue => onValueChange(itemValue)}
        
            >
                {validItems.map((item, index) => (
                    <Select.Item key={index} label={item} value={item} />
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
