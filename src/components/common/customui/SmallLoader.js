import React from "react";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const SmallLoader = ({ isWhite=false, width=80,height=60}) => {
    const animationSource = isWhite
    ? require("../../../../assets/animations/loader-white.json")
    : require("../../../../assets/animations/loader-colored.json");
  return (
      <LottieView
        source={animationSource}
        autoPlay
        loop
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
