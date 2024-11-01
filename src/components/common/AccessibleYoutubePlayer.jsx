import React from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const AccessibleYoutubePlayer = ({ videoId }) => (
  <WebView
    style={{ height: 200 }}
    source={{
      html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/R8SrD7NFJaA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    }}
    allowsInlineMediaPlayback={true}
    javaScriptEnabled={true}
    domStorageEnabled={true}
    mixedContentMode="always"
    androidHardwareAccelerationDisabled={false}
    originWhitelist={['*']}
  />
);

export default AccessibleYoutubePlayer;