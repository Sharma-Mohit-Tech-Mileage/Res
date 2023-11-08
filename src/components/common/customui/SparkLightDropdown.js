import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
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
                <Text>{selectedValue || 'Select an option'}</Text>
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
                        <View style={[styles.listContainer, { padding: 20 }]}>
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
        padding:20
    },
    dropdown: {
        borderColor: Color.colorGray_100,
        borderWidth: 1,
        borderRadius: 2,
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: Color.snow_white,
    },
    listContainer: {
        marginTop: 50,
        marginHorizontal: 20,
        borderRadius: 2,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    emptyDropdown: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SparkLightDropdown;
