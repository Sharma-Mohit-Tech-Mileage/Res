import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const GIVE_UP_MS = 15000;

// Android only: loads the url in a hidden WebView so the WebView process and HTTP cache are warm before the user taps.
const WebViewWarmup = ({ url }) => {
  const [active, setActive] = useState(false);
  const warmedUrl = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "android" || !/^https:\/\//i.test(url || "") || warmedUrl.current === url) return undefined;
    warmedUrl.current = url;
    setActive(true);
    const t = setTimeout(() => setActive(false), GIVE_UP_MS);
    return () => clearTimeout(t);
  }, [url]);

  if (!active) return null;
  return (
    <View style={styles.hidden} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
      <WebView
        source={{ uri: url }}
        cacheEnabled
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["https://*"]}
        onLoadEnd={() => setActive(false)}
        onError={() => setActive(false)}
        onHttpError={() => setActive(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: { position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" },
});

export default WebViewWarmup;
