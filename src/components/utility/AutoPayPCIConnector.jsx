import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/utils/LocalStorage';
import { Env, ISUAT } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/RestApiClient';
import analytics from '@react-native-firebase/analytics';
import { getPaymentUrl, getReferralUrl } from './PaymentUrlUtils';
import LoadingOverlay from '../common/customui/CustomLoading';
import MaintenanceAlert from './MaintenanceAlert';
import { RefreshToken } from '../user/Session';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains } from './NativeCookieManager';

const TAG = '[PCI]';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000; // IdToken expires in 5min, refresh at 4min
const JS_COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';

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
        try { ${buildCookieJS(idToken)} } catch(e) {}

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
    const lastIdTokenRefresh = useRef(0);

    const isLoading = !contentLoaded || progress < 1;

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

    const showToastMessage = useCallback(() => {
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

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
            console.error(TAG, 'injectIdTokenOnly failed:', e.message);
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
            console.error(TAG, 'Silent IdToken refresh failed:', e.message);
            pendingOfflineRefresh.current = true;
        }
    }, [injectIdTokenOnly]);

    const stopSilentRefresh = useCallback(() => {
        if (silentRefreshTimer.current) { clearInterval(silentRefreshTimer.current); silentRefreshTimer.current = null; }
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
                if (aliveCheckResolver.current) { aliveCheckResolver.current(false); aliveCheckResolver.current = null; }
            }, 2000);
            webViewRef.current?.injectJavaScript(`window.postMessage('PING'); true;`);
        });
    }, []);

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

    const initializePayment = async () => {
        if (isInitializing.current) return;
        isInitializing.current = true;

        try {
            const userLocal = await getUser();
            if (!userLocal?.userInfo?.accountNumber) { navigation.navigate('Billing'); return; }

            // Pass stored JWT + jwtTimestamp (tokenIssuedAt) to portal — no refresh needed here.
            // Portal uses tokenIssuedAt to know the real JWT age and schedules its own refresh.
            lastIdTokenRefresh.current = userLocal?.idTokenTimestamp || Date.now();

            setInjectionScript(buildInjectionScript(userLocal?.token || '', userLocal?.userInfo || {}, userLocal?.idToken || '', userLocal?.jwtTimestamp));
            await setAuthCookiesOnAllDomains(userLocal?.idToken || '');

            const accountNumber = userLocal.userInfo.accountNumber;
            const res = await Promise.race([
                new Promise((resolve) => {
                    GetApiRequest(
                        `api/Accounts/${accountNumber}/easypay`,
                        (r) => resolve(r),
                        (err) => { if (err?.includes('503')) setIsServiceDown(true); resolve(null); }
                    );
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('EasyPay API timeout')), 15000)),
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

    const recreateWebView = useCallback(async () => {
        setHtml('');
        setContentLoaded(false);
        setProgress(0);
        setIsError(false);
        setErrorMessage('');
        initialLoadComplete.current = false;
        isInitializing.current = false;
        setTimeout(() => { setWebViewKey(Date.now()); initializePayment(); }, 100);
    }, []);

    useEffect(() => { initializePayment(); }, []);

    useEffect(() => { startSilentRefresh(); return stopSilentRefresh; }, [startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (user && contentLoaded) {
            // JWT already set via injectedJavaScriptBeforeContentLoaded — just ensure IdToken cookie is current
            const t = setTimeout(() => injectIdTokenOnly(), 500);
            return () => clearTimeout(t);
        }
    }, [user, contentLoaded, injectIdTokenOnly]);

    useEffect(() => {
        const handleAppState = async (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                backgroundTimestamp.current = Date.now();
                stopSilentRefresh();
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

    useEffect(() => {
        if (name) analytics().logEvent('screen_view', { screen_name: name, screen_class: 'AutoPayPCIConnector' }).catch(() => {});
    }, [name]);

    useEffect(() => {
        const unsub = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable && pendingOfflineRefresh.current) silentRefreshIdToken();
        });
        return () => unsub();
    }, [silentRefreshIdToken]);

    const onShouldStartLoadWithRequest = useCallback((request) => {
        if (request.url.includes('/postlogout') || request.url.includes(Env.SSO_LOGIN)) {
            showToastMessage();
            navigation.goBack();
            return false;
        }
        if (request.url === 'about:blank') return true;
        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) return false;
        return true;
    }, [showToastMessage, navigation]);

    const onLoadStart = useCallback(() => {
        if (!initialLoadComplete.current) { setContentLoaded(false); setProgress(0); }
        setIsError(false); setErrorMessage('');
    }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1); setContentLoaded(true); initialLoadComplete.current = true;
        // JWT already set via injectedJavaScriptBeforeContentLoaded — just ensure IdToken cookie
        await injectIdTokenOnly();
    }, [injectIdTokenOnly]);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(TAG, 'WebView error:', nativeEvent?.description);
        setIsError(true); setContentLoaded(true);
        setErrorMessage(`Unable to load page: ${nativeEvent?.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(TAG, 'HTTP error:', nativeEvent?.statusCode, nativeEvent?.url);
        if (nativeEvent?.statusCode === 503) setIsServiceDown(true);
        else if (nativeEvent?.statusCode === 404) { setIsError(true); setErrorMessage('Page not found.'); }
        else if (nativeEvent?.statusCode === 403) { setIsError(true); setErrorMessage('Access denied.'); }
        else if (nativeEvent?.statusCode >= 500) { setIsError(true); setErrorMessage('Server error. Please try again later.'); }
        setContentLoaded(true);
    }, []);

    const onMessage = useCallback(({ nativeEvent }) => {
        try {
            const data = JSON.parse(nativeEvent.data);
            switch (data.type) {
                case 'pong':
                    if (aliveCheckTimeout.current) { clearTimeout(aliveCheckTimeout.current); aliveCheckTimeout.current = null; }
                    if (aliveCheckResolver.current) { aliveCheckResolver.current(true); aliveCheckResolver.current = null; }
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
                    <View style={styles.loadingOverlay}><LoadingOverlay loading={true} /></View>
                )}
                {isError && !isServiceDown && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Unable to Load Page</Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <Text style={styles.retryText} onPress={() => {
                            setIsError(false); setErrorMessage(''); setContentLoaded(false);
                            setProgress(0); initialLoadComplete.current = false;
                            isInitializing.current = false; initializePayment();
                        }}>Tap to Retry</Text>
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
    container: { flex: 1, backgroundColor: '#fff', marginBottom: Platform.OS === 'ios' ? 90 : 60 },
    contentContainer: { flex: 1, position: 'relative' },
    webView: { flex: 1, backgroundColor: '#ffffff' },
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: 8, alignItems: 'center', zIndex: 2000,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});

export default AutoPayPCIConnector;
