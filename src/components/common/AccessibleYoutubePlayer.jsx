// components/common/AccessibleYoutubePlayer.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, AppState } from 'react-native';
import { WebView } from 'react-native-webview';

const AccessibleYoutubePlayer = ({ videoId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [needsReload, setNeedsReload] = useState(false);
  const webViewRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // Handle app state changes (background/foreground transitions)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        setNeedsReload(true);
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Reload WebView when needed
  useEffect(() => {
    if (needsReload && webViewRef.current) {
      webViewRef.current.reload();
      setNeedsReload(false);
    }
  }, [needsReload]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        style={styles.webView}
        accessibilityLabel="YouTube Video Player"
        source={{
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
              <style>
                /* Ensure iframe and body take full size */
                html, body {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                  overflow: hidden;
                  background: #000;
                }

                iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                }
              </style>
            </head>
            <body>
              <iframe
                src="https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&enablejsapi=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </body>
          </html>`
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        androidHardwareAccelerationDisabled={false}
        originWhitelist={['*']}
        cacheEnabled={false}
        incognito={true} // Prevents shared cookie/cache issues
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000', // Black background to match YouTube
  },
  webView: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
});

export default AccessibleYoutubePlayer;