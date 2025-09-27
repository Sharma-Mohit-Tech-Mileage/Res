import React, { memo, useRef, useEffect, useState } from "react";
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { Padding, Color, FontSize, FontFamily } from "../../../../GlobalStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import SearchIcon from "../../../../assets/svgs/SearchIcon";
import Rightactionable from "../../../res/svgIcons/RightArrow";
import File05 from "../../../../assets/svgs/File05";
const SearchSuggestions = memo( ({ placeholder, onChangeInput, suggestions, navigation, onEndReached }) => {
    const inputRef = useRef(null);
    const [input, setInput] = useState("");

    useEffect(() => {
      onChangeInput(input);
    }, [input, onChangeInput]);

    const handleSuggestionClick = (suggestion) => {
      if (suggestion.html_url != "") {
        navigation.navigate("ArticalWindowUtility", {
          url: suggestion.html_url + "?isMobile=true",
          name: "Search Result",
        });
      }
    };

    const renderSuggestion = ({ item }) => (
      <TouchableOpacity
        onPress={() => handleSuggestionClick(item)}
        style={styles.suggestionItem}
      >

        <View
          style={{
            marginRight: 18,
            width: 13.333,
            height: 16.667,
          }}
        >
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
      </TouchableOpacity>
    );

    return (
      <View style={styles.flatList}>
        <View style={styles.inputContainer}>
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
          />
        </View>
        <View style={{ height: hp("70%") }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSuggestion}
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
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "stretch",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8", 
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray, 
    borderRadius: 8, 
    height: 56, 
  },
  searchIcon: {
    marginLeft: Padding.p_xs,
    width: 24, 
    height: 24, 
  },
  clearIcon: {
    width: 24, 
    height: 24,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row", 
    alignItems: "center", 
    alignSelf: "stretch",
    flex: 1,
    paddingHorizontal: Padding.p_base, 
    fontSize: FontSize.size_base, 
    color: Color.sparklightGray1,
  },
  suggestionsContainer: {
    marginTop: 0,
    alignSelf: "stretch",
    backgroundColor: Color.sparklightWhite,
    borderTopWidth: 0,
    borderColor: Color.sparklightGray,
  },
  searchContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },

  leftIcon: {
    marginRight: 8, 
    backgroundColor: "#F8F8F8", 
  },
  rightIcon: {
    marginLeft: 8,
    backgroundColor: "#F8F8F8",
  },
  suggestionItem: {
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: Padding.p_xs,
    paddingHorizontal: 24, 
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray, 
    backgroundColor: "#F8F8F8", 
  },
  iconStyle: {
    width: 24, 
    height: 24, 
    tintColor: Color.colorMidnightblue,
  },
  suggestionText: {
    flex: 1, 
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorMidnightblue,
    flexWrap: "wrap",
    maxWidth: wp("90%"),
  },
  overlayStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default SearchSuggestions;
