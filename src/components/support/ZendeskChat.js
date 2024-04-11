import React, { Component, useState,useEffect } from "react";
import { WebView } from "react-native-webview";
import { Button, Modal, View } from "react-native";

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
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Chat | </title>
  <!-- Start of Zendesk Widget script -->
  <script src="https://static.zdassets.com/ekr/snippet.js?key=ad791f41-3c05-490b-8bb3-55afe1751f92"></script>
  
  <!-- End of Zendesk Widget script -->
  <style type="text/css">html { background: #FFF; }</style>
</head>
<body>

<script>

alert('Reached chat')


</script>
</body>
</html>
`;
  }

  const renderChat=()=> {
    
    const userAgent = "YourApp";

    return (
      <Modal {...this.props} visible={showChat}>
        <WebView
          useWebKit
          style={{ flex: 1 }}
          hideKeyboardAccessoryView
          source={{ html: chatHTML() }}
          showsVerticalScrollIndicator={false}
          applicationNameForUserAgent={userAgent}
          onMessage={({ nativeEvent }) => {
            nativeEvent.data === "close" && this.setState({ showChat: false });
          }}
          originWhitelist={["about:blank"]}
          // shouldStartLoadWithRequestHandler={({ url }) => url.startsWith("about:blank")}
        />
      </Modal>
    );
  }
  
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button
          title="Chat with us"
          color="black"
          onPress={() => setShowChat(true)}
        />
        {renderChat()}
      </View>
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
