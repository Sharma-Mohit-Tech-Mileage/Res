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
import { postCurrentSpeed } from "../../../redux/actions/DashboardAction";
import { useDispatch } from "react-redux";

const SpeedTestModal = ({ url, onClose }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);
  const [speedTestState, setSpeedTestState] = useState({});
  const [host, setHost] = useState("");
  
  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const navigationChange = (navState) => {
    if (navState.url.includes('/result/')) {
      onSubmitSpeedTest(speedTestState);
    }
  }

  const onMessage = (event) => {
    const speedTestData = JSON.parse(event.nativeEvent.data);
    if (speedTestData.responseURL.includes("hello?nocache")) {
      const url = new URL(speedTestData.responseURL);
      if (url !== undefined) {
        setHost(url.hostname);
      }
    }
    speedTestData.host = host;
    setSpeedTestState(speedTestData);
  }  

  const onSubmitSpeedTest = (speedTest) => {
    dispatch(postCurrentSpeed(speedTest));
  }

  const INJECTED_JAVASCRIPT = `(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function(event) {
            //window.ReactNativeWebView.postMessage("EventResponse: " + JSON.stringify(this));
            //var message = {"status" : this.status, "responseURL" : this.responseURL, "response" : this.response}
            //window.ReactNativeWebView.postMessage("WEBViewResponse: " + JSON.stringify(message));
            var speedTest = {
              "ping": Number(document.getElementsByClassName("result-tile-ping")[0].getElementsByClassName("number")[0].innerText),
              "jitter": Number(document.getElementsByClassName("result-tile-jitter")[0].getElementsByClassName("number")[0].innerText),
              "download": Number(document.getElementsByClassName("result-tile-download")[0].getElementsByClassName("number")[0].innerText),
              "upload": Number(document.getElementsByClassName("result-tile-upload")[0].getElementsByClassName("number")[0].innerText),
              "responseURL": this.responseURL,
            }
            window.ReactNativeWebView.postMessage(JSON.stringify(speedTest));
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
          onNavigationStateChange={navigationChange}
          onMessage={onMessage}
          injectedJavaScript={INJECTED_JAVASCRIPT}
        />
        </View>  
        <Text style={{marginHorizontal:20,fontSize:12,color:Color.sparklightaddGray,textAlign:'center'}}>All trademarks of Ookla, LLC, including Speedtest®, are used under license.</Text>
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

export default SpeedTestModal;
