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
import { setAuthCookiesOnAllDomains, dumpCookies, clearAuthCookies } from './NativeCookieManager';

const TAG = '[ArticalWindow]';
const JS_COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000; 
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
        console.log(`${TAG} STORAGE [${caller}] | ts=${new Date().toISOString()} | jwt=${tokenPreview(cu?.token)} | jwtAge=${jwtAge}ms | jwtIssuedAt=${cu?.jwtTimestamp ? new Date(cu.jwtTimestamp).toISOString() : '?'} | idToken=${tokenPreview(cu?.idToken)} | idTokenAge=${idTokenAge}ms | idTokenIssuedAt=${cu?.idTokenTimestamp ? new Date(cu.idTokenTimestamp).toISOString() : '?'} | account=${cu?.userInfo?.accountNumber || '?'}`);
    } catch (e) {
        console.warn(`${TAG} STORAGE [${caller}] read failed:`, e.message);
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
        // Post back localStorage + cookies immediately after injection for comparison with portal
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
    const currentUrlRef = useRef('');
    const ssoRedirectInFlight = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    const refreshInjectionScript = useCallback(async () => {
        const cu = await getUser();
        setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp));
    }, []);


    const prepareInjectionScript = useCallback(async () => {
        try {
            console.log(`${TAG} prepareInjectionScript START | ts=${new Date().toISOString()} | targetUrl=${url}`);
            let cu = await getUser();
            const idTokenAge = cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : Infinity;
            console.log(`${TAG} prepareInjectionScript | jwt=${tokenPreview(cu?.token)} | jwtTimestamp=${cu?.jwtTimestamp ? new Date(cu.jwtTimestamp).toISOString() : '?'} | idToken=${tokenPreview(cu?.idToken)} | idTokenAge=${idTokenAge}ms | idTokenTimestamp=${cu?.idTokenTimestamp ? new Date(cu.idTokenTimestamp).toISOString() : '?'}`);
            if (idTokenAge > 240000) {
                console.warn(`${TAG} prepareInjectionScript | IdToken stale (${idTokenAge}ms old) — refreshing before injection | ts=${new Date().toISOString()}`);
                try {
                    await RefreshToken();
                    cu = await getUser();
                    console.log(`${TAG} prepareInjectionScript | post-refresh idToken=${tokenPreview(cu?.idToken)} | idTokenAge=${cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : '?'}ms`);
                } catch (refreshErr) {
                    console.error(`${TAG} prepareInjectionScript | refresh failed, using existing token | error=${refreshErr.message}`);
                }
            }

            lastIdTokenRefresh.current = cu?.idTokenTimestamp || Date.now();
            await setAuthCookiesOnAllDomains(cu?.idToken || '');
            setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp));
            setWebViewReady(true);
            console.log(`${TAG} prepareInjectionScript DONE | WebView ready | ts=${new Date().toISOString()}`);
            await dumpCookies('prepareInjection');
        } catch (e) {
            console.error(`${TAG} prepareInjectionScript FAILED | error=${e.message} | ts=${new Date().toISOString()}`);
            setWebViewReady(true);
        }
    }, []);

    const injectAuth = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            console.log(`${TAG} injectAuth START (full JWT+IdToken) | ts=${new Date().toISOString()} | currentUrl=${currentUrlRef.current}`);
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            const jwtTs = cu?.jwtTimestamp || Date.now();
            console.log(`${TAG} injectAuth | jwt=${tokenPreview(cu?.token)} | idToken=${tokenPreview(idToken)} | jwtTimestamp=${new Date(jwtTs).toISOString()} | setting localStorage: jwt_token, user_info, tokenIssuedAt | setting cookies: IdToken, Source, CustomerType, LatestVersion`);
            if (idToken) await setAuthCookiesOnAllDomains(idToken);

            const safeToken = safeForJS(cu?.token);
            const safeUserInfo = safeForJS(typeof cu?.userInfo === 'string' ? cu.userInfo : JSON.stringify(cu?.userInfo || {}));

            webViewRef.current.injectJavaScript(`(function() {
    try {
        var _ae = document.activeElement;
        var _wasInput = _ae && (_ae.tagName === 'INPUT' || _ae.tagName === 'TEXTAREA' || _ae.tagName === 'SELECT');
        if (_wasInput) _ae.blur();
        var h = document.location.hostname;
        if (!h || h === 'localhost') return;
        ${buildCookieJS(idToken)}
        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
            localStorage.setItem('tokenIssuedAt', '${jwtTs}');
        }
        if (_wasInput && _ae) { _ae.focus(); }
    } catch(e) {}
})(); true;`);
            console.log(`${TAG} injectAuth DONE | ts=${new Date().toISOString()}`);
            await dumpCookies('injectAuth');
            dumpWebViewStorage('injectAuth');
        } catch (e) {
            console.error(`${TAG} injectAuth FAILED | error=${e.message} | ts=${new Date().toISOString()}`);
        }
    }, []);


    const injectIdTokenOnly = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            const idTokenAge = cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : '?';
            console.log(`${TAG} injectIdTokenOnly | ts=${new Date().toISOString()} | idToken=${tokenPreview(idToken)} | idTokenAge=${idTokenAge}ms | currentUrl=${currentUrlRef.current}`);
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
            dumpWebViewStorage('injectIdTokenOnly');
        } catch (e) {
            console.error(`${TAG} injectIdTokenOnly FAILED | error=${e.message} | ts=${new Date().toISOString()}`);
        }
    }, [dumpWebViewStorage]);

    const dumpWebViewStorage = useCallback((caller) => {
        if (!webViewRef.current) return;
        webViewRef.current.injectJavaScript(
            WEBVIEW_STORAGE_DUMP_JS.replace('storageSnapshot', 'storageSnapshot_' + caller)
        );
    }, []);

    const isOnPaymentDomain = useCallback(() => {
        const cur = currentUrlRef.current || '';
        return cur.includes('payment.sparklight.com') || cur.includes('payment.uat.sparklight.com');
    }, []);


    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) return;
        const refreshStartTs = Date.now();
        const lastRefreshAge = lastIdTokenRefresh.current ? refreshStartTs - lastIdTokenRefresh.current : '?';
        console.log(`${TAG} silentRefresh START | ts=${new Date(refreshStartTs).toISOString()} | lastRefreshAge=${lastRefreshAge}ms | currentUrl=${currentUrlRef.current} | onPaymentDomain=${isOnPaymentDomain()}`);
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected || !netState.isInternetReachable) {
                console.warn(`${TAG} silentRefresh SKIP — offline | ts=${new Date().toISOString()}`);
                pendingOfflineRefresh.current = true;
                return;
            }
            await logStorageSnapshot('silentRefresh-before');
            const newToken = await RefreshToken();
            if (!newToken) {
                console.warn(`${TAG} silentRefresh — RefreshToken returned null | ts=${new Date().toISOString()}`);
                pendingOfflineRefresh.current = true;
                return;
            }
            pendingOfflineRefresh.current = false;
            lastIdTokenRefresh.current = Date.now();
            await refreshInjectionScript();
            const cu = await getUser();
            if (cu?.idToken) {
                console.log(`${TAG} silentRefresh — setting native cookies | idToken=${tokenPreview(cu.idToken)} | ts=${new Date().toISOString()}`);
                await setAuthCookiesOnAllDomains(cu.idToken);
            }
            console.log(`${TAG} silentRefresh — injecting IdToken cookie to WebView | onPaymentDomain=${isOnPaymentDomain()} | ts=${new Date().toISOString()}`);
            await injectIdTokenOnly();
            await logStorageSnapshot('silentRefresh-after');
            await dumpCookies('silentRefresh-after');
            console.log(`${TAG} silentRefresh DONE | duration=${Date.now() - refreshStartTs}ms`);
        } catch (e) {
            console.error(`${TAG} silentRefresh FAILED | duration=${Date.now() - refreshStartTs}ms | error=${e.message} | ts=${new Date().toISOString()}`);
            pendingOfflineRefresh.current = true;
        }
    }, [injectIdTokenOnly, isOnPaymentDomain, refreshInjectionScript]);

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
        console.log(`${TAG} recreateWebView START | ts=${new Date().toISOString()} | currentUrl=${currentUrlRef.current}`);
        webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
        initialLoadComplete.current = false;
        setContentLoaded(false);
        setProgress(0);
        await prepareInjectionScript();
        setWebViewKey(Date.now());
        console.log(`${TAG} recreateWebView DONE | newKey=${Date.now()} | ts=${new Date().toISOString()}`);
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
        return () => {
            webViewRef.current?.injectJavaScript(`
                try { localStorage.removeItem('formState'); localStorage.removeItem('scrollPosition'); } catch(e) {}
                true;
            `);
        };
    }, []);

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
                console.log(`${TAG} AppState → ${nextAppState} | ts=${new Date().toISOString()} | stoppingSilentRefresh`);
                stopSilentRefresh();
                webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const dur = Date.now() - backgroundTimestamp.current;
                const idTokenAge = Date.now() - lastIdTokenRefresh.current;
                const netState = await NetInfo.fetch();
                const isOnline = netState.isConnected && netState.isInternetReachable;
                console.log(`${TAG} AppState → active | bgDuration=${dur}ms | idTokenAge=${idTokenAge}ms | isOnline=${isOnline} | currentUrl=${currentUrlRef.current} | ts=${new Date().toISOString()}`);
                await logStorageSnapshot('appState-resume');
                await dumpCookies('appState-resume');

                if (dur > 600000) {
                    console.log(`${TAG} AppState | >10min bg — checking WebView alive`);
                    if (!isOnline) { console.warn(`${TAG} AppState | offline, deferring refresh`); pendingOfflineRefresh.current = true; }
                    else {
                        const alive = await checkWebViewAlive();
                        console.log(`${TAG} AppState | WebView alive=${alive}`);
                        if (!alive) { console.log(`${TAG} AppState | recreating WebView`); recreateWebView(); }
                        else {
                            try {
                                console.log(`${TAG} AppState | WebView alive, refreshing IdToken only`);
                                await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await refreshInjectionScript(); await injectIdTokenOnly();
                            }
                            catch (_) { console.warn(`${TAG} AppState | refresh failed, recreating WebView`); recreateWebView(); }
                        }
                    }
                } else if (idTokenAge > 240000) {
                    console.log(`${TAG} AppState | idToken >4min old, refreshing`);
                    if (!isOnline) { pendingOfflineRefresh.current = true; }
                    else {
                        try { await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await refreshInjectionScript(); await injectIdTokenOnly(); }
                        catch (_) { pendingOfflineRefresh.current = true; }
                    }
                } else if (dur > 60000) {
                    console.log(`${TAG} AppState | >1min bg, re-injecting current IdToken`);
                    await injectIdTokenOnly();
                } else {
                    console.log(`${TAG} AppState | short bg (${dur}ms), no action needed`);
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, injectIdTokenOnly, refreshInjectionScript, startSilentRefresh, stopSilentRefresh]);

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
        console.log(`${TAG} NAV onShouldStartLoad | url=${request.url} | ts=${new Date().toISOString()}`);

        if (request.url.includes('/postlogout')) {
            console.log(`${TAG} NAV | postlogout detected — returning to mobile | ts=${new Date().toISOString()}`);
            stopSilentRefresh();
            clearAuthCookies();
            navigation.goBack();
            return false;
        }

        if (request.url.includes(Env.SSO_LOGIN)) {
            console.warn(`${TAG} NAV | SSO redirect detected — session expired on portal | ssoInFlight=${ssoRedirectInFlight.current}`);

            if (!ssoRedirectInFlight.current) {
                ssoRedirectInFlight.current = true;
                (async () => {
                    try {
                        console.log(`${TAG} NAV SSO | refreshing token + full auth injection | ts=${new Date().toISOString()}`);
                        await RefreshToken();
                        lastIdTokenRefresh.current = Date.now();
                        await refreshInjectionScript();
                        await injectAuth();
                        console.log(`${TAG} NAV SSO | redirecting WebView back to ${url}`);
                        webViewRef.current?.injectJavaScript(`window.location.href = '${url}'; true;`);
                    } catch (e) {
                        console.error(`${TAG} NAV SSO | refresh failed, recreating WebView | error=${e.message}`);
                        recreateWebView();
                    } finally {
                        ssoRedirectInFlight.current = false;
                    }
                })();
            }
            return false;
        }

        if (!request.url.startsWith('https://') && !request.url.startsWith('http://')) return false;
        return true;
    }, [showToastMessage, navigation, url, injectAuth, recreateWebView, refreshInjectionScript]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        const prevUrl = currentUrlRef.current;
        if (nativeEvent?.url) currentUrlRef.current = nativeEvent.url;
        const domainChanged = prevUrl && nativeEvent?.url && new URL(prevUrl).hostname !== new URL(nativeEvent.url).hostname;
        console.log(`${TAG} NAV onLoadStart | url=${nativeEvent?.url} | prevUrl=${prevUrl || '(initial)'} | domainChanged=${!!domainChanged} | ts=${new Date().toISOString()}`);
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        setIsError(false);
        setErrorMessage('');
        if (nativeEvent?.url && (nativeEvent.url.includes('payment.sparklight.com') || nativeEvent.url.includes('payment.uat.sparklight.com'))) {
            console.log(`${TAG} NAV onLoadStart | PAYMENT DOMAIN detected — setting native cookies only`);
            (async () => {
                try {
                    const cu = await getUser();
                    console.log(`${TAG} NAV onLoadStart | payment domain cookie set | idToken=${tokenPreview(cu?.idToken)} | idTokenAge=${cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : '?'}ms`);
                    if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken);
                    await dumpCookies('onLoadStart-payment');
                } catch (_) {}
            })();
        }
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        const onPayment = isOnPaymentDomain();
        console.log(`${TAG} NAV onLoadEnd | url=${currentUrlRef.current} | onPaymentDomain=${onPayment} | ts=${new Date().toISOString()}`);

        if (!onPayment) {
            console.log(`${TAG} NAV onLoadEnd | injecting IdToken cookie (not payment domain)`);
            await injectIdTokenOnly();
        } else {
            console.log(`${TAG} NAV onLoadEnd | SKIP IdToken injection (payment domain — avoid overwrite)`);
        }
        await logStorageSnapshot('onLoadEnd');
        await dumpCookies('onLoadEnd');
        dumpWebViewStorage('onLoadEnd');
        setTimeout(() => { setContentLoaded(true); initialLoadComplete.current = true; }, 300);
    }, [injectIdTokenOnly, isOnPaymentDomain, dumpWebViewStorage]);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} WebView ERROR | description=${nativeEvent.description} | url=${currentUrlRef.current} | ts=${new Date().toISOString()}`);
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} HTTP ERROR | status=${nativeEvent.statusCode} | url=${nativeEvent.url} | currentUrl=${currentUrlRef.current} | ts=${new Date().toISOString()}`);
        (async () => {
            await logStorageSnapshot('httpError-' + nativeEvent.statusCode);
            await dumpCookies('httpError-' + nativeEvent.statusCode);
        })();
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
                    console.log(`${TAG} MSG pong | WebView alive | ts=${new Date().toISOString()}`);
                    if (aliveCheckTimeout.current) { clearTimeout(aliveCheckTimeout.current); aliveCheckTimeout.current = null; }
                    if (aliveCheckResolver.current) { aliveCheckResolver.current(true); aliveCheckResolver.current = null; }
                    break;
                case 'pdf':
                    console.log(`${TAG} MSG pdf | received PDF binary | ts=${new Date().toISOString()}`);
                    setShowPDFUrl(data.data);
                    setShowPDFModal(true);
                    break;
                case 'injectionComplete':
                    console.log(`${TAG} MSG injectionComplete | script injected OK | url=${currentUrlRef.current} | ts=${new Date().toISOString()}`);
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
                        console.log(`${TAG} WEBVIEW_STORAGE [${caller}] | origin=${s.origin} | href=${s.href} | ts=${s.ts}`);
                        console.log(`${TAG} WEBVIEW_STORAGE [${caller}] | jwt_token=${tokenPreview(s.jwt_token)} | tokenIssuedAt=${s.tokenIssuedAt} | user_info=${s.user_info ? s.user_info.substring(0, 100) + (s.user_info.length > 100 ? '…' : '') : '(none)'}`);
                        console.log(`${TAG} WEBVIEW_STORAGE [${caller}] | cookies=${JSON.stringify(cookieObj)}`);
                    } else {
                        console.log(`${TAG} MSG unknown | type=${data.type} | ts=${new Date().toISOString()}`);
                    }
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
