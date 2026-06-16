// [51768] Full-screen in-app login. Replaces the iOS system auth sheet (cramped on iPad, can hang on submit).
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import Touchable from "../common/customui/Touchable";
import { buildAuthRequest, parseCallback, exchangeCodeForTokens } from "../../utils/WebViewAuthManager";

const AUTH_TIMEOUT = 120000;

const WebViewLoginModal = ({ visible, config, onSuccess, onError, onCancel }) => {
  const [request, setRequest] = useState(null);
  const [exchanging, setExchanging] = useState(false);
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
      clearTimer();
      return;
    }
    handledRef.current = false;
    setExchanging(false);
    setRequest(buildAuthRequest(config));
    timeoutRef.current = setTimeout(() => finish(onError, { code: "AUTH_TIMEOUT" }), AUTH_TIMEOUT);
    return clearTimer;
  }, [visible]);

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

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={() => finish(onCancel)}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
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
        {request && (
          <WebView
            source={{ uri: request.url }}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onError={onWebViewError}
            onHttpError={onWebViewError}
            javaScriptEnabled
            domStorageEnabled
            incognito
            originWhitelist={["*"]}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loading}><ActivityIndicator size="large" color="#8D3B90" /></View>
            )}
          />
        )}
        {exchanging && (
          <View style={styles.loading}><ActivityIndicator size="large" color="#8D3B90" /></View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  loading: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});

export default WebViewLoginModal;
