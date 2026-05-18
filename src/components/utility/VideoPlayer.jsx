import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, AppState, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Border } from "../../../GlobalStyles";

const VideoPlayer = ({ videoId, bundleId = "com.sparklight.app" }) => {
  const webViewRef = useRef(null);
  const [key, setKey] = useState(0);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setKey((prevKey) => prevKey + 1);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const generateHtml = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
        <meta name="referrer" content="strict-origin-when-cross-origin">
        <base href="https://${bundleId}/">
        <style>
          /* Ensure iframe and body take full size */
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: #000;
          }

          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }

          /* Initially hide content until fully loaded */
          .content {
            visibility: hidden;
            height: 100%;
            width: 100%;
          }
          
          /* Loading indicator */
          .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #8D3B90;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        </style>
        <script>
          // Make content visible after iframe loads
          function showContent() {
            document.querySelector('.content').style.visibility = 'visible';
            document.querySelector('.loader').style.display = 'none';
          }
          
          // Handle messages from React Native
          window.addEventListener('message', function(event) {
            if (event.data === 'reload') {
              location.reload();
            }
          });
        </script>
      </head>
      <body>
        <div class="loader"></div>
        <div class="content">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&playsinline=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
            onload="showContent()"
            title="YouTube video player"
          ></iframe>
        </div>
      </body>
    </html>
  `;

  const injectedJavaScript = `
    (function() {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        originalOpen.apply(this, arguments);
        if (url.includes('youtube')) {
          this.setRequestHeader('Referer', 'https://${bundleId}/');
        }
      };
      
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        if (typeof url === 'string' && url.includes('youtube')) {
          options.headers = options.headers || {};
          options.headers['Referer'] = 'https://${bundleId}/';
        }
        return originalFetch(url, options);
      };
    })();
    true;
  `;

  return (
    <View style={styles.container} >
      <WebView
        key={key}
        ref={webViewRef}
        
        accessible={true} accessibilityLabel="Welcome to Sparklight Video. Video player loaded" accessibilityHint="Double tab to Watch on YouTube"
        style={styles.webView}
        source={{
          html: generateHtml(),
          baseUrl: `https://${bundleId}/`,
        }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        androidLayerType="hardware"
        thirdPartyCookiesEnabled={true}
        originWhitelist={["*"]}
        startInLoadingState={true}
        cacheEnabled={false}
        onError={(error) => console.warn("WebView error:", error)}
        injectedJavaScript={injectedJavaScript}
        {...(Platform.OS === "ios" && {
          allowsLinkPreview: false,
          dataDetectorTypes: "none",
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8D3B90",
  },
  webView: {
    flex: 1,
    borderRadius: Border.br_5xs,
    overflow: "hidden",
  },
});

export default VideoPlayer;
