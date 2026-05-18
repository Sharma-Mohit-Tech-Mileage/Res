import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../redux/utils/LocalStorage';
import { fetchACPUserAccountDetails } from '../../redux/actions/ProfileActionSuite';
import Config from 'react-native-config';
import { GetApiRequest } from '../../network/RestApiClient';
import { getEndpoint, ENDPOINTS } from '../../network/apis/endpoints/Endpoints';
import analytics from '@react-native-firebase/analytics';
import LoadingOverlay from '../common/customui/LoadingOverlay';
import MaintenanceAlert from './MaintenanceAlert';
import { RefreshToken } from '../user/Session';
import { logError, logWarn } from '../../utils/logger';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains, dumpCookies } from './NativeCookieManager';
import { Border } from '../../../GlobalStyles';

const TAG = '[PCI]';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;
const JS_COOKIE_DOMAIN = Config.COOKIE_DOMAIN;

const safeForJS = (val) => JSON.stringify(String(val || '')).slice(1, -1);

const tokenPreview = (t) => {
    if (!t) return '(none)';
    const s = String(t);
    if (s.length <= 16) return s.substring(0, 4) + '…';
    return s.substring(0, 8) + '…' + s.substring(s.length - 4);
};

const logStorageSnapshot = async (caller) => {
    try {
        const cu = await getUser();
        const jwtAge = cu?.jwtTimestamp ? Date.now() - cu.jwtTimestamp : '?';
        const idTokenAge = cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : '?';
    } catch (e) {
        logWarn(`${TAG} STORAGE [${caller}] read failed:`, e.message);
    }
};

const WEBVIEW_STORAGE_DUMP_JS = `(function() {
    try {
        var snap = {
            jwt_token: localStorage.getItem('jwt_token') || null,
            user_info: localStorage.getItem('user_info') || null,
            tokenIssuedAt: localStorage.getItem('tokenIssuedAt') || null,
            cookies: document.cookie || '',
            origin: location.origin,
            href: location.href,
            ts: new Date().toISOString()
        };
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'storageSnapshot', data: snap }));
    } catch(e) {}
})(); true;`;

