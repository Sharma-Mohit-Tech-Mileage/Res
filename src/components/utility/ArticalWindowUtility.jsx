import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated, Alert } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RefreshToken, RefreshIdTokenOnly } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
// import analytics from '@react-native-firebase/analytics'; // disabled — noisy logs, no useful debug info
import LoadingOverlay from '../common/customui/CustomLoading';
import LoadingSpinner from './LoadingSpinner';
import { getUser } from '../../redux/utils/LocalStorage';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains, refreshIdTokenOnAllDomains } from './NativeCookieManager';
import { ISUAT } from '../../network/apis/account/Constants';

const TAG = '[ArticalWindow]';
const JS_COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';
const ID_TOKEN_REFRESH_INTERVAL_MS = 4 * 60 * 1000;

// ── Timestamp helper for debug logs (will be removed after tracing) ──
const ts = () => {
    const d = new Date();
    return `${d.toLocaleTimeString('en-US', { hour12: false })}.${String(d.getMilliseconds()).padStart(3, '0')}`;
};

// ── Shared cookie-setting JS (embedded in injection script + standalone injections) ──
const buildCookieJS = (idToken) => {
    const safe = (idToken || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    // IMPORTANT: domain= ensures cookies cover ALL subdomains (customer.*, payment.*, etc.)
    // Without it, cookies are host-specific and won't update across cross-subdomain navigations.
    return `var _long = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
var _short = new Date(Date.now() + 5*60*1000).toUTCString();
var _dom = '; domain=${JS_COOKIE_DOMAIN}';
document.cookie = 'Source=MobileApp; path=/' + _dom + '; expires=' + _long + ';';
document.cookie = 'CustomerType=Residential; path=/' + _dom + '; expires=' + _long + ';';
document.cookie = 'LatestVersion=true; path=/' + _dom + '; expires=' + _long + ';';
if ('${safe}') document.cookie = 'IdToken=${safe}; path=/' + _dom + '; expires=' + _short + ';';`;
};

// ── Injection script (injectedJavaScriptBeforeContentLoaded) ──
// Seeds localStorage + cookies, intercepts XHR for PDFs, handles PING/PONG, manages form state.
const buildInjectionScript = (token, userInfo, idToken) => {
    const safeToken = (token || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeUserInfo = (typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}))
        .replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    return `(function() {
    try {
        // Token injection
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
        }

        // Clear any stale host-specific cookies (no domain= attr) left from before the fix.
        // This ensures the domain-scoped cookie below is the ONLY one the server sees.
        try {
            var _expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'IdToken=; path=/; expires=' + _expire + ';';
            document.cookie = 'Source=; path=/; expires=' + _expire + ';';
            document.cookie = 'CustomerType=; path=/; expires=' + _expire + ';';
            document.cookie = 'LatestVersion=; path=/; expires=' + _expire + ';';
        } catch(e) {}

        // Cookie injection with domain= (covers all subdomains, fails silently on about:blank)
        try { ${buildCookieJS(idToken)} } catch(e) {}

        // ── Network activity logging (XHR) + PDF intercept ──
        var _xo = XMLHttpRequest.prototype.open, _xs = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(m, u) {
            this._method = m;
            this._url = u;
            return _xo.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            var self = this;
            var _ts = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
            var payload = '';
            try { if (body) payload = typeof body === 'string' ? body.substring(0, 500) : JSON.stringify(body).substring(0, 500); } catch(e) {}
            // Cookie diagnostics: capture what cookies the browser will send
            var _cookies = '';
            try {
                var dc = document.cookie || '';
                var idMatch = dc.match(/IdToken=([^;]{0,20})/);
                var hasSource = dc.includes('Source=');
                var hasCType = dc.includes('CustomerType=');
                _cookies = 'IdToken=' + (idMatch ? idMatch[1] + '...' : 'MISSING') + ' | Source=' + (hasSource ? 'YES' : 'MISSING') + ' | CustomerType=' + (hasCType ? 'YES' : 'MISSING') + ' | cookieLen=' + dc.length;
            } catch(e) { _cookies = 'READ_ERROR'; }
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'networkLog', phase: 'request', ts: _ts,
                method: self._method, url: self._url, payload: payload, cookies: _cookies
            }));
            this.addEventListener('load', function() {
                var rTs = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
                var respSnippet = '';
                try { respSnippet = (self.responseText || '').substring(0, 300); } catch(e) {}
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'networkLog', phase: 'response', ts: rTs,
                    method: self._method, url: self._url, status: self.status, body: respSnippet
                }));
                // PDF intercept
                if ((self._url.includes('/statements/') || self._url.includes('Statement')) && self.status === 200) {
                    try {
                        var d = JSON.parse(self.response);
                        if (d.fileBinary) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pdf', data: d.fileBinary }));
                        }
                    } catch(e) {}
                }
            });
            this.addEventListener('error', function() {
                var eTs = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'networkLog', phase: 'error', ts: eTs,
                    method: self._method, url: self._url, error: 'XHR network error'
                }));
            });
            return _xs.apply(this, arguments);
        };

        // ── Network activity logging (fetch) ──
        var _fetch = window.fetch;
        window.fetch = function(input, init) {
            var fUrl = typeof input === 'string' ? input : (input.url || '');
            var fMethod = (init && init.method) || 'GET';
            var fTs = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
            var fPayload = '';
            try { if (init && init.body) fPayload = String(init.body).substring(0, 500); } catch(e) {}
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'networkLog', phase: 'request', ts: fTs,
                method: fMethod, url: fUrl, payload: fPayload
            }));
            return _fetch.apply(this, arguments).then(function(resp) {
                var rTs = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'networkLog', phase: 'response', ts: rTs,
                    method: fMethod, url: fUrl, status: resp.status
                }));
                return resp;
            }).catch(function(err) {
                var eTs = new Date().toLocaleTimeString('en-US', {hour12:false}) + '.' + String(new Date().getMilliseconds()).padStart(3,'0');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'networkLog', phase: 'error', ts: eTs,
                    method: fMethod, url: fUrl, error: err.message
                }));
                throw err;
            });
        };

        // PING/PONG (alive check) + SAVE_STATE (form persistence)
        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pong' }));
            } else if (e.data === 'SAVE_STATE' && window.saveFormState) {
                window.saveFormState();
            }
        });

        // Form state save/restore
        window.saveFormState = function() {
            var fd = {};
            document.querySelectorAll('input, select, textarea').forEach(function(el, i) {
                if (el.type !== 'password' && el.value) {
                    fd['field_' + i] = { value: el.value, id: el.id, name: el.name };
                }
            });
            localStorage.setItem('formState', JSON.stringify(fd));
            localStorage.setItem('scrollPosition', window.scrollY);
        };
        window.restoreFormState = function() {
            try {
                var s = localStorage.getItem('formState');
                if (s) {
                    var fd = JSON.parse(s);
                    document.querySelectorAll('input, select, textarea').forEach(function(el, i) {
                        var sf = fd['field_' + i];
                        if (sf && el.type !== 'password') el.value = sf.value;
                    });
                    var sp = localStorage.getItem('scrollPosition');
                    if (sp) window.scrollTo(0, parseInt(sp));
                }
            } catch(e) {}
        };
        setInterval(window.saveFormState, 5000);
        if (document.readyState === 'complete') window.restoreFormState();
        else window.addEventListener('load', window.restoreFormState);

        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'injectionComplete' }));
    } catch(e) {
        console.error('[ArticalWindow] Injection error:', e.message);
    }
})();
true;`;
};

