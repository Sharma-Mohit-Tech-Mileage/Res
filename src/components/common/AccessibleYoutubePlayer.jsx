// components/common/AccessibleYoutubePlayer.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AccessibleYoutubePlayer = ({ videoId }) => (
  <WebView
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
            }

            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }

            /* Initially hide content until fully loaded */
            body {
              visibility: hidden;
            }
          </style>
          <script>
            // Make content visible after iframe loads
            function showContent() {
              document.body.style.visibility = 'visible';
            }
          </script>
        </head>
        <body onload="showContent()">
          <iframe
            src="https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </body>
      </html>`
    }}
    allowsInlineMediaPlayback={true}
    javaScriptEnabled={true}
    domStorageEnabled={true}
    mixedContentMode="always"
    androidHardwareAccelerationDisabled={false}
    originWhitelist={['*']}
  />
);

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default AccessibleYoutubePlayer;