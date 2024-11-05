import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AccessibleYoutubePlayer = ({ videoId }) => (
  <WebView
  style={styles.webView}
  accessibilityLabel="Sparklight Video Player"
  source={{
    html: `
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
      <style>
        /* Scale YouTube controls for better accessibility */
        .ytp-chrome-bottom, /* Bottom control bar */
        .ytp-chrome-top, /* Top control bar with video title and share button */
        .ytp-button, /* Individual buttons like play, pause, and share */
        .ytp-title { /* Video title */
          transform: scale(1.3); /* Adjust scaling as needed */
          transform-origin: center;
        }
        .ytp-title-text { /* Text size for video title */
          font-size: 18px; /* Increase font size */
        }
      </style>
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`
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
    height: 200,
    margin: 16, // Adds 16px margin on all sides of the WebView
  },
});

export default AccessibleYoutubePlayer;