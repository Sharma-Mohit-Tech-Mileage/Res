import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Image,
} from 'react-native';
import { Padding, Color, FontSize, FontFamily } from '../../../GlobalStyles';
import { formatInputA11yReadout } from '../../utils/a11y';
import Phone from '../../res/svgIcons/Phone';
import EmailIcon from '../../res/svgIcons/EmailIcone';

const EntryInput = ({ name,input, placeholder, onChangeText, onSubmitText, IconImage, keyboardType,style }) => {
    const inputRef = useRef(null);

    return (
        <View style={[styles.inputContainer,style]}>
        <TextInput
            autoCapitalize="none"
            ref={inputRef}
            style={[styles.searchInput]}
            placeholder={placeholder}
            value={input}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitText}
            placeholderTextColor={Color.gray600}
            autoCorrect={false}
            clearButtonMode="always"
            keyboardType={keyboardType}
            returnKeyType="done"
            enterKeyHint="done"
            accessibilityLabel={formatInputA11yReadout({
                label: placeholder,
                value: input,
                isPhoneNumber: keyboardType === 'phone-pad',
            })}
            accessibilityRole="text"
            importantForAccessibility="yes"
        />
    </View>

    );
};


const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF', // Example background color
        borderWidth: 1,
        borderColor: Color.sparklightGray, // Example border color
        borderRadius: 1, // Example border radius
        height: 56, // Example height
        width: '90%'
    },
    searchInput: {
        flex:1,
        flexDirection: 'row', // To align icons and text
        alignItems: 'center', // Vertically center the content
        alignSelf: 'center',
        paddingHorizontal: Padding.p_base, // Example padding
        fontSize: FontSize.size_base, // Example font size
        color: Color.sparklightGray1, 
    },
   });

export default EntryInput;