const buildCookieJS = (idToken) => {
    const safe = safeForJS(idToken);
    return `var _long = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
var _short = new Date(Date.now() + 5*60*1000).toUTCString();
var _dom = '; domain=${JS_COOKIE_DOMAIN}';
document.cookie = 'Source=MobileApp; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
document.cookie = 'CustomerType=Residential; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
document.cookie = 'LatestVersion=true; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
if ('${safe}') document.cookie = 'IdToken=${safe}; path=/' + _dom + '; expires=' + _short + '; Secure; SameSite=Lax;';`;
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

        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pong' }));
            }
        });

        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'injectionComplete' }));
        var snap = {
            jwt_token: localStorage.getItem('jwt_token') || null,
            user_info: localStorage.getItem('user_info') || null,
            tokenIssuedAt: localStorage.getItem('tokenIssuedAt') || null,
            cookies: document.cookie || '',
            origin: location.origin,
            href: location.href,
            ts: new Date().toISOString()
        };
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'storageSnapshot_postInjection', data: snap }));
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
    const dispatch = useDispatch();
    const webViewRef = useRef(null);
    const cacheUpdateFiredRef = useRef(false);
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

    // Asks the WebView to post back its current localStorage + cookies for logging
    const dumpWebViewStorage = useCallback((caller) => {
        if (!webViewRef.current) return;
        webViewRef.current.injectJavaScript(
            WEBVIEW_STORAGE_DUMP_JS.replace('storageSnapshot', 'storageSnapshot_' + caller)
        );
    }, []);

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

    // Re-read stored tokens and update injectedJavaScriptBeforeContentLoaded so that
    // any future WebView recreation uses fresh credentials.
    const refreshInjectionScript = useCallback(async () => {
        const cu = await getUser();
        setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp));
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
        var _ae = document.activeElement;
        var _wasInput = _ae && (_ae.tagName === 'INPUT' || _ae.tagName === 'TEXTAREA' || _ae.tagName === 'SELECT');
        if (_wasInput) _ae.blur();
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(idToken)}
        if (_wasInput && _ae) { _ae.focus(); }
    } catch(e) {}
})(); true;`);
        } catch (e) {
            logError(TAG, 'injectIdTokenOnly failed:', e.message);
        }
    }, []);

    // 4-min silent refresh: refreshes SSO tokens via native layer only
    // JWT stays untouched in portal's localStorage so portal's 18-min refresh timer stays aligned
    // Only refreshes native cookies (setAuthCookiesOnAllDomains) — does NOT inject into WebView
    // to avoid overwriting cookies mid-transaction on the payment domain
    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) return;
        const refreshStartTs = Date.now();
        const lastRefreshAge = lastIdTokenRefresh.current ? refreshStartTs - lastIdTokenRefresh.current : '?';
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected || !netState.isInternetReachable) {
                logWarn(`${TAG} silentRefresh SKIP — offline | ts=${new Date().toISOString()}`);
                pendingOfflineRefresh.current = true;
                return;
            }
            await logStorageSnapshot('silentRefresh-before');
            const newToken = await RefreshToken();
            if (!newToken) {
                logWarn(`${TAG} silentRefresh — RefreshToken returned null | ts=${new Date().toISOString()}`);
                pendingOfflineRefresh.current = true;
                return;
            }
            pendingOfflineRefresh.current = false;
            lastIdTokenRefresh.current = Date.now();
            await refreshInjectionScript();
            const cu = await getUser();
            if (cu?.idToken) {
                await setAuthCookiesOnAllDomains(cu.idToken);
            }
            await injectIdTokenOnly();
            await logStorageSnapshot('silentRefresh-after');
            await dumpCookies('PCI-silentRefresh-after');
        } catch (e) {
            logError(`${TAG} silentRefresh FAILED | duration=${Date.now() - refreshStartTs}ms | error=${e.message} | ts=${new Date().toISOString()}`);
            pendingOfflineRefresh.current = true;
        }
    }, [injectIdTokenOnly, refreshInjectionScript]);

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
        const key = CryptoJS.enc.Utf8.parse(Config.ENCRYPT_VAL_PASSWORD);
        const ix = generateIV(guiTrim);
        const iv = CryptoJS.enc.Utf8.parse(ix);
        const baX = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
            keySize: 256, blockSize: 128, iv,
            mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
        }).toString();
        post({ guid: gui, key: ix, PaymentObj: baX, RefererUrl: makePaymentUrl, apiKey: Config.SECRET_KEY }, Config.PAYMENTURL);
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
        if (isInitializing.current) {
            return;
        }
        isInitializing.current = true;
        const initStartTs = Date.now();

        try {
            let userLocal = await getUser();
            if (!userLocal?.userInfo?.accountNumber) {
                logError(`${TAG} initializePayment — no accountNumber, navigating to Billing`);
                navigation.navigate('Billing');
                return;
            }

            const idTokenAge = userLocal?.idTokenTimestamp ? Date.now() - userLocal.idTokenTimestamp : Infinity;

            // Refresh if IdToken is older than 4 minutes (expires at 5min) to avoid injecting stale JWT
            if (idTokenAge > 240000) {
                logWarn(`${TAG} initializePayment | IdToken stale (${idTokenAge}ms old) — refreshing before injection | ts=${new Date().toISOString()}`);
                try {
                    await RefreshToken();
                    userLocal = await getUser();
                } catch (refreshErr) {
                    logError(`${TAG} initializePayment | refresh failed, using existing token | error=${refreshErr.message}`);
                }
            }

            lastIdTokenRefresh.current = userLocal?.idTokenTimestamp || Date.now();
            setInjectionScript(buildInjectionScript(userLocal?.token || '', userLocal?.userInfo || {}, userLocal?.idToken || '', userLocal?.jwtTimestamp));
            await setAuthCookiesOnAllDomains(userLocal?.idToken || '');
            await dumpCookies('PCI-initPayment');

            const accountNumber = userLocal.userInfo.accountNumber;
            const easyPayEndpoint = getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber });
            const res = await Promise.race([
                new Promise((resolve) => {
                    GetApiRequest(
                        easyPayEndpoint,
                        (r) => {
                            resolve(r);
                        },
                        (err) => {
                            logError(`${TAG} EasyPay API FAILED | error=${JSON.stringify(err)} | ts=${new Date().toISOString()}`);
                            if (err?.includes?.('503')) setIsServiceDown(true);
                            resolve(null);
                        }
                    );
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('EasyPay API timeout')), 15000)),
            ]).catch((e) => {
                logError(`${TAG} EasyPay API TIMEOUT or error | error=${e.message} | ts=${new Date().toISOString()}`);
                return null;
            });

            const type = status ? 'MANAGE' : 'SETUP';
            const referralUrl = customReferUrl || (status ? Config.URL_EASYPAY_MANAGE : Config.URL_EASYPAY_SETUP);

            const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.isEasyPay || false, res?.easyPayId || '');
            redirectToEBillpay(paymentObj, referralUrl);
        } catch (e) {
            logError(`${TAG} initializePayment FAILED | duration=${Date.now() - initStartTs}ms | error=${e.message} | ts=${new Date().toISOString()}`);
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
        setTimeout(() => {
            setWebViewKey(Date.now()); initializePayment();
        }, 100);
    }, []);

    useEffect(() => { initializePayment(); }, []);

    useEffect(() => { startSilentRefresh(); return stopSilentRefresh; }, [startSilentRefresh, stopSilentRefresh]);

    // Skip redundant injection — IdToken cookie is already set by injectedJavaScriptBeforeContentLoaded
    // and native cookies are set during initializePayment. Re-injecting on user/contentLoaded change
    // causes unnecessary overwrites mid-transaction on the payment domain.

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
                await logStorageSnapshot('PCI-appState-resume');
                await dumpCookies('PCI-appState-resume');

                if (dur > 600000) {
                    if (!isOnline) { logWarn(`${TAG} AppState | offline, deferring refresh`); pendingOfflineRefresh.current = true; }
                    else {
                        const alive = await checkWebViewAlive();
                        if (!alive) { recreateWebView(); }
                        else {
                            try {
                                await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await refreshInjectionScript(); await injectIdTokenOnly();
                            }
                            catch (_) { logWarn(`${TAG} AppState | refresh failed, recreating WebView`); recreateWebView(); }
                        }
                    }
                } else if (idTokenAge > 240000) {
                    if (!isOnline) { pendingOfflineRefresh.current = true; }
                    else {
                        try { await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await refreshInjectionScript(); await injectIdTokenOnly(); }
                        catch (_) { pendingOfflineRefresh.current = true; }
                    }
                } else if (dur > 60000) {
                    await injectIdTokenOnly();
                } else {
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, injectIdTokenOnly, refreshInjectionScript, startSilentRefresh, stopSilentRefresh]);

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
        if (request.url.includes('/postlogout') || request.url.includes(Config.SSO_LOGIN)) {
            const reason = request.url.includes('/postlogout') ? 'postlogout' : 'SSO redirect';
            logWarn(`${TAG} NAV | ${reason} detected — session expired, going back | ts=${new Date().toISOString()}`);
            showToastMessage();
            navigation.goBack();
            return false;
        }
        // Allow payment confirmation / thank-you pages through — refresh cookies in background
        if (request.url.includes('/portals/app-secure/payment-confirmation') || request.url.includes('/portals/thankyou/')) {
            (async () => {
                try {
                    const cu = await getUser();
                    if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken);
                } catch (_) {}
            })();
            // Backend cache is stale after payment / AutoPay change — force-refresh once.
            if (!cacheUpdateFiredRef.current) {
                cacheUpdateFiredRef.current = true;
                dispatch(fetchACPUserAccountDetails({ force: true }));
            }
            return true;
        }
        // Block navigation to customer portal — PCI is payment-only, take user back to mobile
        if (request.url.includes('customer.sparklight.com') || request.url.includes('customer.uat.sparklight.com')) {
            logWarn(`${TAG} NAV | portal redirect detected — returning to mobile | url=${request.url} | ts=${new Date().toISOString()}`);
            navigation.goBack();
            return false;
        }
        if (request.url === 'about:blank') return true;
        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) return false;
        return true;
    }, [showToastMessage, navigation, dispatch]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        if (!initialLoadComplete.current) { setContentLoaded(false); setProgress(0); }
        setIsError(false); setErrorMessage('');
    }, []);

    const isAllowedCustomerUrl = useCallback((url) => {
        if (!url) return false;
        return url.includes('/portals/app-secure/payment-confirmation') || url.includes('/portals/thankyou/');
    }, []);

    const onLoadEnd = useCallback(async ({ nativeEvent }) => {
        const url = nativeEvent?.url || '';
        // If user navigated to a non-allowed page on the customer portal, go back to mobile
        if ((url.includes('customer.sparklight.com') || url.includes('customer.uat.sparklight.com')) && !isAllowedCustomerUrl(url)) {
            logWarn(`${TAG} NAV onLoadEnd | unauthorized portal page — returning to mobile | url=${url} | ts=${new Date().toISOString()}`);
            navigation.goBack();
            return;
        }
        setProgress(1);
        // Delay showing content for customer domain pages to let CSS render
        if (isAllowedCustomerUrl(url)) {
            setTimeout(() => { setContentLoaded(true); initialLoadComplete.current = true; }, 500);
        } else {
            setContentLoaded(true); initialLoadComplete.current = true;
        }
        await logStorageSnapshot('PCI-onLoadEnd');
        await dumpCookies('PCI-onLoadEnd');
        dumpWebViewStorage('PCI-onLoadEnd');
    }, [dumpWebViewStorage, navigation, isAllowedCustomerUrl]);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} WebView ERROR | description=${nativeEvent?.description} | ts=${new Date().toISOString()}`);
        setIsError(true); setContentLoaded(true);
        setErrorMessage(`Unable to load page: ${nativeEvent?.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} HTTP ERROR | status=${nativeEvent?.statusCode} | url=${nativeEvent?.url} | ts=${new Date().toISOString()}`);
        // Dump storage + cookies on HTTP errors for diagnostics
        (async () => {
            await logStorageSnapshot('PCI-httpError-' + nativeEvent?.statusCode);
            await dumpCookies('PCI-httpError-' + nativeEvent?.statusCode);
        })();
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
                    if (data.type && data.type.startsWith('storageSnapshot') && data.data) {
                        const s = data.data;
                        const caller = data.type.replace('storageSnapshot_', '');
                        const cookiePairs = (s.cookies || '').split(';').map(c => c.trim()).filter(Boolean);
                        const cookieObj = {};
                        cookiePairs.forEach(pair => {
                            const idx = pair.indexOf('=');
                            if (idx > 0) cookieObj[pair.substring(0, idx)] = pair.substring(idx + 1);
                        });
                    } else {
                    }
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
        borderRadius: Border.br_5xs, alignItems: 'center', zIndex: 2000,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});

export default AutoPayPCIConnector;
