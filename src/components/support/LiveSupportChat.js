import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";

import * as Zendesk from 'react-native-zendesk-messaging';
 
const LiveSupportChat = () => {
    
    var zendesk_chat_key='939402da-c188-4f5e-a869-46922a124b52'
    const userAgent = "YourApp";
  const customHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chat </title>
    <!-- Start of Zendesk Widget script -->
    <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=ad791f41-3c05-490b-8bb3-55afe1751f92"></script>
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
  useEffect(() => {
    Zendesk.initialize({ channelKey:  Platform.OS === 'android'
    ? 'eyJzZXR0aW5nc191cmwiOiJodHRwczovL2NhYmxlb25lMTYxNTQwMjg1MS56ZW5kZXNrLmNvbS9tb2JpbGVfc2RrX2FwaS9zZXR0aW5ncy8wMUhKSkQyQ0VZUko5RUFNRVgxR1NHQlg2MC5qc29uIn0='
    : 'eyJzZXR0aW5nc191cmwiOiJodHRwczovL2NhYmxlb25lMTYxNTQwMjg1MS56ZW5kZXNrLmNvbS9tb2JpbGVfc2RrX2FwaS9zZXR0aW5ncy8wMUhKSkM2QVNWNFNDTkZGVFdYRVFYNjJQNC5qc29uIn0=' })
      .then(() => {

      })
      .catch((error) =>{

      });
  }, []);

  const handlePressOpenButton = () => {
    Zendesk.openMessagingView();
  };

  
  


  return (
     <SafeAreaView style={{flex:1,marginBottom:100}} visible={true}>
      <View>

       <TouchableOpacity onPress={()=>{
      //ZendeskAPI("webWidget", "setLocale", "Us");
      handlePressOpenButton()
       }}>
        <Text>Show Chat</Text>
       </TouchableOpacity>
        {/* <WebView
          style={{ flex: 1 }}
          hideKeyboardAccessoryView
         // source={{ uri: 'https://static.zdassets.com/admin/contributor/admin_center_framework_web_widget/60a0bd4a58d143fd4e90c50b06785f5196811dce/e7d54baed37b06d7a525edcca692734f.html#key=939402da-c188-4f5e-a869-46922a124b52&instructions=Save+your+changes+to+see+them+here.+They+may+take+a+moment+to+appear.&dir=ltr&locale=en-us&hasCustomLauncher=false&customLauncherOpen=Open+Web+Widget&title=Cable+ONE+Business' }}
          showsVerticalScrollIndicator={false}
          source={{html:customHTML}}
          javaScriptEnabled={true}
          
          // shouldStartLoadWithRequestHandler={({ url }) => url.startsWith("about:blank")}
        /> */}
        {/* <WebView
          style={{ flex: 1 }}
          hideKeyboardAccessoryView
          source={{ html: customHTML }}
          showsVerticalScrollIndicator={false}
          applicationNameForUserAgent={userAgent}
          onMessage={({ nativeEvent }) => {
            //nativeEvent.data === "close" && this.setState({ showChat: false });
          }}
          originWhitelist={["about:blank"]}
          // shouldStartLoadWithRequestHandler={({ url }) => url.startsWith("about:blank")}
        /> */}

</View>
      </SafeAreaView>
  );
};

export default LiveSupportChat;

