import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  findNodeHandle,
  AccessibilityInfo,
  Platform,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from 'native-base';
import { Padding, Color, FontFamily, FontSize,Border } from "../../../../GlobalStyles";
import DownArrow from '../../../res/svgIcons/DownArrow';
import IconButton from './IconButton';
import Touchable from './Touchable';
import {  FieldTitle, FieldContent} from '../customui/Typography';
const SparkLightDropdown = ({
  items,
  selectedValue,
  onValueChange,
  style,
  dropDownStyle,
  isDropDownOpen = () => {},
  dropdownTitle = "Select Security Question", // Modal header title (customizable)
  accessibilityItemName = "security question", // Used in accessibility announcements
  placeholder = "Select an option" // Placeholder text when no option is selected
}) => {
  const validItems = Array.isArray(items) ? items : [];
  const [visible, setVisible] = React.useState(false);
  const dropdownRef = useRef(null);
  const insets = useSafeAreaInsets();
  const optionsListRef = useRef(null);
  const firstOptionRef = useRef(null);

  const getAccessibilityLabel = () => {
    return selectedValue 
      ? `Currently selected: ${selectedValue}`
      : "No option selected";
  };

  const openPicker = () => {
    setVisible(true);
    isDropDownOpen(true);
    AccessibilityInfo.announceForAccessibility(`${accessibilityItemName} dropdown opened`);
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
        }
      }
      AccessibilityInfo.announceForAccessibility(`${accessibilityItemName} dropdown closed`);
    }, 120);
  };

  const handleSelect = (value) => {
    onValueChange(value);

    // Delay closing modal slightly to allow announcement
    setTimeout(() => {
      setVisible(false);
      isDropDownOpen(false);
      setTimeout(() => {
        if (dropdownRef.current) {
          const handle = findNodeHandle(dropdownRef.current);
          if (handle) {
            AccessibilityInfo.setAccessibilityFocus(handle);
          }
        }
        AccessibilityInfo.announceForAccessibility(`Selected ${value}`);
      }, 120);
    }, 80);
  };

  return (
    <Box style={[styles.container, style]}>
      <Touchable
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
              fontSize: FontSize.size_base || 16,
              lineHeight: Math.ceil((FontSize.size_base || 16) * 1.25),
              ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
            },
          ]}
          accessible={false}
        >
          {selectedValue || placeholder}
        </Text>
        <View style={styles.iconWrap} pointerEvents="none">
          <DownArrow/>
        </View>
      </Touchable>

      <Modal
        visible={visible}
        transparent={true}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
        animationType="fade"
        onRequestClose={closePicker}
        onDismiss={closePicker}
      >
        <View style={styles.modalContainer}>
          <Touchable
            style={styles.backdrop}
            onPress={closePicker}
            minSize={0}
            accessible
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
                <Text ref={optionsListRef}
                  style={styles.headerTitle}
                  accessible
                  accessibilityRole="text"
                >
                  {dropdownTitle}
                </Text>
                <IconButton
                  onPress={closePicker}
                  style={styles.closeButton}
                  accessibilityLabel="Close dropdown"
                >
                  <Text style={styles.closeButtonText} accessible={false}>✕</Text>
                </IconButton>
              </View>
            </View>
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
              bounces={false}
            >
              {validItems.length === 0 && (
                <View
                  style={[styles.option, styles.lastOption]}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel="No options available"
                >
                  <Text style={styles.optionText} accessible={false}>No options available</Text>
                </View>
              )}
              {validItems.map((item, index) => (
                <Touchable
                  ref={index === 0 ? firstOptionRef : null}
                  key={index}
                  style={[
                    styles.option,
                    selectedValue === item && styles.selectedOption,
                    index === 0 && styles.firstOption,
                    index === validItems.length - 1 && styles.lastOption
                  ]}
                  onPress={() => handleSelect(item)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`${item}, ${index + 1} of ${validItems.length}${selectedValue === item ? ', selected' : ''}`}
                  accessibilityHint={`Double tap to select this ${accessibilityItemName}`}
                  accessibilityState={{ selected: selectedValue === item }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        fontSize: 16,
                        lineHeight: 20,
                        ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
                      },
                      selectedValue === item && styles.selectedOptionText
                    ]}
                    accessible={false}
                  >
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Text style={styles.checkmark} accessible={false}>✓</Text>
                  )}
                </Touchable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Box>
  );
};

// Styles remain unchanged
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
    borderRadius: Border.br_5xs,
    borderColor:'#767676',
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
  chevron: {
    fontSize: 12,
    color: Color.colorGray_200,
    marginLeft: 8,
    marginTop:12,
    alignSelf: 'center',
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
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: Math.round(Dimensions.get('window').height * 0.8),
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 24,
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
    right: Padding.p_5xs, // 8 — slight inset so 48dp container's right edge stays clear
    top: -Padding.p_xs, // -12 — vertically center over the 24dp header content row
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
    flexShrink: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    minHeight: 48,
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
    fontSize: 16,
    color: '#000000',
    flex: 1,
    fontFamily: FontFamily.openSansRegular,
  },
  selectedOptionText: {
    color: Color.sparklightPrimaryPurple,
  },
  checkmark: {
    color: Color.sparklightPrimaryPurple,
    fontSize: 17,
    marginLeft: 8,
  },
});

export default SparkLightDropdown;