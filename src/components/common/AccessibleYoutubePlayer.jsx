// import React from 'react';
// import { Platform } from 'react-native';
// import { WebView } from 'react-native-webview';

// const AccessibleYoutubePlayer = ({ videoId }) => (
//   <WebView
//     style={{ height: 200 }}
//     source={{
//       html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/R8SrD7NFJaA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
//     }}
//     allowsInlineMediaPlayback={true}
//     javaScriptEnabled={true}
//     domStorageEnabled={true}
//     mixedContentMode="always"
//     androidHardwareAccelerationDisabled={false}
//     originWhitelist={['*']}
//   />
// );

// export default AccessibleYoutubePlayer;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AccessibleYoutubePlayer = ({ videoId }) => (
  <View style={styles.videoContainer}>
    <WebView
      style={{ height: 200 }}
      source={{
        html: `
          <style>
            /* Scale YouTube controls for better accessibility */
            .ytp-chrome-bottom {
              transform: scale(1.3); /* Adjust scaling as needed */
              transform-origin: center;
            }
          </style>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/R8SrD7NFJaA"
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
  </View>
);

const styles = StyleSheet.create({
  videoContainer: {
    paddingHorizontal: 16,
  },
});

export default AccessibleYoutubePlayer;