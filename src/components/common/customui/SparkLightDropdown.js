import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, SafeAreaView, Pressable, findNodeHandle, AccessibilityInfo } from 'react-native';
import { Box } from 'native-base';
import { Padding, Color, FontFamily, FontSize } from "../../../../GlobalStyles";

const SparkLightDropdown = ({ items, selectedValue, onValueChange, style, dropDownStyle, isDropDownOpen = () => {} }) => {
    const validItems = Array.isArray(items) ? items : [];
    const [visible, setVisible] = React.useState(false);
    const dropdownRef = useRef(null);

    const getAccessibilityLabel = () => {
        return selectedValue 
            ? `Currently selected: ${selectedValue}`
            : "No option selected";
    };

    const openPicker = () => {
        setVisible(true);
        isDropDownOpen(true);
        AccessibilityInfo.announceForAccessibility("Security question dropdown opened");
    };

    const closePicker = () => {
        setVisible(false);
        isDropDownOpen(false);
        
        // Return focus to dropdown after modal closes
        setTimeout(() => {
            if (dropdownRef.current) {
                const handle = findNodeHandle(dropdownRef.current);
                if (handle) {
                    AccessibilityInfo.setAccessibilityFocus(handle);
                    AccessibilityInfo.announceForAccessibility("Security question dropdown closed");
                }
            }
        }, 100);
    };

    const handleSelect = (value) => {
        onValueChange(value);
        
        // Delay closing modal slightly to allow announcement
        setTimeout(() => {
            closePicker();
            if (dropdownRef.current) {
                const handle = findNodeHandle(dropdownRef.current);
                if (handle) {
                    AccessibilityInfo.setAccessibilityFocus(handle);
                    AccessibilityInfo.announceForAccessibility(`Selected ${value}`);
                }
            }
        }, 50);
    };

    return (
        <Box style={[styles.container, style]}>
            <TouchableOpacity
                ref={dropdownRef}
                style={[styles.dropdown, dropDownStyle]}
                onPress={openPicker}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={getAccessibilityLabel()}
                accessibilityHint="Double tap to open security question options"
                accessibilityState={{
                    expanded: visible
                }}
            >
                <Text style={styles.dropdownText} numberOfLines={1} accessible={false}>
                    {selectedValue || "Select an option"}
                </Text>
                <Text style={styles.chevron} accessible={false}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent={true}
                animationType="slide"
                onRequestClose={closePicker}
                onDismiss={closePicker}
            >
                <View style={styles.modalContainer}>
                    <Pressable 
                        style={styles.backdrop} 
                        onPress={closePicker}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Close dropdown"
                    />
                    <View 
                        style={styles.pickerContainer}
                        accessibilityViewIsModal={true}
                        importantForAccessibility="yes"
                    >
                        <View style={styles.header}>
                            <View style={styles.grabber} accessible={false} />
                            <View style={styles.headerContent}>
                                <Text 
                                    style={styles.headerTitle}
                                    accessible={true}
                                    accessibilityRole="header"
                                >
                                    Select Security Question
                                </Text>
                                <TouchableOpacity 
                                    onPress={closePicker}
                                    style={styles.closeButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel="Close dropdown"
                                >
                                    <Text style={styles.closeButtonText} accessible={false}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <SafeAreaView style={styles.optionsList}>
                            {validItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.option,
                                        selectedValue === item && styles.selectedOption,
                                        index === 0 && styles.firstOption,
                                        index === validItems.length - 1 && styles.lastOption
                                    ]}
                                    onPress={() => handleSelect(item)}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel={`${item}${selectedValue === item ? ', selected' : ''}`}
                                    accessibilityHint="Double tap to select this security question"
                                    accessibilityState={{ 
                                        selected: selectedValue === item
                                    }}
                                >
                                    <Text 
                                        style={[
                                            styles.optionText,
                                            selectedValue === item && styles.selectedOptionText
                                        ]} 
                                        accessible={false}
                                    >
                                        {item}
                                    </Text>
                                    {selectedValue === item && (
                                        <Text style={styles.checkmark} accessible={false}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        </Box>
    );
};


// Styles remain exactly the same
const styles = StyleSheet.create({
    // ... (keeping all your existing styles)
    container: {
        marginTop: 8,
        borderColor: Color.sparklightDarkGray,
        borderWidth: 1,
        borderRadius: 2,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Padding.p_base,
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        paddingVertical: Padding.p_xs,
        height: 48,
        backgroundColor: '#FFFFFF',
    },
    dropdownText: {
        flex: 1,
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
    },
    chevron: {
        fontSize: 12,
        color: Color.colorGray_200,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    pickerContainer: {
        backgroundColor: '#F2F2F7',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        backgroundColor: '#F2F2F7',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingTop: 8,
    },
    grabber: {
        width: 36,
        height: 5,
        backgroundColor: '#C7C7CC',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 0,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: '500',
    },
    optionsList: {
        backgroundColor: '#F2F2F7',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
        minHeight: 44,
    },
    firstOption: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#C6C6C8',
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    selectedOption: {
        backgroundColor: '#FFFFFF',
    },
    optionText: {
        fontSize: 17,
        color: '#000000',
        flex: 1,
        fontFamily: FontFamily.openSansRegular,
    },
    selectedOptionText: {
        color: '#007AFF',
    },
    checkmark: {
        color: '#007AFF',
        fontSize: 17,
        marginLeft: 8,
    },
});

export default SparkLightDropdown;