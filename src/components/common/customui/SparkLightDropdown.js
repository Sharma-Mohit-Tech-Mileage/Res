import React, { useRef, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { Box } from 'native-base';
import { Padding, Color, FontFamily, FontSize } from "../../../../GlobalStyles"; 
import DownArrow from '../../../res/svgIcons/DownArrow';    
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
  const visibleRef = useRef(false);
  const dropdownRef = useRef(null);
  const optionsListRef = useRef(null);
  const firstOptionRef = useRef(null);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const getAccessibilityLabel = () => {
    return selectedValue 
      ? `Currently selected: ${selectedValue}`
      : "No option selected";
  };

  const openPicker = () => {
    setVisible(true);
    isDropDownOpen(true);
  };

  const closePicker = () => {
    // Guard: Modal callbacks (e.g., onDismiss + onRequestClose) can fire close twice.
    if (!visibleRef.current) return;

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
    }, 100);
  };

  const handleSelect = (value) => {
    onValueChange(value);

    // Delay closing modal slightly to avoid TalkBack double-speaking
    setTimeout(() => {
      closePicker();
    }, 50);
  };

  return (
    <Box style={[styles.container, style]}>
      <TouchableOpacity
        ref={dropdownRef}
        style={[styles.dropdown, dropDownStyle]}
        onPress={openPicker}
        accessible={true}
        accessibilityRole={Platform.OS === 'android' ? undefined : 'button'}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={`Open ${accessibilityItemName} options`}
        accessibilityState={Platform.OS === 'android' ? undefined : { expanded: visible }}
      >
        <Text style={styles.dropdownText} accessible={false} importantForAccessibility="no">
          {selectedValue || placeholder}
        </Text>
        <DownArrow accessible={false} />
        
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View style={styles.modalContainer}>
          <Pressable 
            style={styles.backdrop} 
            onPress={closePicker}
            accessible={false}
            importantForAccessibility="no"
          />
          <View 
            style={styles.pickerContainer}
            accessibilityViewIsModal={true}
            importantForAccessibility="yes"
          >
            <View style={styles.header}>
              <View style={styles.grabber} accessible={false} importantForAccessibility="no" />
              <View style={styles.headerContent}>
                <Text ref={optionsListRef}
                  style={styles.headerTitle}
                  accessible={true}
                  accessibilityRole="text"
                >
                  {dropdownTitle}
                </Text>
                <TouchableOpacity 
                  onPress={closePicker}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Close dropdown"
                >
                  <Text style={styles.closeButtonText} accessible={false} importantForAccessibility="no">✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <SafeAreaView 
              
              style={styles.optionsList}
              accessible={false}
            >
              {validItems.map((item, index) => (
                <TouchableOpacity
                  ref={index === 0 ? firstOptionRef : null}
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
                  accessibilityHint={`${index+1} of ${validItems.length}. Double tap to select`}
                  accessibilityState={{ selected: selectedValue === item }}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedValue === item && styles.selectedOptionText
                    ]} 
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Text style={styles.checkmark} accessible={false} importantForAccessibility="no">✓</Text>
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

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    marginTop: 8,
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
    minHeight: 48, // Changed from fixed height to minHeight
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderColor:'#C7C7CC',
    borderWidth: 1,
  },
  dropdownText: {
    flex: 1,
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    flexWrap: 'wrap', // Allow text to wrap
    paddingRight: 8, // Ensure space between text and icon
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
    fontSize: 16,
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