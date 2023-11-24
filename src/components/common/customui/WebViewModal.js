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
        <WebView
          key={url}
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}

          // You can add other WebView props here
        />
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
    color: "blue",
    fontSize: 16,
  },
  webview: {
    flex: 1,
    width: "100%",
  },
});

export default WebViewModal;
