import React from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image"
const LoadingIcon = require("../../../../assets/loading.gif"); // Adjust the path as necessary
const LoadingWhiteIcon = require("../../../../assets/loader-white.gif");

const SmallLoader = ({ isWhite=false, width=80,height=60}) => {
  return (
      <FastImage
        resizeMode="contain"
        source={isWhite?LoadingWhiteIcon:LoadingIcon}
        style={[styles.LoaderSize,{width:width,height:height}]}
      />
  );
};
const styles = StyleSheet.create({
  LoaderSize: {
    width: 80, 
    height: 60 
  }
  
});
export default SmallLoader;