// ── Component ───────────────────────────────────────────────────────────────

const ArticalWindowUtility = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [name] = useState(route.params?.name);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [url] = useState(route.params?.url);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);
    const [webViewReady, setWebViewReady] = useState(false);
    const [injectionScript, setInjectionScript] = useState('');

    const user = useSelector(state => state.user.userData);
    const webViewRef = useRef();
    const aliveCheckResolver = useRef(null);
    const aliveCheckTimeout = useRef(null);
    const backgroundTimestamp = useRef(0);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const initialLoadComplete = useRef(false);
    const silentRefreshTimer = useRef(null);
    const pendingOfflineRefresh = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    // ── Build injection script with fresh tokens from storage ────────────────

    const prepareInjectionScript = useCallback(async () => {
        try {
            let cu = await getUser();
            if (!cu?.idToken) {
                try {
                    await RefreshIdTokenOnly();
                    cu = await getUser();
                } catch (e) {
                    console.warn(`${TAG} [${ts()}] idToken pre-fetch failed (non-fatal):`, e.message);
                }
            }
            await setAuthCookiesOnAllDomains(cu?.idToken || '');
            setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || ''));
            setWebViewReady(true);
        } catch (e) {
            console.error(`${TAG} [${ts()}] prepareInjectionScript failed:`, e.message);
            setWebViewReady(true);
        }
    }, []);

    // ── Inject auth into live WebView (native cookies + JS cookies + localStorage) ──

    const injectAuth = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            if (idToken) await setAuthCookiesOnAllDomains(idToken);

            const safeToken = (cu?.token || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const safeUserInfo = (typeof cu?.userInfo === 'string' ? cu.userInfo : JSON.stringify(cu?.userInfo || {}))
                .replace(/\\/g, '\\\\').replace(/'/g, "\\'");

            webViewRef.current.injectJavaScript(`(function() {
    try {
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(idToken)}
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
        }
    } catch(e) {}
})(); true;`);
        } catch (e) {
            console.error(`${TAG} [${ts()}] injectAuth failed:`, e.message);
        }
    }, []);

    // ── Silent IdToken refresh (runs every 4 min) ───────────────────────────

    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const freshIdToken = await RefreshIdTokenOnly();
            if (!freshIdToken) {
                pendingOfflineRefresh.current = true;
                return;
            }
            pendingOfflineRefresh.current = false;
            await refreshIdTokenOnAllDomains(freshIdToken);
            webViewRef.current.injectJavaScript(`(function() {
    try {
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(freshIdToken)}
    } catch(e) {}
})(); true;`);
        } catch (e) {
            console.error(`${TAG} [${ts()}] Silent refresh failed:`, e.message);
            pendingOfflineRefresh.current = true;
        }
    }, []);

    const stopSilentRefresh = useCallback(() => {
        if (silentRefreshTimer.current) {
            clearInterval(silentRefreshTimer.current);
            silentRefreshTimer.current = null;
        }
    }, []);

    const startSilentRefresh = useCallback(() => {
        stopSilentRefresh();
        silentRefreshTimer.current = setInterval(silentRefreshIdToken, ID_TOKEN_REFRESH_INTERVAL_MS);
    }, [silentRefreshIdToken, stopSilentRefresh]);

    // ── WebView alive check (clears timeout on PONG — fixes leak) ───────────

    const checkWebViewAlive = useCallback(() => {
        return new Promise((resolve) => {
            if (aliveCheckResolver.current) { resolve(false); return; }
            aliveCheckResolver.current = resolve;
            aliveCheckTimeout.current = setTimeout(() => {
                if (aliveCheckResolver.current) {
                    aliveCheckResolver.current(false);
                    aliveCheckResolver.current = null;
                }
            }, 2000);
            webViewRef.current?.injectJavaScript(`window.postMessage('PING'); true;`);
        });
    }, []);

    // ── WebView recreation (re-prepares injection script — fixes stale tokens) ──

    const recreateWebView = useCallback(async () => {
        webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
        initialLoadComplete.current = false;
        setContentLoaded(false);
        setProgress(0);
        await prepareInjectionScript();
        setWebViewKey(Date.now());
    }, [prepareInjectionScript]);

    const showToastMessage = useCallback(() => {
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

    // ── Effects ──────────────────────────────────────────────────────────────

    useEffect(() => { prepareInjectionScript(); }, [prepareInjectionScript]);

    useEffect(() => {
        startSilentRefresh();
        return stopSilentRefresh;
    }, [startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        const unsub = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable && pendingOfflineRefresh.current) {
                silentRefreshIdToken();
            }
        });
        return () => unsub();
    }, [silentRefreshIdToken]);

    useEffect(() => {
        const handleAppState = async (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                backgroundTimestamp.current = Date.now();
                stopSilentRefresh();
                webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const dur = Date.now() - backgroundTimestamp.current;
                if (dur > 300000) {
                    // >5 min: IdToken expired, WebView may be dead
                    const alive = await checkWebViewAlive();
                    if (!alive) {
                        recreateWebView();
                    } else {
                        try {
                            await RefreshToken();
                            await injectAuth();
                            await silentRefreshIdToken();
                        } catch (e) {
                            console.error(`${TAG} [${ts()}] Token refresh after background failed:`, e.message);
                            recreateWebView();
                        }
                    }
                } else if (dur > 240000) {
                    // 4–5 min: IdToken may have just expired
                    await silentRefreshIdToken();
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, injectAuth, silentRefreshIdToken, startSilentRefresh, stopSilentRefresh]);

    // Firebase analytics disabled — noisy logs, no debug value
    // useEffect(() => {
    //     if (name) {
    //         analytics().logEvent('screen_view', { screen_name: name, screen_class: 'ArticalWindowUtility' }).catch(() => {});
    //     }
    // }, [name]);

    // Guard: only check auth on initial mount, not on every Redux update.
    // During active WebView session, transient Redux updates (e.g. RefreshToken race)
    // could temporarily set token to undefined and wrongly boot the user.
    const authChecked = useRef(false);
    useEffect(() => {
        if (authChecked.current) return; // Skip re-checks after initial mount
        if (!user?.token) {
            console.warn(`${TAG} [${ts()}] Auth check FAILED — no token in Redux, redirecting to Splash`);
            authChecked.current = true;
            Alert.alert('Authentication Required', 'Please log in to continue.', [
                { text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') },
            ]);
        } else {
            authChecked.current = true; // Token exists on mount, don't re-check
        }
    }, [user]);

    // ── WebView handlers ────────────────────────────────────────────────────

    const onShouldStartLoadWithRequest = useCallback((request) => {
        console.log(`${TAG} [${ts()}] onShouldStartLoadWithRequest → ${request.url}`);

        // Only treat explicit logout as session expiry
        if (request.url.includes('/postlogout')) {
            console.log(`${TAG} [${ts()}] Detected /postlogout — exiting WebView`);
            showToastMessage();
            navigation.goBack();
            return false;
        }

        // SSO redirect (e.g. after 401 on payment API) — DON'T let it load the login page.
        // Instead: block it, refresh tokens, re-inject auth, and reload the billing page.
        if (request.url.includes(Env.SSO_LOGIN)) {
            console.log(`${TAG} [${ts()}] Detected SSO redirect — BLOCKING, refreshing tokens, reloading billing`);
            (async () => {
                try {
                    const freshIdToken = await RefreshIdTokenOnly();
                    if (freshIdToken) {
                        await refreshIdTokenOnAllDomains(freshIdToken);
                    }
                    await injectAuth();
                    console.log(`${TAG} [${ts()}] SSO recovery — navigating back to: ${url}`);
                    webViewRef.current?.injectJavaScript(`window.location.href = '${url}'; true;`);
                } catch (e) {
                    console.error(`${TAG} [${ts()}] SSO recovery failed — recreating WebView:`, e.message);
                    recreateWebView();
                }
            })();
            return false;
        }

        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) {
            return false;
        }
        return true;
    }, [showToastMessage, navigation, url, injectAuth, recreateWebView]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        setIsError(false);
        setErrorMessage('');
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
    }, []);

    // BUG FIX: single getUser() call (was called twice in original)
    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        await injectAuth();
        setTimeout(() => {
            setContentLoaded(true);
            initialLoadComplete.current = true;
        }, 300);
    }, [injectAuth]);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} [${ts()}] WebView error:`, nativeEvent.description);
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} [${ts()}] HTTP error:`, nativeEvent.statusCode, nativeEvent.url);
        if (nativeEvent.statusCode === 404) {
            setIsError(true); setContentLoaded(true);
            setErrorMessage('Page not found. Please verify your account has access to this feature.');
        } else if (nativeEvent.statusCode === 403) {
            setIsError(true); setContentLoaded(true);
            setErrorMessage('Access denied. Please check your permissions.');
        } else if (nativeEvent.statusCode >= 500) {
            setIsError(true); setContentLoaded(true);
            setErrorMessage('Server error. Please try again later.');
        }
    }, []);

    const onMessage = useCallback(({ nativeEvent }) => {
        try {
            const data = JSON.parse(nativeEvent.data);
            switch (data.type) {
                case 'pong':
                    if (aliveCheckTimeout.current) {
                        clearTimeout(aliveCheckTimeout.current);
                        aliveCheckTimeout.current = null;
                    }
                    if (aliveCheckResolver.current) {
                        aliveCheckResolver.current(true);
                        aliveCheckResolver.current = null;
                    }
                    break;
                case 'pdf':
                    setShowPDFUrl(data.data);
                    setShowPDFModal(true);
                    break;
                case 'networkLog': {
                    const { phase, ts: nTs, method, url: nUrl, status, payload, body, error } = data;
                    // Skip noisy analytics calls
                    if (nUrl && (nUrl.includes('analytics.google.com') || nUrl.includes('google-analytics.com'))) break;
                    if (phase === 'request') {
                        const cookieInfo = data.cookies ? ` | 🍪 ${data.cookies}` : '';
                        console.log(`${TAG} [${nTs}] 🌐 ${method} → ${nUrl}${payload ? ' | payload: ' + payload : ''}${cookieInfo}`);
                    } else if (phase === 'response') {
                        const statusLabel = status >= 400 ? '❌' : '✅';
                        console.log(`${TAG} [${nTs}] ${statusLabel} ${method} ← ${status} ${nUrl}${body ? ' | body: ' + body : ''}`);
                    } else if (phase === 'error') {
                        console.error(`${TAG} [${nTs}] ❌ ${method} FAILED ${nUrl} | ${error}`);
                    }
                    break;
                }
                case 'injectionComplete':
                    console.log(`${TAG} [${ts()}] Injection script completed`);
                    break;
                default:
                    break;
            }
        } catch {
            // Non-JSON message from portal — ignore
        }
    }, []);

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                onPressBack={() => {
                    if (route.params?.isBilling) {
                        navigation.reset({ index: 0, routes: [{ name: 'MyTab' }] });
                    } else if (route.params?.isPayBill) {
                        navigation.reset({ index: 0, routes: [{ name: 'MyServices' }] });
                    } else {
                        navigation.goBack();
                    }
                }}
                title={name}
            />

            <View style={styles.contentContainer}>
                {webViewReady && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ uri: url }}
                        injectedJavaScriptBeforeContentLoaded={injectionScript}
                        onLoadStart={onLoadStart}
                        onLoadProgress={onLoadProgress}
                        onLoadEnd={onLoadEnd}
                        onError={onError}
                        onHttpError={onHttpError}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        cacheEnabled={true}
                        originWhitelist={['https://*']}
                        mixedContentMode="compatibility"
                        allowsInlineMediaPlayback={true}
                        allowsBackForwardNavigationGestures={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        androidLayerType="hardware"
                        nestedScrollEnabled={true}
                        overScrollMode="never"
                        style={styles.webView}
                    />
                )}

                {(isLoading || !webViewReady) && !isError && (
                    <View style={styles.loadingOverlay}>
                        {name === 'Billing Details' ? <LoadingSpinner /> : <LoadingOverlay loading={true} />}
                    </View>
                )}

                {isError && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Unable to Load Page</Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <Text
                            style={styles.retryText}
                            onPress={() => {
                                setIsError(false);
                                setErrorMessage('');
                                setContentLoaded(false);
                                setProgress(0);
                                initialLoadComplete.current = false;
                                webViewRef.current?.reload();
                            }}
                        >
                            Tap to Retry
                        </Text>
                    </View>
                )}

                {showToast && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Text style={styles.toastText}>Session expired</Text>
                    </Animated.View>
                )}
            </View>

            {showPDFModal && (
                <PDFViewModal url={showPDFUrl} onClose={() => setShowPDFModal(false)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: Platform.OS === 'ios' ? 90 : 60,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: { flex: 1 },
    loadingOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#ffffff', zIndex: 1000,
    },
    errorContainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        padding: 20, backgroundColor: '#ffffff',
    },
    errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    errorText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
    retryText: { fontSize: 16, color: '#8D3B90', fontWeight: '600', textDecorationLine: 'underline' },
    toast: {
        position: 'absolute', bottom: 100, left: 20, right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)', paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: 8, alignItems: 'center', zIndex: 2000,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});

export default ArticalWindowUtility;
