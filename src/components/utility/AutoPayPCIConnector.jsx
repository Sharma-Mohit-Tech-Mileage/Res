import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/utils/LocalStorage';
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
import analytics from '@react-native-firebase/analytics';
import { getPaymentUrl, getReferralUrl } from './PaymentUrlUtils';
import LoadingOverlay from '../common/customui/CustomLoading';
import MaintenanceAlert from './MaintenanceAlert';
import { RefreshToken, RefreshIdTokenOnly } from '../user/Session';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains, refreshIdTokenOnAllDomains } from './NativeCookieManager';

const TAG = '[PCI]';
const ID_TOKEN_REFRESH_INTERVAL_MS = 4 * 60 * 1000;

// ── Shared cookie JS (reusable in injection script + standalone injections) ──
const buildCookieJS = (idToken) => {
    const safe = (idToken || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `var _long = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
var _short = new Date(Date.now() + 5*60*1000).toUTCString();
document.cookie = 'Source=MobileApp; path=/; expires=' + _long + ';';
document.cookie = 'CustomerType=Residential; path=/; expires=' + _long + ';';
document.cookie = 'LatestVersion=true; path=/; expires=' + _long + ';';
if ('${safe}') document.cookie = 'IdToken=${safe}; path=/; expires=' + _short + ';';`;
};

// ── Injection script (injectedJavaScriptBeforeContentLoaded) ──
// Seeds localStorage + cookies before page JS runs. PING/PONG for alive check.
// Network activity logging (XHR + Fetch) for debugging — no form state (PCI-DSS: no saving card inputs).
const buildInjectionScript = (token, userInfo, idToken) => {
    const safeToken = (token || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeUserInfo = (typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}))
        .replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    return `(function() {
    try {
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
        }
        try { ${buildCookieJS(idToken)} } catch(e) {}

        // ── Network activity logging (XHR) ──
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
            try { if (body) payload = typeof body === 'string' ? body : JSON.stringify(body); } catch(e) {}
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
                try { respSnippet = self.responseText || ''; } catch(e) {}
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'networkLog', phase: 'response', ts: rTs,
                    method: self._method, url: self._url, status: self.status, body: respSnippet
                }));
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
            try { if (init && init.body) fPayload = String(init.body); } catch(e) {}
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

        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pong' }));
            }
        });

        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'injectionComplete' }));
    } catch(e) {
        console.error('${TAG} Injection error:', e.message);
    }
})();
true;`;
};

// ── Component ───────────────────────────────────────────────────────────────

