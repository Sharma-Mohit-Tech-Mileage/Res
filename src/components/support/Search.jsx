import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, } from "react-native";
import { Color} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SearchSuggestions from "../common/customui/SearchSuggestions";
import { GetApiRequestSearch } from "../../network/APIClient";

import debounce from "lodash.debounce";
import SmallLoader from "../common/customui/SmallLoader";

const Search = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [noData, setNoData] = useState([{id:'1234',title:'No results found.',html_url:''}]);
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
            if (query.trim() && query.length > 0) {
              setTotalPage(res.page_count)
              var data = filteredSuggestions.concat(res.results);
              if(data.length===0){
                data=[...noData]
              }
              setFilteredSuggestions(data);
            } else {
              setFilteredSuggestions([]); 
            }
          }else{
            console.log('No Data')
          }
        } catch (e) {}
      },
      (error) => {
        setIsLoading(false);
      }
    );
  };

  const onListScrollEnd = () => {
    if(pageNo<totalPage){
    setPageNo(pageNo + 1);
    
    }
  };


  useEffect(()=>{
    filterSuggestions(input);
  },[pageNo])

  const debouncedSearch = useCallback(debounce(filterSuggestions, 300), []);

  useEffect(() => {
    debouncedSearch(input);

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

  const ListEndLoader = () => { return <SmallLoader size={"small"} />; };

  return (
    <View style={styles.support}>
      <ProfileSettingsHeader title="Search" onPressBack={() => navigation.navigate("support")} />
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

    </View>
  );
};

const styles = StyleSheet.create({
  support: { backgroundColor: Color.sparklightWhite, flex: 1, },
  content: { flex: 1, },
});

export default Search;
