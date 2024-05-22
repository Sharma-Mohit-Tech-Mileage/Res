import React, {  useState,useEffect } from "react";
import { WebView } from "react-native-webview";
import { Button, Modal, View,SafeAreaView } from "react-native";
//import ChatHtml from '../utility/index.html'

// Author:    Hetmann Wilhelm Iohan
// Email:     contact@react-ui-kit.com
// Web:       https://react-ui-kit.com
// YouTube:   https://www.youtube.com/react-ui-kit

// This is a basic example showing how to use Zendesk Chat Widget using a webview inside a modal and a html code
// Currently Zendesk Chat SDK doesn't support React-Native so
// this is a standalone example using just a HTML code and JS widget

// How to use
// 1. copy/paste the zendesk_chat_key from resource #3 link
// 2. originWhitelist is set to "about:blank" to open any links outside the WebView Modal
// 3. customize the widget using resource #2 link
// 4. from a web browser and as an agent open resource #1 link to chat with clients from the app

// Resources
// 1. Zendesk Chat Agent url: https://splendchat.zendesk.com/chat/agent
// 2. Zendesk Chat API Key: https://splendchat.zendesk.com/chat/agent?#widget/getting_started
// 3. Zendesk Web Widget: https://developer.zendesk.com/embeddables/docs/widget/core




const ZendeskChat =()=>  {
  const [showChat,setShowChat]=useState(false)

  useEffect(() => {
    // Initialize Zendesk Chat
    window.zESettings = {
      webWidget: {
        chat: {
          departments: true,
          prechatForm: {
            greeting: {
              '*': 'Welcome to our chat support! How can we assist you today?',
            },
            departmentField: {
              '*': 'Please select a department:',
            },
            nameLabel: {
              '*': 'Name:',
            },
            emailLabel: {
              '*': 'Email:',
            },
            departmentLabel: {
              '*': 'Department:',
            },
            submitLabel: {
              '*': 'Start Chat',
            },
          },
        },
      },
    };
  }, []);
  

  const chatHTML=()=> {
    
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Hello, World!</title>
    </head>
    
    <body>
        <p>Hello, World!</p>
    
        <!-- Start of Zendesk Widget script -->
        <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=ad791f41-3c05-490b-8bb3-55afe1751f92">
        </script>
        <!-- End of Zendesk Widget script -->
        
    </body>
    
    </html>`;
  }

  const RenderChat=()=> {
    
    const userAgent = "YourApp";

    return (
      <Modal {...this.props} visible={showChat}>
        <View style={{ width: "100%", height: "100%",marginTop:20 }}>
        <WebView
          useWebKit
          style={{ flex: 1 }}
          hideKeyboardAccessoryView
          source={require("../utility/ZendeskChat.html")}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          applicationNameForUserAgent={userAgent}
          onMessage={({ nativeEvent }) => {
            nativeEvent.data === "close" && setShowChat(false);
          }}
          originWhitelist={['*']}
          // shouldStartLoadWithRequestHandler={({ url }) => url.startsWith("about:blank")}
        />
        </View>
      </Modal>
    );
  }
  
    return (
      <SafeAreaView style={{ flex: 1,justifyContent:'center' }}>
        <View>
        <Button
          title="Chat with us"
          color="black"
          onPress={() => setShowChat(true)}
        />
        <RenderChat/>
        </View>
      </SafeAreaView>
    );
  
}

ZendeskChat.defaultProps = {
  title: "Test",
  user: {
    name: "React UI Kit",
    email: "contact@react-ui-kit.com",
    phone: "12345678",
  },
  zendesk_chat_key: "1500003304301",
  // get the key from the code snippet found at:
  // https://splendchat.zendesk.com/chat/agent?#widget/getting_started
};

export default ZendeskChat;
