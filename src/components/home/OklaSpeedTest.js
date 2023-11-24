import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import WebView from "react-native-webview";

const OklaSpeedTest = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity >
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <WebView
          
          source={{ uri: "https://cableone.speedtestcustom.com/" }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}

          // You can add other WebView props here
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'column'
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "#f2f2f2",
    width: "100%",
  },
  closeButton: {
    color: "blue",
    fontSize: 16,
  },
  webview: {
    flex: 1,
    width: "100%",
  },
});

export default OklaSpeedTest;
