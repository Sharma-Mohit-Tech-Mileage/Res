import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Pressable,
} from "react-native";
import WebView from "react-native-webview";
//import ZendeskChat from "react-native-zendesk-chat";

const LiveSupportChat = () => {
    const [title,setTitle]=useState('Customer A')
    var zendesk_chat_key='939402da-c188-4f5e-a869-46922a124b52'
    const userAgent = "YourApp";
  const customHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chat | ${title}</title>
    <!-- Start of Zendesk Widget script -->
    <script id="ze-snippet"
      src="https://static.zdassets.com/ekr/snippet.js?key=${zendesk_chat_key}"> </script>
    <!-- End of Zendesk Widget script -->
    <style type="text/css">html { background: #FFF; }</style>
  </head>
  <body>
  <script>
  document.addEventListener( 'DOMContentLoaded', function( event ) {
    // zE('webWidget', 'prefill', {
    //   name: { value: "Test", readOnly: true },
    //   email: { value: "test123@gmail.com", readOnly: true },
    //   phone: { value: "1234345676", readOnly: true }
    // });
    // zE('webWidget', 'identify', { name: "Test", email: "test123@gmail.com" });
    zE('webWidget', 'open');
    zE('webWidget:on', 'close', () => window.ReactNativeWebView.postMessage("close"));
  });
  </script>
  </body>
  </html>
  `;
//   useEffect(()=>{
//     ZendeskChat.init({
//         key:zendesk_chat_key,
//         appId: "5866a7db96fafbee9a77ad15f15b795c8e1266614823087e",
//         url: "https://cableone1615402851.zendesk.com",
//         clientId: "mobile_sdk_client_4c85afcc16382ca72070",
//     })
//   setTimeout(()=>{
//     ZendeskChat.setVisitorInfo({
//         name: "Test",
//         email: "test123@gmail.com",
//     })
//   },1000)
    
//   },[])
//   const startChat=()=>{
//     ZendeskChat.startChat({
//         name: 'Test',
//         email: 'test123@gmail.com',
//         phone: '9876543210',
//         tags: ['tag1', 'tag2'],
//         department: "Cable",
//         chatOnly:true
//     });
//   }

  return (
     <SafeAreaView style={{flex:1,marginBottom:100}} visible={true}>
        <WebView
          style={{ flex: 1 }}
          hideKeyboardAccessoryView
          source={{ uri: 'https://static.zdassets.com/admin/contributor/admin_center_framework_web_widget/60a0bd4a58d143fd4e90c50b06785f5196811dce/e7d54baed37b06d7a525edcca692734f.html#key=939402da-c188-4f5e-a869-46922a124b52&instructions=Save+your+changes+to+see+them+here.+They+may+take+a+moment+to+appear.&dir=ltr&locale=en-us&hasCustomLauncher=false&customLauncherOpen=Open+Web+Widget&title=Cable+ONE+Business' }}
          showsVerticalScrollIndicator={false}
         
          
          // shouldStartLoadWithRequestHandler={({ url }) => url.startsWith("about:blank")}
        />
      </SafeAreaView>
  );
};

export default LiveSupportChat;

