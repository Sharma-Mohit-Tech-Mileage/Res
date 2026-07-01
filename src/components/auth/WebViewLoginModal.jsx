// [51768] Full-screen in-app login overlay (NOT RN <Modal>: a Modal spawns its own Android window that doesn't pass the keyboard/IME to the WebView, so login inputs couldn't be typed into). Progressive top bar instead of a blocking spinner so the form is usable as it paints.
import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import Touchable from "../common/customui/Touchable";
import { buildAuthRequest, parseCallback, exchangeCodeForTokens } from "../../utils/WebViewAuthManager";

const AUTH_TIMEOUT = 120000;

const WebViewLoginModal = ({ visible, config, onSuccess, onError, onCancel }) => {
  const insets = useSafeAreaInsets();
  const [request, setRequest] = useState(null);
  const [exchanging, setExchanging] = useState(false);
  const [progress, setProgress] = useState(0);
  const handledRef = useRef(false);
  const timeoutRef = useRef(null);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  // Single-shot completion guard so a redirect + timeout can't both fire callbacks.
  const finish = useCallback((fn, arg) => {
    if (handledRef.current) return;
    handledRef.current = true;
    clearTimer();
    fn?.(arg);
  }, []);

  useEffect(() => {
    if (!visible) {
      setRequest(null);
      setExchanging(false);
      setProgress(0);
      clearTimer();
      return;
    }
    handledRef.current = false;
    setExchanging(false);
    setProgress(0);
    setRequest(buildAuthRequest(config));
    timeoutRef.current = setTimeout(() => finish(onError, { code: "AUTH_TIMEOUT" }), AUTH_TIMEOUT);
    return clearTimer;
  }, [visible]);

  // Android hardware back closes the login overlay (replaces the Modal's onRequestClose).
  useEffect(() => {
    if (!visible) return undefined;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      finish(onCancel);
      return true;
    });
    return () => sub.remove();
  }, [visible, finish, onCancel]);

  const handleRedirect = useCallback(async (callbackUrl) => {
    const { code, state, sessionState, error } = parseCallback(callbackUrl);
    if (error || !code || state !== request?.state) {
      finish(onError, { code: "AUTH_FAILED", error: error || "invalid_callback" });
      return;
    }
    setExchanging(true);
    try {
      const data = await exchangeCodeForTokens(config, code, request.codeVerifier, sessionState);
      finish(onSuccess, data);
    } catch (e) {
      finish(onError, { code: "AUTH_FAILED", error: e?.message });
    }
  }, [request, config, finish, onSuccess, onError]);

  // Catch the redirect to the app's custom scheme before the WebView tries to navigate to it.
  const onShouldStartLoadWithRequest = useCallback((req) => {
    const u = req.url || "";
    if (u.startsWith(config.redirectUrl) || (!u.startsWith("http://") && !u.startsWith("https://"))) {
      if (u.startsWith(config.redirectUrl)) handleRedirect(u);
      return false;
    }
    return true;
  }, [config, handleRedirect]);

  const onWebViewError = useCallback(() => finish(onError, { code: "NETWORK_ERROR" }), [finish, onError]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
          <Touchable
            accessibilityLabel="Cancel login"
            accessibilityRole="button"
            onPress={() => finish(onCancel)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Touchable>
          <Text style={styles.headerTitle}>Sign In</Text>
          <View style={styles.cancelButton} />
        </View>
        {progress < 1 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(8, progress * 100)}%` }]} />
          </View>
        )}
        {request && (
          <WebView
            source={{ uri: request.url }}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onError={onWebViewError}
            onHttpError={onWebViewError}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            javaScriptEnabled
            domStorageEnabled
            incognito
            originWhitelist={["*"]}
          />
        )}
        {exchanging && (
          <View style={styles.loading}><ActivityIndicator size="large" color="#8D3B90" /></View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#fff", zIndex: 1000, elevation: 1000 },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
    backgroundColor: "#fff",
  },
  cancelButton: { minWidth: 72, justifyContent: "center" },
  cancelText: { color: "#8D3B90", fontSize: 16, fontWeight: "600" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "600", color: "#001321" },
  progressTrack: { height: 3, backgroundColor: "#EEE" },
  progressFill: { height: 3, backgroundColor: "#8D3B90" },
  loading: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});

export default WebViewLoginModal;
