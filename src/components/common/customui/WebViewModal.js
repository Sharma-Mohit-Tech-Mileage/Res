import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Pressable
} from "react-native";
import WebView from "react-native-webview";
import { Padding, Color, FontFamily, Border, FontSize } from "../../../../GlobalStyles";
const WebViewModal = ({ url, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);
  console.log(url);
  React.useEffect(() => {
    console.log("OKAL", url);
  });
  const closeModal = () => {
    setModalVisible(false);
    onClose(); // You might want to perform additional actions on modal close
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{flex:1}}>
        <View style={styles.header}>
        <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={closeModal}
                accessibilityRole="button"
                accessibilityLabel="Close Okla Page"
              >
                <Text style={[styles.closeBtn, styles.text1Clr]}>Close</Text>
              </Pressable>
          </View>
          <View style={{width:'100%',height:'80%',}}>
        <WebView
          key={url}
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}

          // You can add other WebView props here
        />
        </View>  
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "#f2f2f2",
    width: "100%",
  },
  closeButton: {
    alignSelf:'flex-end',
    color: "white",
    fontSize: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  webview: {
    flex: 1,
    width: "100%",
  },closeBtn: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  }, buttonsLayout: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  text1Clr: {
    color: Color.colorWhitesmoke_200,
    textAlign: "center",
  },
});

export default WebViewModal;
