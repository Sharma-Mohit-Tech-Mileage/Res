import React, { memo, useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  Keyboard,
} from "react-native";
import { Padding, Color, FontSize, FontFamily, Border } from "../../../../GlobalStyles";
import { wp, hp } from "../../../utils/responsive";
import SearchIcon from "../../../../assets/svgs/SearchIcon";
import Rightactionable from "../../../res/svgIcons/RightArrow";
import File05 from "../../../../assets/svgs/File05";
import Touchable from "./Touchable";
const SearchSuggestions = memo(
  ({ placeholder, onChangeInput, suggestions, navigation, onEndReached }) => {
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    const [keyboardHidden, setKeyboardHidden] = useState(true);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
          setKeyboardHidden(false);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
          setKeyboardHidden(true);
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []);
    
      useEffect(() => {
        if (!keyboardHidden) {
          inputRef.current?.focus();
        }
      }, [keyboardHidden]);
    

    useEffect(() => {
      onChangeInput(input);
    }, [input, onChangeInput]);

    const handleSuggestionClick = (suggestion) => {
      if (suggestion.html_url != "") {
        navigation.navigate("ArticleWindowUtility", {
          url: suggestion.html_url + "?isMobile=true",
          name: "Search Result",
        });
      }
    };

    const submitValue = () => {
      Keyboard.dismiss();
    };

    const renderSuggestion = ({ item, index }) => (
      <Touchable
        onPress={() => handleSuggestionClick(item)}
        style={styles.suggestionItem}
        accessibilityRole="link"
        accessibilityHint="Double tap to open in a new window."
        accessibilityLabel={`Result ${index+1} of ${suggestions.length} ,${item.title}`}
      >
        <View style={{ marginRight: 18, width: 13.333, height: 16.667 }}>
          <File05 />
        </View>
        <Text maxFontSizeMultiplier={1.25} style={styles.suggestionText}>
          {item.title}
        </Text>
        {item.html_url != "" ? (
          <View>
            <Rightactionable />
          </View>
        ) : (
          <></>
        )}
      </Touchable>
    );

    return (
      <View style={styles.flatList}>
        <View style={styles.inputContainer} accessibilityHint="Double tap to edit"
          accessibilityRole="text"
          accessible={true}
          accessibilityLabel={ suggestions.length > 0 ? `${suggestions.length} results found for ${input}. Use swipe to move through them.` : `Search Knowledgebase, type to search.`}
          
          >
          <View style={[styles.searchIcon, styles.leftIcon]}>
            <SearchIcon />
          </View>
          
          <TextInput
            maxFontSizeMultiplier={1.25}
            ref={inputRef}
            style={styles.searchInput}
            placeholder={placeholder}
            value={input}
            onChangeText={setInput}
            placeholderTextColor={Color.gray600}
            autoCorrect={false}
            clearButtonMode="always"
            returnKeyType="done"
            onSubmitEditing={submitValue}
            accessible={false}
            importantForAccessibility="no"
          />
          
        </View>
        <View style={{ height: hp("70%") }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderSuggestion({ item, index })}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
          />
        </View>
      </View>
    );
  }
);

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
    backgroundColor: '#F8F8F8', // Example background color
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray, // Example border color
    borderRadius: Border.br_5xs,
    height: 56, // Example height
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
    paddingHorizontal: Padding.p_base, // Example padding
    color: Color.sparklightGray1,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
      
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
    backgroundColor: '#F8F8F8', // Hex color from the design
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
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightPrimaryPurple,
    flexWrap:'wrap',
    maxWidth:wp('90%')
      // Spark Light Purple from the design
},
overlayStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
}

});

export default SearchSuggestions;
