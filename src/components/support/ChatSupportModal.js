import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from "react-native";
import WebView from "react-native-webview";

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
import SupportChatHeader from "../common/SupportChatHeader";
import LoadingOverlay from "../common/customui/CustomLoadingOverlay";

const ChatSupportModal = ({ department, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [speedTestState, setSpeedTestState] = useState({});
  const [host, setHost] = useState("");
  const [loading,setLoading]=useState(false)
  const user = useSelector(state => state.combinedReducers.user.userData);
  
 
  let departmentTag=(department==='tech')? 'resi_tech' : 'resi_bill'
  const tags = [departmentTag,'resimobileapp', 'pid_'+user.userInfo.accountNumber];

  // Convert tags array to string format accepted by Zendesk Chat Widget
  const tagsString = JSON.stringify(tags);
 
  let departmentName=(department==='tech')? 'Tech' : 'Bill'
  // JavaScript code to set tags for Zendesk Chat Widget
  const injectedJavaScript = `
    window.zESettings = {
      webWidget: {
        color: { 
          theme: '#353091',
          launcher: '#353091', // This will also update the badge
          launcherText: '#EBEEF1',
          button: '#353091',
          resultLists: '#353091',
          header: '#353091',
          articleLinks: '#353091'
        },
        chat: {
          departments: {
            //  enabled: []
              enabled: ['SPK TCC Residential'],
  
              select: ['SPK TCC Residential'],
            },
          tags: ${tagsString},
        
        }
      }
    };
  `;

  const injectedJavaScriptBill = `
    window.zESettings = {

      
      webWidget: {
        color: { 
          theme: '#353091',
          launcher: '#353091', // This will also update the badge
          launcherText: '#EBEEF1',
          button: '#353091',
          resultLists: '#353091',
          header: '#353091',
          articleLinks: '#353091'
        },
        chat: {
          departments: {
            //  enabled: []
              enabled: ['SPK Virtual Call Center'],
  
              select: ['SPK Virtual Call Center'],
            },
          tags: ${tagsString},
        
        }
      }
    };
  `;
  
  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const navigationChange = (navState) => {
    console.log("navigationChange: ", navState);
  };

  const onMessage = (event) => {
    //console.log("onMessageEvent: ", event.nativeEvent.data)
    if( event.nativeEvent.data==='open'){
      closeModal()
    }
  };
  const exitConfirmation=()=>{
    console.log('Wait exit')
    Alert.alert("Please stay on this page to continue the chat", "Are you sure you want to leave?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
            onClose()
        }}
      ]);
}

  
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1,backgroundColor:'#fff' }}>
        <SupportChatHeader onPressBack={()=>{
          exitConfirmation();
        }} title="Chat With Us" />
        <View style={{ width: "100%", height: "84%" }}>
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
            //onNavigationStateChange={navigationChange}
            onMessage={onMessage}
            onLoadStart={()=>{
              setLoading(true)
            }}
            onLoadEnd={()=>{
              setTimeout(()=>{
                setLoading(false)
              },1000)
            }}
            onShouldStartLoadWithRequest={(request) => {
              if(request.url.includes('attachments')) {
                Linking.openURL(request.url)
                return false
              } else return true
            }}
            
            injectedJavaScript={(department==='tech')?injectedJavaScript:injectedJavaScriptBill}
          />
        </View>
        {loading && (
        <LoadingOverlay
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
