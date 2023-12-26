import React, { memo , useRef, useEffect,useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Padding, Color, FontSize, FontFamily } from '../../../GlobalStyles';

const EntryInput = ({ input, placeholder, onChangeText, iconImage, keyboardType }) => {
    const inputRef = useRef(null);

    return (
        <View style={styles.inputContainer}>
            <Image
                source={iconImage}
                style={[styles.searchIcon, styles.leftIcon]}
            />
            <TextInput
                autoCapitalize="none"
                ref={inputRef}
                style={styles.searchInput}
                placeholder={placeholder}
                value={input}
                onChangeText={onChangeText}
                placeholderTextColor={Color.gray600}
                autoCorrect={false}
                clearButtonMode="always"
                keyboardType={keyboardType}
                returnKeyType="done"
                enterKeyHint="done"
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF', // Example background color
        borderWidth: 1,
        borderColor: Color.sparklightGray, // Example border color
        borderRadius: 1, // Example border radius
        height: 56, // Example height
        width: '80%'
    },
    searchIcon: {
        marginLeft: Padding.p_xs, // Example padding
        width: 24, // Example width
        height: 24, // Example height
    },
    clearIcon: {
        width: 24, // Example width
        height: 24, // Example height
    },
    searchInput: {
        flex:1,
        flexDirection: 'row', // To align icons and text
        alignItems: 'center', // Vertically center the content
        alignSelf: 'stretch',
        flex: 1,
        paddingHorizontal: Padding.p_base, // Example padding
        fontSize: FontSize.size_base, // Example font size
        color: Color.sparklightGray1, 
    },
    suggestionsContainer: {
        marginTop: 0, // Gap from the design
        alignSelf: 'stretch',
        backgroundColor: Color.sparklightWhite,
        borderTopWidth: 0,
        borderColor: Color.sparklightGray,
    },
    searchContainer: {
        flexDirection: 'row', // Align children horizontally
        alignItems: 'center', // Center children vertically
        // Apply any additional styling as needed
    },
   
    leftIcon: {
        marginRight: 8, // Space between the icon and the text input
        backgroundColor: '#FFF', // Hex color from the design
        // Set the size if needed, e.g. width: 20, height: 20
    },
    rightIcon: {
        marginLeft: 8, // Space between the text input and the icon
        backgroundColor: '#F8F8F8', // Hex color from the design
    },
    suggestionItem: {
        flexDirection: 'row', // To align icons and text
        alignItems: 'center', // Vertically center the content
        paddingVertical: Padding.p_xs,
        paddingHorizontal: 24, // Horizontal padding from the design
        borderBottomWidth: 1,
        borderColor: Color.sparklightGray, // Sparklight Dark Gray from the design
        backgroundColor: '#F8F8F8', // Hex color from the design
        height: 53, // Height from the design
    },
    iconStyle: {
        // Styles for the icons
        width: 24, // Width from the design
        height: 24, // Height from the design
        tintColor: Color.colorMidnightblue, // Spark Light Purple from the design
        // Add margin if needed to separate from the text
    },
    suggestionText: {
        flex: 1, // To ensure text takes up the remaining space
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        color: Color.colorMidnightblue, // Spark Light Purple from the design
    },
    overlayStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    }
});

export default EntryInput;
