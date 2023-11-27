import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from '../../../GlobalStyles';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import SearchSuggestions from '../common/customui/SearchSuggestions';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import debounce from 'lodash.debounce';

const Search = ({ navigation }) => {
    const [input, setInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const allSuggestions = ['Support title 1', 'Support title 2', 'Support title 3'];

    // Function to filter suggestions
    const filterSuggestions = (query) => {
        if (query.trim()) {
            const filtered = allSuggestions.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]); // Set to empty array when there's no input
        }
    };


    // Debounced search function
    const debouncedSearch = useCallback(debounce(filterSuggestions, 300), []);

    // Effect to call the debounced search whenever input changes
    useEffect(() => {
        debouncedSearch(input);

        // Cleanup the debounced search on component unmount
        return () => {
            debouncedSearch.cancel();
        };
    }, [input, debouncedSearch]);

    const onChangeInput = useCallback((text) => {
        setInput(text);
    }, []);

    return (
        <View
            style={styles.support}
        >
            <ProfileSettingsHeader
                title="Search"
                onPressBack={() => navigation.navigate('support')}
            />
            <View style={styles.content}>
                <SearchSuggestions
                    placeholder="Search issues"
                    input={input}
                    onChangeInput={onChangeInput}
                    suggestions={filteredSuggestions}
                />
            </View>

            {/* Bottom buttons wrapper */}
            <View style={styles.bottomButtonsWrapper}>
                <View style={styles.buttonsParent}>
                    {/* Troubleshooting Button */}
                    <View style={styles.buttons}>
                        <Image
                            style={styles.buttonIcon}
                            resizeMode="cover"
                            source={require("../../../assets/tool-03.png")}
                        />
                        <Text style={styles.buttonText}>Troubleshooting</Text>
                    </View>
                    {/* Live Support Button */}
                    <View style={styles.buttons}>
                        <Image
                            style={styles.buttonIcon}
                            resizeMode="cover"
                            source={require("../../../assets/message-text-square-02.png")} // Update the source
                        />
                        <Text style={[styles.makePayment, styles.titleTypo]}>Live Support</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Color.sparklightGray,
        backgroundColor: 'white',
    },
    titleTypo: {
        textAlign: "center",
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        height: 21.79,
        fontSize: FontSize.size_base
    },
    makePayment: {
        marginLeft: 10,
        color: Color.colorMidnightblue,
        fontSize: FontSize.size_base,
    },
    buttonsFlexBox: {
        paddingVertical: Padding.p_base,
        height: 48,
        borderRadius: Border.br_11xs,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: Padding.p_5xs,
    },
    titleTypo: {
        textAlign: "center",
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    makePayment: {
        marginLeft: 10,
        color: Color.colorMidnightblue,
        fontSize: FontSize.size_base,
    },
    support: {
        backgroundColor: Color.sparklightWhite,
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: wp("23.5%"),
    },
    bottomButtonsWrapper: {
        borderTopWidth: 1,
        borderBottomWidth:1,
        borderColor: Color.sparklightGray,
        backgroundColor: 'white',
        padding: Padding.p_base,
        marginBottom: wp("23.5%")
    },
    buttonsParent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: Padding.p_5xs,
    },
    frameChildFlexBox: {
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
        alignItems: "center",
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    searchContainer: {
        width: '100%', // Ensure the container takes full width
        top: '13.5%'
    },
    buttonText: {
        marginLeft: 10,
        color: Color.colorMidnightblue,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansSemiBold,
    },
    buttonIcon: {
        // Assuming you have specific dimensions for your icons
        width: 24,
        height: 24,
    },
});

export default Search;
