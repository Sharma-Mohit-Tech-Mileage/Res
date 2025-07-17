import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SearchSuggestions from "../common/customui/SearchSuggestions";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { GetApiRequestSearch } from "../../network/APIClient";

import debounce from "lodash.debounce";
import SmallLoader from "../common/customui/SmallLoader";

const Search = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [noData, setNoData] = useState([{id:'1234',title:'No results found.',html_url:''}]);
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // Function to filter suggestions
  const filterSuggestions = (query) => {
    const request = `/articles/search.json?page=${pageNo}&per_page=25&query=${query}&sort_by=created_at&sort_order=desc`;
    GetApiRequestSearch(
      request,
      (res) => {
        try {
          if (res) {
            console.log(`Search page no ${res.page} and total page ${res.page_count}`)
            
            if (query.trim() && query.length > 0) {
              setTotalPage(res.page_count)
              var data = filteredSuggestions.concat(res.results);
             // console.log('Data',data)
              if(data.length===0){
                data=[...noData]
                
              }
              
              setFilteredSuggestions(data);
            } else {
              setFilteredSuggestions([]); // Set to empty array when there's no input
            }

            //setIsLoading(false)
            //setPageNo(pageNo+1)
          }else{
            console.log('No Data')
          }
        } catch (e) {}
      },
      (error) => {
        console.log("filterSuggestions error", error);
        setIsLoading(false);
      }
    );
    // }
  };

  const onListScrollEnd = () => {
    console.log("onListScrollEnd");
    if(pageNo<totalPage){
    setPageNo(pageNo + 1);
    
    }
  };


  useEffect(()=>{
    filterSuggestions(input);
  },[pageNo])

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
    if (text.length == 0) {
      setFilteredSuggestions([]);
    }
  }, []);

  const ListEndLoader = () => {
    return <SmallLoader size={"small"} />;
  };

  return (
    <View style={styles.support}>
      <ProfileSettingsHeader
        title="Search"
        onPressBack={() => navigation.navigate("support")}
      />
      <View style={styles.content}>
        <SearchSuggestions
          placeholder="Search"
          input={input}
          onChangeInput={onChangeInput}
          suggestions={filteredSuggestions}
          navigation={navigation}
          onEndReached={onListScrollEnd}
          Footer={ListEndLoader}
        />
      </View>

      {/* Bottom buttons wrapper 
            <View style={styles.bottomButtonsWrapper}>
                <View style={styles.buttonsParent}>
                    
                    <View style={styles.buttons}>
                        <Image
                            style={styles.buttonIcon}
                            resizeMode="cover"
                            source={require("../../../assets/tool-02.png")}
                        />
                        <Text style={styles.buttonText}>Troubleshooting</Text>
                    </View>
                   
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
            */}
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
    backgroundColor: "white",
  },
  titleTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    height: 21.79,
    fontSize: FontSize.size_base,
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
    //marginTop: wp("23.5%"),
  },
  bottomButtonsWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
    backgroundColor: "white",
    padding: Padding.p_base,
    marginBottom: wp("23.5%"),
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
    justifyContent: "flex-start",
  },
  searchContainer: {
    width: "100%", // Ensure the container takes full width
    // top: '13.5%'
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
