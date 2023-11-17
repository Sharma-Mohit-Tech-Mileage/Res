import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image } from 'react-native';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../../GlobalStyles";

const SparkLightDropdown = ({ items, selectedValue, onValueChange, style }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    // Convert undefined or non-array types to an empty array
    const validItems = Array.isArray(items) ? items : [];

    const handleItemPress = (item) => {
        if (onValueChange) {
            onValueChange(item);
        }
        setShowDropdown(false);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                onPress={() => setShowDropdown(true)}
                style={styles.dropdown}
                accessibilityRole="button"
                accessibilityLabel="Dropdown Button"
                accessibilityHint="Tap to open dropdown menu"
            >
                <Text style={styles.dropdownText}>{selectedValue || 'Select an option'}</Text>
                <Image
                    source={require('../../../../assets/chevrondown.png')}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>

            {showDropdown && (
                <Modal transparent={true} animationType="fade">
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setShowDropdown(false)}
                        accessibilityRole="button"
                        accessibilityLabel="Overlay Button"
                        accessibilityHint="Tap anywhere to close dropdown menu"
                    >
                        <View style={[styles.listContainer, { padding: Padding.p_xs }]}>
                            {validItems.length > 0 ? (
                                <FlatList
                                    data={validItems}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => handleItemPress(item)}
                                            style={styles.item}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Dropdown Option: ${item}`}
                                            accessibilityHint={`Tap to select ${item} option`}
                                        >
                                            <Text>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <View style={styles.emptyDropdown}>
                                    <Text>No options available</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    // ... your other styles,
    dropdown: {
        flexDirection: 'row', // Ensure text and icon are in a row
        justifyContent: 'space-between', // Space the text and icon
        alignItems: 'center', // Center the items vertically
        borderColor: Color.sparklightDarkGray,
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: Color.snow_white,
        paddingHorizontal: Padding.p_base,
        paddingVertical:Padding.p_xs
    },
    dropdownText: {
        flex: 1, // Text should take up the majority of the space
    },
    iconStyle: {
        // Style your icon as needed
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    listContainer: {
        marginTop: 50,
        marginHorizontal: Padding.p_base,
        borderRadius: 2,
        backgroundColor: 'white',
        overflow: 'hidden',
        
    },
    item: {
        padding: Padding.p_base,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    emptyDropdown: {
        padding: Padding.p_base,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SparkLightDropdown;
