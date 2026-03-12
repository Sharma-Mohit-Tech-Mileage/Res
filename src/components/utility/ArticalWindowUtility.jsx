import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated, Alert } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RefreshToken } from '../user/Session';
import { Env, ISUAT } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import LoadingOverlay from '../common/customui/CustomLoading';
import LoadingSpinner from './LoadingSpinner';
import { getUser } from '../../redux/utils/LocalStorage';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains } from './NativeCookieManager';

const TAG = '[ArticalWindow]';
const JS_COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000; // IdToken expires in 5min, refresh at 4min

// JSON.stringify produces a valid JS string literal (with quotes), slice off the quotes
const safeForJS = (val) => JSON.stringify(String(val || '')).slice(1, -1);

const buildCookieJS = (idToken) => {
    const safe = safeForJS(idToken);
    return `var _long = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
var _short = new Date(Date.now() + 5*60*1000).toUTCString();
var _dom = '; domain=${JS_COOKIE_DOMAIN}';
document.cookie = 'Source=MobileApp; path=/' + _dom + '; expires=' + _long + ';';
document.cookie = 'CustomerType=Residential; path=/' + _dom + '; expires=' + _long + ';';
document.cookie = 'LatestVersion=true; path=/' + _dom + '; expires=' + _long + ';';
if ('${safe}') document.cookie = 'IdToken=${safe}; path=/' + _dom + '; expires=' + _short + ';';`;
};

