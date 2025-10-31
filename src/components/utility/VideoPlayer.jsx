// components/common/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, AppState, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoPlayer = ({ videoId }) => {
  const webViewRef = useRef(null);
  const [key, setKey] = useState(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Reload WebView when app returns to foreground
        setKey(prevKey => prevKey + 1);
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
        <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #000;
          }

          #player-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }

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
            z-index: 10;
          }
          
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .loaded .loader {
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="player-container">
          <div class="loader"></div>
          <iframe
            id="youtube-player"
            src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&rel=0&playsinline=1&origin=${Platform.OS === 'ios' ? 'https://www.youtube.com' : 'https://sparklight.com'}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            title="Video Player"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>

        <script>
          // Remove loader once iframe loads
          document.getElementById('youtube-player').addEventListener('load', function() {
            setTimeout(function() {
              document.getElementById('player-container').classList.add('loaded');
            }, 500);
          });

          // Handle reload messages from React Native
          window.addEventListener('message', function(event) {
            if (event.data === 'reload') {
              location.reload();
            }
          });

          // Prevent any errors from propagating
          window.addEventListener('error', function(e) {
            console.log('Caught error:', e.message);
          });
        </script>
      </body>
    </html>
  `;

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('VideoPlayer WebView error:', nativeEvent);
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('VideoPlayer HTTP error:', nativeEvent);
  };

  return (
    <View style={styles.container}>
      <WebView
        key={key}
        ref={webViewRef}
        style={styles.webView}
        accessibilityLabel="YouTube Video Player"
        accessibilityRole="none"
        source={{ html: generateHtml() }}
        
        // Media playback settings
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        
        // JavaScript and DOM
        javaScriptEnabled={true}
        domStorageEnabled={true}
        
        // Cookie and cache settings - CRITICAL for YouTube
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        
        // Security and content settings
        mixedContentMode="always"
        allowsFullscreenVideo={true}
        allowsProtectedMedia={true}
        
        // Performance
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        
        // Network
        originWhitelist={['*']}
        
        // User agent - helps with YouTube compatibility
        userAgent={Platform.select({
          ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
          android: 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
        })}
        
        // Loading and error handling
        startInLoadingState={false}
        onError={handleError}
        onHttpError={handleHttpError}
        
        // iOS specific
        {...(Platform.OS === 'ios' && {
          allowsBackForwardNavigationGestures: false,
          bounces: false,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default VideoPlayer;
