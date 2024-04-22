import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Platform,
  ActivityIndicator
} from "react-native";
import WebView from "react-native-webview";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import {
  Padding,
  Color,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import { useSelector } from 'react-redux';
import techSupport from "../utility/ZendeskTechSupport.html"
import billSupport from "../utility/ZendeskChat.html"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../res/Colors";

const ChatSupportModal = ({ department, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [speedTestState, setSpeedTestState] = useState({});
  const [host, setHost] = useState("");
  const [loading,setLoading]=useState(false)
  const user = useSelector(state => state.combinedReducers.user.userData);
  
 
  const tags = ['Residential','Mobileapp', 'pid_'+user.userInfo.accountNumber];

  // Convert tags array to string format accepted by Zendesk Chat Widget
  const tagsString = JSON.stringify(tags);
 
  // JavaScript code to set tags for Zendesk Chat Widget
  const injectedJavaScript = `
    window.zESettings = {
      webWidget: {
        color: { 
          theme: '#8D3B90',
          launcher: '#8D3B90', // This will also update the badge
          launcherText: '#EBEEF1',
          button: '#8D3B90',
          resultLists: '#691840',
          header: '#8D3B90',
          articleLinks: '#8D3B90'
        },
        chat: {
          departments: {
            //  enabled: []
              enabled: [${department==='tech'}?'Resi Tech Support':'Resi Tech Support'],
  
              select: [${department==='tech'}?'Resi Tech Support':'Resi Tech Support'],

              enabled: [${department===' Bill'}?'Resi Bill Support':'Resi Bill Support'],
  
              select: [${department==='Bill'}?'Resi Bill Support':'Resi Bill Support'],
            },
          tags: ${tagsString},
        
        }
      }
    };
  `;
  console.log('setting',injectedJavaScript)
  


  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const navigationChange = (navState) => {
    console.log("navigationChange: ", navState);
  };

  const onMessage = (event) => {
    console.log("onMessageEvent: ", event);
  };

  // const INJECTED_JAVASCRIPT = `(function() {
  //   var open = XMLHttpRequest.prototype.open;
  //   XMLHttpRequest.prototype.open = function() {
  //       this.addEventListener("load", function(event) {
  //           //alert('hello');
  //           document.getElementsByTagName("header")[0].style.display = 'none';
  //           document.getElementsByTagName("main")[0].style.display = 'none';
  //           document.getElementsByTagName("footer")[0].style.display = 'none';
  //           document.getElementById("ada-entry").style.display = 'none';
  //           chatProLink(1500003304301);
  //           window.ReactNativeWebView.postMessage("EventResponse: " + JSON.stringify(this));
  //           //var message = {"status" : this.status, "responseURL" : this.responseURL, "response" : this.response}
  //           //window.ReactNativeWebView.postMessage("WEBViewResponse: " + JSON.stringify(message));
  //           // var speedTest = {
  //           //   "ping": Number(document.getElementsByClassName("result-tile-ping")[0].getElementsByClassName("number")[0].innerText),
  //           //   "jitter": Number(document.getElementsByClassName("result-tile-jitter")[0].getElementsByClassName("number")[0].innerText),
  //           //   "download": Number(document.getElementsByClassName("result-tile-download")[0].getElementsByClassName("number")[0].innerText),
  //           //   "upload": Number(document.getElementsByClassName("result-tile-upload")[0].getElementsByClassName("number")[0].innerText),
  //           //   "responseURL": this.responseURL,
  //           // }
  //           // window.ReactNativeWebView.postMessage(JSON.stringify(speedTest));
  //       });
  //       open.apply(this, arguments);
  //   };})();`;

  //const INJECTED_JAVASCRIPT = `(function () {     var script = document.createElement('script');     script.src = 'https://static.zdassets.com/ekr/snippet.js?key=key=ad791f41-3c05-490b-8bb3-55afe1751f92'; // Replace YOUR_ZENDESK_KEY with your Zendesk key    script.setAttribute('id', 'ze-snippet');     document.getElementsByTagName('head')[0].appendChild(script);     script.onload = function () {         // Initialize Zendesk Web Widgetwindow.zESettings = {             webWidget: {                 chat: {                     tags: ['tag1', 'tag2'], // Add any necessary tagsdepartment: 'Your Department' // Set the department for the chat                }             }         };         // Open Zendesk chatwindow.zE('webWidget', 'show');     }; })();`;

  const chatHTML=()=> {
    
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Hello, World!</title>
    </head>
    
    <body>
        <p>Hello, World!</p>
    
        <!-- Start of Zendesk Widget script -->
        <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=5b6f4fab-f7a4-4a5a-a133-04bc0cb80009">
        </script>
        <!-- End of Zendesk Widget script -->
    </body>
    
    </html>`;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1,backgroundColor:'#fff' }}>
        <ProfileSettingsHeader onPressBack={closeModal} title="Chat With Us" />
        <View style={{ width: "100%", height: "78%" }}>
          <WebView
           originWhitelist={["*"]}
           allowFileAccess={true}
            source={ Platform.OS==='android'?
              {uri: (department==='tech')?"file:///android_asset/ZendeskTechSupport.html":"file:///android_asset/ZendeskChat.html"}
              : (department==='tech')?techSupport:billSupport
            }
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            mixedContentMode="always"
            onNavigationStateChange={navigationChange}
            onMessage={onMessage}
            onLoadStart={()=>{
              setLoading(true)
            }}
            onLoadEnd={()=>{
              setTimeout(()=>{
                setLoading(false)
              },1000)
            }}
            
            injectedJavaScript={injectedJavaScript}
          />
        </View>
        {loading && (
        <ActivityIndicator
          style={{ position: "absolute", top: hp('50%'), left: wp('48%') }}
          size="large"
          color={colors.sparklight_bright_purple}
        />
      )}
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
    alignSelf: "flex-end",
    color: "white",
    fontSize: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  closeBtn: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  buttonsLayout: {
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