const buildInjectionScript = (token, userInfo, idToken, jwtTimestamp) => {
    const safeToken = safeForJS(token);
    const safeUserInfo = safeForJS(typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}));

    return `(function() {
    try {
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
            localStorage.setItem('tokenIssuedAt', '${jwtTimestamp || Date.now()}');
        }

        try {
            var _expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'IdToken=; path=/; expires=' + _expire + ';';
            document.cookie = 'Source=; path=/; expires=' + _expire + ';';
            document.cookie = 'CustomerType=; path=/; expires=' + _expire + ';';
            document.cookie = 'LatestVersion=; path=/; expires=' + _expire + ';';
        } catch(e) {}
        try { ${buildCookieJS(idToken)} } catch(e) {}

        var _xo = XMLHttpRequest.prototype.open, _xs = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(m, u) {
            this._url = u;
            return _xo.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            var self = this;
            this.addEventListener('load', function() {
                if ((self._url.includes('/statements/') || self._url.includes('Statement')) && self.status === 200) {
                    try {
                        var d = JSON.parse(self.response);
                        if (d.fileBinary) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pdf', data: d.fileBinary }));
                    } catch(e) {}
                }
            });
            return _xs.apply(this, arguments);
        };

        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pong' }));
            } else if (e.data === 'SAVE_STATE' && window.saveFormState) {
                window.saveFormState();
            }
        });

        window.saveFormState = function() {
            var fd = {};
            document.querySelectorAll('input, select, textarea').forEach(function(el, i) {
                if (el.type !== 'password' && el.value) fd['field_' + i] = { value: el.value, id: el.id, name: el.name };
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
        console.error('${TAG} Injection error:', e.message);
    }
})();
true;`;
};

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
    const lastIdTokenRefresh = useRef(0);

    const isLoading = !contentLoaded || progress < 1;

    // Pass stored JWT + jwtTimestamp (tokenIssuedAt) to portal — no refresh needed here.
    // Portal uses tokenIssuedAt to know the real JWT age and schedules its own refresh.
    const prepareInjectionScript = useCallback(async () => {
        try {
            const cu = await getUser();
            lastIdTokenRefresh.current = cu?.idTokenTimestamp || Date.now();
            await setAuthCookiesOnAllDomains(cu?.idToken || '');
            setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp));
            setWebViewReady(true);
        } catch (e) {
            console.error(`${TAG} prepareInjectionScript failed:`, e.message);
            setWebViewReady(true);
        }
    }, []);

    // Full auth injection: pushes both JWT (localStorage) + tokenIssuedAt and IdToken (cookie)
    // Used only for SSO redirect recovery where portal needs a fresh JWT handoff
    const injectAuth = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            if (idToken) await setAuthCookiesOnAllDomains(idToken);

            const safeToken = safeForJS(cu?.token);
            const safeUserInfo = safeForJS(typeof cu?.userInfo === 'string' ? cu.userInfo : JSON.stringify(cu?.userInfo || {}));
            const jwtTs = cu?.jwtTimestamp || Date.now();

            webViewRef.current.injectJavaScript(`(function() {
    try {
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(idToken)}
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
            localStorage.setItem('tokenIssuedAt', '${jwtTs}');
        }
    } catch(e) {}
})(); true;`);
        } catch (e) {
            console.error(`${TAG} injectAuth failed:`, e.message);
        }
    }, []);

    // IdToken-only injection: pushes only the IdToken cookie to WebView
    // Does NOT touch jwt_token/user_info in localStorage — portal manages its own JWT lifecycle
    const injectIdTokenOnly = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            if (idToken) await setAuthCookiesOnAllDomains(idToken);

            webViewRef.current.injectJavaScript(`(function() {
    try {
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(idToken)}
    } catch(e) {}
})(); true;`);
        } catch (e) {
            console.error(`${TAG} injectIdTokenOnly failed:`, e.message);
        }
    }, []);

    // 4-min silent refresh: refreshes SSO tokens, pushes only IdToken cookie
    // JWT stays untouched in portal's localStorage so portal's 18-min refresh timer stays aligned
    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected || !netState.isInternetReachable) {
                pendingOfflineRefresh.current = true;
                return;
            }
            const newToken = await RefreshToken();
            if (!newToken) { pendingOfflineRefresh.current = true; return; }
            pendingOfflineRefresh.current = false;
            lastIdTokenRefresh.current = Date.now();
            await injectIdTokenOnly();
        } catch (e) {
            console.error(`${TAG} Silent IdToken refresh failed:`, e.message);
            pendingOfflineRefresh.current = true;
        }
    }, [injectIdTokenOnly]);

    const stopSilentRefresh = useCallback(() => {
        if (silentRefreshTimer.current) {
            clearInterval(silentRefreshTimer.current);
            silentRefreshTimer.current = null;
        }
    }, []);

    const startSilentRefresh = useCallback(() => {
        stopSilentRefresh();
        silentRefreshTimer.current = setInterval(silentRefreshIdToken, REFRESH_INTERVAL_MS);
    }, [silentRefreshIdToken, stopSilentRefresh]);

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

    useEffect(() => { prepareInjectionScript(); }, [prepareInjectionScript]);

    useEffect(() => {
        startSilentRefresh();
        return stopSilentRefresh;
    }, [startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        const unsub = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable && pendingOfflineRefresh.current) silentRefreshIdToken();
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
                const idTokenAge = Date.now() - lastIdTokenRefresh.current;
                const netState = await NetInfo.fetch();
                const isOnline = netState.isConnected && netState.isInternetReachable;

                if (dur > 600000) {
                    // >10 min background: WebView may be dead — recreate gets fresh JWT + IdToken
                    if (!isOnline) { pendingOfflineRefresh.current = true; }
                    else {
                        const alive = await checkWebViewAlive();
                        if (!alive) { recreateWebView(); }
                        else {
                            // WebView alive but tokens very stale — refresh IdToken only
                            try { await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await injectIdTokenOnly(); }
                            catch (_) { recreateWebView(); }
                        }
                    }
                } else if (idTokenAge > 240000) {
                    // IdToken >4 min old (expires at 5min) — refresh IdToken cookie only, don't touch JWT
                    if (!isOnline) { pendingOfflineRefresh.current = true; }
                    else {
                        try { await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await injectIdTokenOnly(); }
                        catch (_) { pendingOfflineRefresh.current = true; }
                    }
                } else if (dur > 60000) {
                    // >1 min background but IdToken still fresh: just re-inject current IdToken cookie
                    await injectIdTokenOnly();
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, injectIdTokenOnly, startSilentRefresh, stopSilentRefresh]);

    const authChecked = useRef(false);
    useEffect(() => {
        if (authChecked.current) return;
        authChecked.current = true;
        if (!user?.token) {
            Alert.alert('Authentication Required', 'Please log in to continue.', [
                { text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') },
            ]);
        }
    }, [user]);

    const onShouldStartLoadWithRequest = useCallback((request) => {

        if (request.url.includes('/postlogout')) {
            showToastMessage();
            navigation.goBack();
            return false;
        }

        if (request.url.includes(Env.SSO_LOGIN)) {
            // SSO redirect = session expired on portal side — full refresh with JWT handoff
            (async () => {
                try {
                    await RefreshToken();
                    lastIdTokenRefresh.current = Date.now();
                    await injectAuth();
                    webViewRef.current?.injectJavaScript(`window.location.href = '${url}'; true;`);
                } catch (_) {
                    recreateWebView();
                }
            })();
            return false;
        }

        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) return false;
        return true;
    }, [showToastMessage, navigation, url, injectAuth, recreateWebView]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        setIsError(false);
        setErrorMessage('');
        // When navigating to payment domain, ensure current cookies are set
        // PCI portal relies on IdToken cookie — don't refresh, just re-inject stored values
        if (nativeEvent?.url && (nativeEvent.url.includes('payment.sparklight.com') || nativeEvent.url.includes('payment.uat.sparklight.com'))) {
            (async () => {
                try {
                    const cu = await getUser();
                    if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken);
                } catch (_) {}
            })();
        }
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        // JWT already set via injectedJavaScriptBeforeContentLoaded — just ensure IdToken cookie is current
        await injectIdTokenOnly();
        setTimeout(() => { setContentLoaded(true); initialLoadComplete.current = true; }, 300);
    }, [injectIdTokenOnly]);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} WebView error:`, nativeEvent.description);
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} HTTP error: ${nativeEvent.statusCode} ${nativeEvent.url}`);
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
                    if (aliveCheckTimeout.current) { clearTimeout(aliveCheckTimeout.current); aliveCheckTimeout.current = null; }
                    if (aliveCheckResolver.current) { aliveCheckResolver.current(true); aliveCheckResolver.current = null; }
                    break;
                case 'pdf':
                    setShowPDFUrl(data.data);
                    setShowPDFModal(true);
                    break;
                case 'injectionComplete':
                    break;
                default:
                    break;
            }
        } catch {
        }
    }, []);

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
                        <Text style={styles.retryText} onPress={() => {
                            setIsError(false); setErrorMessage(''); setContentLoaded(false);
                            setProgress(0); initialLoadComplete.current = false;
                            webViewRef.current?.reload();
                        }}>Tap to Retry</Text>
                    </View>
                )}
                {showToast && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Text style={styles.toastText}>Session expired</Text>
                    </Animated.View>
                )}
            </View>
            {showPDFModal && <PDFViewModal url={showPDFUrl} onClose={() => setShowPDFModal(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: Platform.OS === 'ios' ? 90 : 60 },
    contentContainer: { flex: 1, position: 'relative' },
    webView: { flex: 1 },
    loadingOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', zIndex: 1000,
    },
    errorContainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#ffffff',
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