const AutoPayPCIConnector = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [isServiceDown, setIsServiceDown] = useState(false);
    const [html, setHtml] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [injectionScript, setInjectionScript] = useState('');

    const [paymentDetails] = useState(route.params?.paymentDetails || {});
    const [status] = useState(route.params?.status || false);
    const [name] = useState(route.params?.name);
    const customReferUrl = route.params?.customReferUrl || route.params?.customPaymentUrl || null;

    const user = useSelector(state => state.user.userData);

    const webViewRef = useRef(null);
    const aliveCheckResolver = useRef(null);
    const aliveCheckTimeout = useRef(null);
    const backgroundTimestamp = useRef(0);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const initialLoadComplete = useRef(false);
    const silentRefreshTimer = useRef(null);
    const isInitializing = useRef(false);
    const pendingOfflineRefresh = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    // ── Utilities ────────────────────────────────────────────────────────────

    const generateGuid = () => {
        const p8 = (s) => {
            const p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        };
        return p8(0) + p8(true) + p8(true) + p8(0);
    };

    const generateIV = (guiHex) => {
        let bytes = '';
        for (let c = 0; c <= guiHex.length - 1; c += 2) bytes += guiHex.substr(c, 1);
        return bytes;
    };

    const getPaymentObj = (token, userInfo, isEasyPay, easyPayId) => ({
        AccountNumber: userInfo.accountNumber || '',
        FirstName: userInfo.firstName || '',
        LastName: userInfo.lastName || '',
        TotalDue: paymentDetails.billAmount,
        PastDue: paymentDetails.pastPaymentDue || 0,
        DueDate: paymentDetails.dueDate,
        CustomerType: 'Residential',
        PastDueAmount: '',
        PaymentDueDate: '',
        Email: paymentDetails.email || '',
        EasyPayId: easyPayId || '',
        EasyPayEnabled: isEasyPay || false,
        TokenCookie: token || '',
    });

    // ── Toast ────────────────────────────────────────────────────────────────

    const showToastMessage = useCallback(() => {
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

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
            console.error(TAG, 'injectAuth failed:', e.message);
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
            console.error(TAG, 'Silent refresh failed:', e.message);
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

    // ── Encryption + form POST ────────────────────────────────────────────────

    const redirectToEBillpay = (paymentObj, makePaymentUrl) => {
        const data = JSON.stringify(paymentObj);
        const gui = generateGuid();
        const guiTrim = gui.split('-').join('');
        const key = CryptoJS.enc.Utf8.parse(Env.encryptvalPassword);
        const ix = generateIV(guiTrim);
        const iv = CryptoJS.enc.Utf8.parse(ix);
        const baX = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
            keySize: 256, blockSize: 128, iv,
            mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
        }).toString();
        post({ guid: gui, key: ix, PaymentObj: baX, RefererUrl: makePaymentUrl, apiKey: Env.secretKey }, getPaymentUrl('V3'));
    };

    const post = (obj, url) => {
        setHtml(`
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <style>html,body{margin:0;padding:0;width:100%;height:100%;}</style>
</head>
<body>
    <form id="pf" action="${url}" method="POST">
        ${Object.keys(obj).map(k => `<input type="hidden" name="${k}" value="${obj[k]}" />`).join('')}
    </form>
    <script>document.getElementById('pf').submit();</script>
</body>
</html>`);
    };

    // ── initializePayment ─────────────────────────────────────────────────────

    const initializePayment = async () => {
        if (isInitializing.current) return;
        isInitializing.current = true;

        try {
            let userLocal = await getUser();
            if (!userLocal?.userInfo?.accountNumber) {
                navigation.navigate('Billing');
                return;
            }

            if (!userLocal.idToken) {
                try {
                    await RefreshIdTokenOnly();
                    userLocal = await getUser();
                } catch (e) {
                    console.error(TAG, 'idToken pre-fetch failed (non-fatal):', e.message);
                }
            }

            // Build injection script (state) BEFORE setHtml triggers WebView render
            setInjectionScript(buildInjectionScript(
                userLocal?.token || '',
                userLocal?.userInfo || {},
                userLocal?.idToken || '',
            ));

            await setAuthCookiesOnAllDomains(userLocal?.idToken || '');

            // EasyPay API
            const accountNumber = userLocal.userInfo.accountNumber;
            const res = await Promise.race([
                new Promise((resolve) => {
                    GetApiRequest(
                        `api/Accounts/${accountNumber}/easypay`,
                        (r) => resolve(r),
                        (err) => {
                            if (err?.includes('503')) setIsServiceDown(true);
                            resolve(null);
                        }
                    );
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('EasyPay API timeout 15s')), 15000)
                ),
            ]).catch(() => null);

            const type = status ? 'MANAGE' : 'SETUP';
            let referralUrl;
            try {
                referralUrl = getReferralUrl('V3', type, customReferUrl);
            } catch {
                referralUrl = status ? Env.REFERRAL_URL_MANAGE_V3 : Env.REFERRAL_URL_SETUP_V3;
            }

            const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.isEasyPay || false, res?.easyPayId || '');
            redirectToEBillpay(paymentObj, referralUrl);
        } catch (e) {
            console.error(TAG, 'initializePayment failed:', e.message);
            navigation.navigate('Billing');
        } finally {
            isInitializing.current = false;
        }
    };

    // ── WebView recreation (clears HTML first, rebuilds injection script) ────

    const recreateWebView = useCallback(async () => {
        setHtml('');
        setContentLoaded(false);
        setProgress(0);
        setIsError(false);
        setErrorMessage('');
        initialLoadComplete.current = false;
        isInitializing.current = false;
        // Short delay to unmount WebView (html=''), then re-initialize with fresh tokens
        setTimeout(() => {
            setWebViewKey(Date.now());
            initializePayment();
        }, 100);
    }, []);

    // ── Effects ──────────────────────────────────────────────────────────────

    useEffect(() => { initializePayment(); }, []);

    useEffect(() => {
        startSilentRefresh();
        return stopSilentRefresh;
    }, [startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (user && contentLoaded) {
            const t = setTimeout(() => injectAuth(), 500);
            return () => clearTimeout(t);
        }
    }, [user, contentLoaded, injectAuth]);

    useEffect(() => {
        const handleAppState = async (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                backgroundTimestamp.current = Date.now();
                stopSilentRefresh();
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const dur = Date.now() - backgroundTimestamp.current;
                if (dur > 300000) {
                    const alive = await checkWebViewAlive();
                    if (!alive) {
                        recreateWebView();
                    } else {
                        try {
                            await RefreshToken();
                            await injectAuth();
                            await silentRefreshIdToken();
                        } catch (e) {
                            console.error(TAG, 'Token refresh after background failed:', e.message);
                            recreateWebView();
                        }
                    }
                } else if (dur > 240000) {
                    await silentRefreshIdToken();
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, injectAuth, silentRefreshIdToken, startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (name) {
            analytics().logEvent('screen_view', {
                screen_name: name,
                screen_class: 'AutoPayPCIConnector',
            }).catch(() => {});
        }
    }, [name]);

    useEffect(() => {
        const unsub = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable && pendingOfflineRefresh.current) {
                silentRefreshIdToken();
            }
        });
        return () => unsub();
    }, [silentRefreshIdToken]);

    // ── WebView handlers ──────────────────────────────────────────────────────

    const onShouldStartLoadWithRequest = useCallback((request) => {
        if (request.url.includes('/postlogout') || request.url.includes(Env.SSO_LOGIN)) {
            showToastMessage();
            navigation.goBack();
            return false;
        }
        // Allow about:blank (needed during form POST phase) + http(s)
        if (request.url === 'about:blank') return true;
        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) {
            return false;
        }
        return true;
    }, [showToastMessage, navigation]);

    const onLoadStart = useCallback(() => {
        if (!initialLoadComplete.current) {
            setContentLoaded(false);
            setProgress(0);
        }
        setIsError(false);
        setErrorMessage('');
    }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        setContentLoaded(true);
        initialLoadComplete.current = true;
        await injectAuth();
    }, [injectAuth]);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
    }, []);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(TAG, 'WebView error:', nativeEvent?.description);
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Unable to load page: ${nativeEvent?.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(TAG, 'HTTP error:', nativeEvent?.statusCode, nativeEvent?.url);
        if (nativeEvent?.statusCode === 503) {
            setIsServiceDown(true);
        } else if (nativeEvent?.statusCode === 404) {
            setIsError(true);
            setErrorMessage('Page not found. Please verify your account has access to this feature.');
        } else if (nativeEvent?.statusCode === 403) {
            setIsError(true);
            setErrorMessage('Access denied. Please check your permissions.');
        } else if (nativeEvent?.statusCode >= 500) {
            setIsError(true);
            setErrorMessage('Server error. Please try again later.');
        }
        setContentLoaded(true);
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
                case 'networkLog': {
                    const { phase, ts: nTs, method, url: nUrl, status, payload, body, error } = data;
                    if (nUrl && (nUrl.includes('analytics.google.com') || nUrl.includes('google-analytics.com'))) break;
                    if (phase === 'request') {
                        const cookieInfo = data.cookies ? ` | cookies: ${data.cookies}` : '';
                        console.log(`${TAG} [${nTs}] REQUEST ${method} → ${nUrl}${payload ? ' | payload: ' + payload : ''}${cookieInfo}`);
                    } else if (phase === 'response') {
                        const statusLabel = status >= 400 ? 'FAIL' : 'OK';
                        console.log(`${TAG} [${nTs}] RESPONSE [${statusLabel}] ${method} ← ${status} ${nUrl}${body ? ' | body: ' + body : ''}`);
                    } else if (phase === 'error') {
                        console.error(`${TAG} [${nTs}] ERROR ${method} FAILED ${nUrl} | ${error}`);
                    }
                    break;
                }
                case 'injectionComplete':
                    console.log(`${TAG} Injection script completed`);
                    break;
                default:
                    break;
            }
        } catch {
            // Non-JSON portal message — ignore
        }
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                onPressBack={() => navigation.goBack()}
                title={isServiceDown ? 'Scheduled Maintenance' : name}
            />
            <View style={styles.contentContainer}>
                {html && !isServiceDown && !isError && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ html }}
                        injectedJavaScriptBeforeContentLoaded={injectionScript}
                        onLoadProgress={onLoadProgress}
                        onLoadStart={onLoadStart}
                        onLoadEnd={onLoadEnd}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        onError={onError}
                        onHttpError={onHttpError}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        originWhitelist={['*']}
                        mixedContentMode="compatibility"
                        cacheEnabled={false}
                        scalesPageToFit={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        androidLayerType="hardware"
                        nestedScrollEnabled={true}
                        overScrollMode="never"
                        style={styles.webView}
                    />
                )}

                {isServiceDown && <MaintenanceAlert />}

                {isLoading && !isServiceDown && !isError && (
                    <View style={styles.loadingOverlay}>
                        <LoadingOverlay loading={true} />
                    </View>
                )}

                {isError && !isServiceDown && (
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
                                isInitializing.current = false;
                                initializePayment();
                            }}
                        >
                            Tap to Retry
                        </Text>
                    </View>
                )}

                {showToast && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Text style={styles.toastText}>Session expired. Please try again.</Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: Platform.OS === 'ios' ? 90 : 60,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: 8, alignItems: 'center', zIndex: 2000,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});

export default AutoPayPCIConnector;
