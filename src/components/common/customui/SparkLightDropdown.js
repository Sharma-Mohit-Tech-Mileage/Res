import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  findNodeHandle,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { Box } from 'native-base';
import { Padding, Color, FontFamily, FontSize } from '../../../../GlobalStyles';
import DownArrow from '../../../res/svgIcons/DownArrow';

const SparkLightDropdown = ({
  items,
  selectedValue,
  onValueChange,
  style,
  dropDownStyle,
  isDropDownOpen = () => {},
  dropdownTitle = 'Select Security Question',
  accessibilityItemName = 'security question',
  placeholder = 'Select an option',
}) => {
  const validItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  const getAccessibilityLabel = useCallback(() => {
    return selectedValue ? `Currently selected: ${selectedValue}` : 'No option selected';
  }, [selectedValue]);

  const focusDropdown = useCallback((announcement) => {
    setTimeout(() => {
      if (dropdownRef.current) {
        const handle = findNodeHandle(dropdownRef.current);
        if (handle) {
          AccessibilityInfo.setAccessibilityFocus(handle);
        }
      }
      if (announcement) {
        AccessibilityInfo.announceForAccessibility(announcement);
      }
    }, 120);
  }, []);

  const openPicker = useCallback(() => {
    setVisible(true);
    isDropDownOpen(true);
    AccessibilityInfo.announceForAccessibility(`${accessibilityItemName} dropdown opened`);
  }, [accessibilityItemName, isDropDownOpen]);

  const closePicker = useCallback(() => {
    setVisible(false);
    isDropDownOpen(false);
    focusDropdown(`${accessibilityItemName} dropdown closed`);
  }, [accessibilityItemName, isDropDownOpen, focusDropdown]);

  const handleSelect = useCallback(
    (value) => {
      onValueChange?.(value);

      setTimeout(() => {
        setVisible(false);
        isDropDownOpen(false);
        focusDropdown(`Selected ${value}`);
      }, 80);
    },
    [onValueChange, isDropDownOpen, focusDropdown]
  );

  const dropdownFontSize = FontSize.size_base || 16;
  const dropdownLineHeight = Math.ceil(dropdownFontSize * 1.25);

  const optionFontSize = 16;
  const optionLineHeight = 20;

  return (
    <Box style={[styles.container, style]}>
      <TouchableOpacity
        ref={dropdownRef}
        style={[styles.dropdown, dropDownStyle]}
        onPress={openPicker}
        accessible
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={`Double tap to open ${accessibilityItemName} options`}
        accessibilityState={{ expanded: visible }}
      >
        <Text
          style={[
            styles.dropdownText,
            {
              fontSize: dropdownFontSize,
              lineHeight: dropdownLineHeight,
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
            },
          ]}
          accessible={false}
        >
          {selectedValue || placeholder}
        </Text>

        <View style={styles.iconWrap} pointerEvents="none">
          <DownArrow />
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
        onDismiss={closePicker}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.backdrop}
            onPress={closePicker}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close dropdown"
          />

          <View style={styles.pickerContainer} accessibilityViewIsModal importantForAccessibility="yes">
            <View style={styles.header}>
              <View style={styles.grabber} accessible={false} />
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle} accessible accessibilityRole="text">
                  {dropdownTitle}
                </Text>

                <TouchableOpacity
                  onPress={closePicker}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Close dropdown"
                >
                  <Text style={styles.closeButtonText} accessible={false}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <SafeAreaView style={styles.optionsList}>
              {validItems.map((item, index) => {
                const isSelected = selectedValue === item;
                return (
                  <TouchableOpacity
                    key={`${item}-${index}`}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                      index === 0 && styles.firstOption,
                      index === validItems.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleSelect(item)}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${item}, ${index + 1} of ${validItems.length}${
                      isSelected ? ', selected' : ''
                    }`}
                    accessibilityHint={`Double tap to select this ${accessibilityItemName}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          fontSize: optionFontSize,
                          lineHeight: optionLineHeight,
                          ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
                        },
                        isSelected && styles.selectedOptionText,
                      ]}
                      accessible={false}
                    >
                      {item}
                    </Text>

                    {isSelected && (
                      <Text style={styles.checkmark} accessible={false}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    paddingHorizontal: Padding.p_base,
    paddingVertical: 12,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderColor: '#C7C7CC',
    borderWidth: 1,
  },

  dropdownText: {
    flex: 1,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    flexWrap: 'wrap',
    paddingRight: 8,
  },

  iconWrap: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginLeft: 8,
    paddingTop: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
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
    fontSize: 16,
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
    color: '#000',
    fontWeight: '800',
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