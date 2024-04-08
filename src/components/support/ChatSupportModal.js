import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable
} from "react-native";
import WebView from "react-native-webview";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";

const ChatSupportModal = ({ department, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [speedTestState, setSpeedTestState] = useState({});
  const [host, setHost] = useState("");
  
  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const navigationChange = (navState) => {
    console.log('navigationChange: ', navState);
  }

  const onMessage = (event) => {
    console.log('onMessageEvent: ', event);
  }  

  const INJECTED_JAVASCRIPT = `(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function(event) {
            //alert('hello');
            document.getElementsByTagName("header")[0].style.display = 'none';
            document.getElementsByTagName("main")[0].style.display = 'none';
            document.getElementsByTagName("footer")[0].style.display = 'none';
            document.getElementById("ada-entry").style.display = 'none';
            chatProLink(1500003304301);
            window.ReactNativeWebView.postMessage("EventResponse: " + JSON.stringify(this));
            //var message = {"status" : this.status, "responseURL" : this.responseURL, "response" : this.response}
            //window.ReactNativeWebView.postMessage("WEBViewResponse: " + JSON.stringify(message));
            // var speedTest = {
            //   "ping": Number(document.getElementsByClassName("result-tile-ping")[0].getElementsByClassName("number")[0].innerText),
            //   "jitter": Number(document.getElementsByClassName("result-tile-jitter")[0].getElementsByClassName("number")[0].innerText),
            //   "download": Number(document.getElementsByClassName("result-tile-download")[0].getElementsByClassName("number")[0].innerText),
            //   "upload": Number(document.getElementsByClassName("result-tile-upload")[0].getElementsByClassName("number")[0].innerText),
            //   "responseURL": this.responseURL,
            // }
            // window.ReactNativeWebView.postMessage(JSON.stringify(speedTest));
        }); 
        open.apply(this, arguments);
    };})();`;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
        <View style={{flex:1}}>
          <ProfileSettingsHeader onPressBack={closeModal} title='Chat With Us' />            
          <View style={{width:'100%',height:'80%',}}>
              <WebView
                source={{ uri: 'https://www.sparklight.com/contactus' }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onNavigationStateChange={navigationChange}
                onMessage={onMessage}
                injectedJavaScript={INJECTED_JAVASCRIPT}
              />
          </View>
        </View>
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

export default ChatSupportModal;
