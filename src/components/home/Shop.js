import React,{useState,useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import Article from '../support/ArticleModal';


const ShopScreen = ({route, navigation }) => {
  const [showWebView, setShowWebView] = React.useState(true);

  const handlePress = () => {
    console.log("clicked");
    setShowWebView(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {showWebView ? <Article /> : null}
    </View>
  );
  }
export default ShopScreen;