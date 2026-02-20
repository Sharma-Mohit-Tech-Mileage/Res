import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser } from "../../redux/utils/LocalStorage";
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
import analytics from '@react-native-firebase/analytics';
import { getPaymentUrl, getReferralUrl } from './PaymentUrlUtils';
import LoadingOverlay from '../common/customui/CustomLoading';
import MaintenanceAlert from './MaintenanceAlert';
import { RefreshIdTokenOnly } from '../user/Session';

const TAG = '[PCI]';
const ID_TOKEN_REFRESH_INTERVAL_MS = 4 * 60 * 1000; // 4 min — fires 1 min before 5-min IdToken expiry

// ─────────────────────────────────────────────────────────────────────────────
// buildPreloadScript
//
// This script is passed as injectedJavaScriptBeforeContentLoaded on the WebView.
// It runs in the WebView's JS context BEFORE any page JavaScript executes.
//
// Why this matters:
//   The PCI payment portal reads jwt_token from localStorage and IdToken from
//   cookies during its own initialization (DOMContentLoaded / early module init).
//   Our previous approach used injectJavaScript after onLoadEnd — by that point
//   the portal had already bootstrapped unauthenticated on the first visit.
//   This script eliminates that race entirely.
//
// What it does:
//   1. Pre-seeds jwt_token + user_info in localStorage
//   2. Pre-seeds Source, CustomerType, IdToken cookies
//   3. Installs XHR + Fetch network monitors (for RN-side logging)
//   4. Installs PING/PONG handler (for WebView alive checks)
// ─────────────────────────────────────────────────────────────────────────────
const buildPreloadScript = ({ idToken, token, userInfo }) => {
    const safeToken = (token || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeUserInfo = (typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}))
        .replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeIdToken = (idToken || '').replace(/'/g, "\\'");

    return `
(function() {
    try {
        var hasJwt = '${safeToken}' !== '';
        var hasIdToken = '${safeIdToken}' !== '';

        // 1. Pre-seed localStorage
        if (hasJwt) {
            try {
                localStorage.setItem('jwt_token', '${safeToken}');
                localStorage.setItem('user_info', '${safeUserInfo}');
                console.log('[PCI PreLoad] localStorage pre-seeded | jwt_token: present');
            } catch(lsErr) {
                console.error('[PCI PreLoad] localStorage error:', lsErr.message);
            }
        } else {
            console.warn('[PCI PreLoad] jwt_token empty — localStorage NOT seeded (portal may load unauthenticated)');
        }

        // 2. Pre-seed cookies
        // Note: on about:blank this is a no-op (silently skipped by browser).
        // On the real payment domain it sets cookies before page JS runs.
        try {
            var longExpiry = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
            var shortExpiry = new Date(Date.now() + 5*60*1000).toUTCString();
            document.cookie = 'Source=MobileApp; path=/; expires=' + longExpiry + ';';
            document.cookie = 'CustomerType=Residential; path=/; expires=' + longExpiry + ';';
            if (hasIdToken) {
                document.cookie = 'IdToken=${safeIdToken}; path=/; expires=' + shortExpiry + ';';
                console.log('[PCI PreLoad] Cookies pre-seeded | Source + CustomerType + IdToken');
            } else {
                console.warn('[PCI PreLoad] IdToken empty — IdToken cookie NOT seeded');
                console.log('[PCI PreLoad] Cookies pre-seeded | Source + CustomerType only');
            }
        } catch(cookieErr) {
            // Expected failure on about:blank — not an error condition
            console.log('[PCI PreLoad] Cookie pre-seed skipped (blank context): ' + cookieErr.message);
        }

        // 3. XHR network monitor
        var _xhrOpen = XMLHttpRequest.prototype.open;
        var _xhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._pciMethod = method;
            this._pciUrl = url;
            this._pciStart = Date.now();
            return _xhrOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            var self = this;
            this.addEventListener('load', function() {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'network', method: self._pciMethod, url: self._pciUrl,
                    status: self.status, duration: Date.now() - self._pciStart
                }));
            });
            this.addEventListener('error', function() {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'network_error', method: self._pciMethod, url: self._pciUrl,
                    duration: Date.now() - self._pciStart
                }));
            });
            return _xhrSend.apply(this, arguments);
        };

        // 4. Fetch network monitor
        if (window.fetch) {
            var _fetch = window.fetch;
            window.fetch = function(input, init) {
                var url = typeof input === 'string' ? input : (input && input.url) || 'unknown';
                var method = (init && init.method) || 'GET';
                var start = Date.now();
                return _fetch.apply(this, arguments)
                    .then(function(res) {
                        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'network', method: method, url: url,
                            status: res.status, duration: Date.now() - start
                        }));
                        return res;
                    })
                    .catch(function(err) {
                        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'network_error', method: method, url: url,
                            error: err.message, duration: Date.now() - start
                        }));
                        throw err;
                    });
            };
        }

        // 5. PING/PONG — used by checkWebViewAlive()
        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: 'pong' })
                );
            }
        });

        // Report back to RN that pre-load is done
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'preload_ready', hasJwt: hasJwt, hasIdToken: hasIdToken
        }));
        console.log('[PCI PreLoad] Complete | hasJwt: ' + hasJwt + ' | hasIdToken: ' + hasIdToken);

    } catch(e) {
        console.error('[PCI PreLoad] Fatal error:', e.message);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'preload_error', error: e.message
        }));
    }
    true; // injectedJavaScriptBeforeContentLoaded requires a truthy return
})();`.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// buildPostLoadScript
//
// Called from setDynamicCookie after every onLoadEnd.
// Reinforces auth data on each portal page navigation.
// At onLoadEnd the domain is always real, so cookies work reliably here.
// ─────────────────────────────────────────────────────────────────────────────
const buildPostLoadScript = ({ idToken, token, userInfo }) => {
    const safeToken = (token || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeUserInfo = (typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}))
        .replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeIdToken = (idToken || '').replace(/'/g, "\\'");

    return `
(function() {
    try {
        var hostname = document.location.hostname;
        if (!hostname || hostname === 'localhost') {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'cookies_skipped', reason: 'blank page — no hostname'
            }));
            return;
        }

        var longExpiry = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
        var shortExpiry = new Date(Date.now() + 5*60*1000).toUTCString();
        document.cookie = 'Source=MobileApp; path=/; expires=' + longExpiry + ';';
        document.cookie = 'CustomerType=Residential; path=/; expires=' + longExpiry + ';';
        var idTokenVal = '${safeIdToken}';
        if (idTokenVal) {
            document.cookie = 'IdToken=' + idTokenVal + '; path=/; expires=' + shortExpiry + ';';
        }

        var hasJwt = '${safeToken}' !== '';
        if (hasJwt) {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
        }

        console.log('[PCI PostLoad] Injection done | domain: ' + hostname +
            ' | hasIdToken: ' + !!idTokenVal + ' | hasJwt: ' + hasJwt);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'cookies_set', domain: hostname, hasIdToken: !!idTokenVal, hasJwt: hasJwt
        }));
    } catch(e) {
        console.error('[PCI PostLoad] Error:', e.message);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'cookies_error', error: e.message
        }));
    }
})();`.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const AutoPayPCIConnector = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [isServiceDown, setIsServiceDown] = useState(false);
    const [html, setHtml] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);

    const [paymentDetails] = useState(route.params?.paymentDetails || {});
    const [status] = useState(route.params?.status || false);
    const [name] = useState(route.params?.name);
    const customReferUrl = route.params?.customReferUrl || route.params?.customPaymentUrl || null;

    const user = useSelector(state => state.user.userData);

    // ── Refs ─────────────────────────────────────────────────────────────────
    // Refs don't trigger re-renders — used for mutable state that needs to
    // survive across renders without causing them.
    const webViewRef = useRef(null);
    const aliveCheckResolver = useRef(null);
    const backgroundTimestamp = useRef(0);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const initialLoadComplete = useRef(false);
    const silentRefreshTimer = useRef(null);
    const isInitializing = useRef(false);       // guard against duplicate initializePayment calls
    const preloadScriptRef = useRef('');        // holds the injectedJavaScriptBeforeContentLoaded script
    const currentUrl = useRef('about:blank');   // tracks active WebView URL for log context

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
        console.log(`${TAG} Showing "session expired" toast`);
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

    // ── Post-load cookie injection (reinforcement pass) ───────────────────────

    const setDynamicCookie = useCallback(async (reason = 'unknown') => {
        if (!webViewRef.current) {
            console.warn(`${TAG} setDynamicCookie skipped — no WebView ref | reason: ${reason}`);
            return;
        }
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            const token = cu?.token || '';
            const userInfo = cu?.userInfo || {};
            console.log(`${TAG} setDynamicCookie | reason: ${reason} | hasIdToken: ${!!idToken} | hasJwt: ${!!token} | url: ${currentUrl.current}`);
            const script = buildPostLoadScript({ idToken, token, userInfo });
            webViewRef.current.injectJavaScript(script);
        } catch (e) {
            console.error(`${TAG} setDynamicCookie failed | reason: ${reason} |`, e.message);
        }
    }, []);

    // ── Silent IdToken refresh ────────────────────────────────────────────────

    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) {
            console.warn(`${TAG} silentRefreshIdToken skipped — no WebView ref`);
            return;
        }
        console.log(`${TAG} ── Silent IdToken refresh START ──`);
        try {
            const freshIdToken = await RefreshIdTokenOnly();
            if (!freshIdToken) {
                console.warn(`${TAG} RefreshIdTokenOnly returned empty — not injecting`);
                return;
            }
            const safe = (freshIdToken || '').replace(/'/g, "\\'");
            webViewRef.current.injectJavaScript(`
(function() {
    try {
        var hostname = document.location.hostname;
        if (!hostname || hostname === 'localhost') {
            console.warn('[PCI SilentRefresh] Skipped — blank page context');
            return;
        }
        var longExpiry = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
        var shortExpiry = new Date(Date.now() + 5*60*1000).toUTCString();
        document.cookie = 'Source=MobileApp; path=/; expires=' + longExpiry + ';';
        document.cookie = 'CustomerType=Residential; path=/; expires=' + longExpiry + ';';
        document.cookie = 'IdToken=${safe}; path=/; expires=' + shortExpiry + ';';
        console.log('[PCI SilentRefresh] IdToken updated on ' + hostname);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'silent_refresh_complete', domain: hostname, timestamp: Date.now()
        }));
    } catch(e) {
        console.error('[PCI SilentRefresh] Error:', e.message);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'silent_refresh_error', error: e.message
        }));
    }
})();`.trim());
            console.log(`${TAG} ── Silent IdToken refresh COMPLETE ──`);
        } catch (e) {
            console.error(`${TAG} ── Silent IdToken refresh FAILED ──`, e.message);
        }
    }, []);

    // ── Refresh timer lifecycle ───────────────────────────────────────────────

    const stopSilentRefresh = useCallback(() => {
        if (silentRefreshTimer.current) {
            clearInterval(silentRefreshTimer.current);
            silentRefreshTimer.current = null;
            console.log(`${TAG} Silent refresh timer cleared`);
        }
    }, []);

    const startSilentRefresh = useCallback(() => {
        // Always clear existing before starting — prevents stacking timers
        // if called multiple times (e.g. foreground resume after background)
        stopSilentRefresh();
        silentRefreshTimer.current = setInterval(silentRefreshIdToken, ID_TOKEN_REFRESH_INTERVAL_MS);
        console.log(`${TAG} Silent refresh timer started | interval: ${ID_TOKEN_REFRESH_INTERVAL_MS / 1000}s`);
    }, [silentRefreshIdToken, stopSilentRefresh]);

    // ── WebView alive check ───────────────────────────────────────────────────

    const checkWebViewAlive = useCallback(() => {
        return new Promise((resolve) => {
            if (aliveCheckResolver.current) {
                // A check is already in flight — don't stack another
                console.warn(`${TAG} checkWebViewAlive — already in flight, resolving false`);
                resolve(false);
                return;
            }
            console.log(`${TAG} checkWebViewAlive — sending PING`);
            aliveCheckResolver.current = resolve;
            setTimeout(() => {
                if (aliveCheckResolver.current) {
                    console.warn(`${TAG} checkWebViewAlive — PONG timeout (2s) — WebView unresponsive`);
                    aliveCheckResolver.current(false);
                    aliveCheckResolver.current = null;
                }
            }, 2000);
            webViewRef.current?.injectJavaScript(`window.postMessage('PING'); true;`);
        });
    }, []);

    // ── WebView recreation ────────────────────────────────────────────────────

    const recreateWebView = useCallback(() => {
        console.log(`${TAG} recreateWebView — forcing full remount`);
        setTimeout(() => {
            preloadScriptRef.current = '';
            setWebViewKey(Date.now());
            setContentLoaded(false);
            setProgress(0);
            initialLoadComplete.current = false;
            console.log(`${TAG} WebView remounted with new key`);
        }, 100);
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
        console.log(`${TAG} redirectToEBillpay | url: ${makePaymentUrl} | account: ${paymentObj.AccountNumber} | EasyPay: ${paymentObj.EasyPayEnabled}`);
        post({ guid: gui, key: ix, PaymentObj: baX, RefererUrl: makePaymentUrl, apiKey: Env.secretKey }, getPaymentUrl('V3'));
    };

    const post = (obj, url) => {
        // Network monitor is now in the preload script — no need to embed it here.
        console.log(`${TAG} post() — building form HTML | target: ${url}`);
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
    // Single entry point called on mount. Guards against duplicate execution.

    const initializePayment = async () => {
        if (isInitializing.current) {
            console.warn(`${TAG} initializePayment already running — skipping duplicate call`);
            return;
        }
        isInitializing.current = true;
        console.log(`${TAG} ── initializePayment START | screen: ${name} | status: ${status} ──`);

        try {
            let userLocal = await getUser();
            if (!userLocal?.userInfo?.accountNumber) {
                console.warn(`${TAG} No account number in storage — navigating to Billing`);
                navigation.navigate('Billing');
                return;
            }

            // ── idToken pre-fetch ─────────────────────────────────────────────
            // If idToken is absent (user stored before we added idToken persistence),
            // fetch it now so buildPreloadScript can seed it into the WebView
            // before any page JS runs.
            if (!userLocal.idToken) {
                console.log(`${TAG} idToken absent from storage — pre-fetching via SSO...`);
                try {
                    await RefreshIdTokenOnly();
                    userLocal = await getUser(); // re-read — RefreshIdTokenOnly persists to storage
                    console.log(`${TAG} idToken pre-fetch done | hasIdToken: ${!!userLocal?.idToken}`);
                } catch (e) {
                    console.warn(`${TAG} idToken pre-fetch failed (non-fatal — continuing without it):`, e.message);
                }
            } else {
                console.log(`${TAG} idToken present in storage — no pre-fetch needed`);
            }

            // ── Build preload script ──────────────────────────────────────────
            // Store in ref so it's available when WebView renders.
            // Must be built BEFORE setHtml() triggers the WebView render.
            preloadScriptRef.current = buildPreloadScript({
                idToken: userLocal?.idToken || '',
                token: userLocal?.token || '',
                userInfo: userLocal?.userInfo || {},
            });
            console.log(`${TAG} Preload script built | hasIdToken: ${!!userLocal?.idToken} | hasJwt: ${!!userLocal?.token}`);

            // ── EasyPay API ───────────────────────────────────────────────────
            const accountNumber = userLocal.userInfo.accountNumber;
            console.log(`${TAG} Fetching EasyPay | account: ${accountNumber}`);
            const start = Date.now();

            const res = await Promise.race([
                new Promise((resolve) => {
                    GetApiRequest(
                        `api/Accounts/${accountNumber}/easypay`,
                        (r) => {
                            console.log(`${TAG} EasyPay success in ${Date.now() - start}ms | isEasyPay: ${r?.isEasyPay} | easyPayId: ${r?.easyPayId || 'N/A'}`);
                            resolve(r);
                        },
                        (err) => {
                            console.error(`${TAG} EasyPay error in ${Date.now() - start}ms:`, err);
                            if (err?.includes('503')) setIsServiceDown(true);
                            resolve(null);
                        }
                    );
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('EasyPay API timeout 15s')), 15000)
                ),
            ]).catch((err) => {
                console.error(`${TAG} EasyPay failed:`, err.message);
                return null;
            });

            // ── Build payment object + redirect ───────────────────────────────
            const type = status ? 'MANAGE' : 'SETUP';
            let referralUrl;
            try {
                referralUrl = getReferralUrl('V3', type, customReferUrl);
            } catch {
                referralUrl = status ? Env.REFERRAL_URL_MANAGE_V3 : Env.REFERRAL_URL_SETUP_V3;
            }

            const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.isEasyPay || false, res?.easyPayId || '');
            console.log(`${TAG} Payment ready | type: ${type} | referralUrl: ${referralUrl} | EasyPay: ${paymentObj.EasyPayEnabled}`);
            redirectToEBillpay(paymentObj, referralUrl);
            console.log(`${TAG} ── initializePayment COMPLETE ──`);

        } catch (e) {
            console.error(`${TAG} ── initializePayment FAILED ──`, e.message);
            navigation.navigate('Billing');
        } finally {
            isInitializing.current = false;
        }
    };

    // ── Effects ───────────────────────────────────────────────────────────────

    useEffect(() => {
        console.log(`${TAG} Component mounted | screen: ${name}`);
        initializePayment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        startSilentRefresh();
        return () => {
            console.log(`${TAG} Component unmounting — stopping timer`);
            stopSilentRefresh();
        };
    }, [startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (user && contentLoaded) {
            console.log(`${TAG} Redux user updated while WebView active — re-injecting in 500ms`);
            const t = setTimeout(() => setDynamicCookie('redux-user-update'), 500);
            return () => clearTimeout(t);
        }
    }, [user, contentLoaded, setDynamicCookie]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            console.log(`${TAG} AppState → ${nextAppState}`);
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                backgroundTimestamp.current = Date.now();
                stopSilentRefresh();
                console.log(`${TAG} Backgrounded at ${new Date(backgroundTimestamp.current).toISOString()} — timer paused`);
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const duration = Date.now() - backgroundTimestamp.current;
                console.log(`${TAG} Foregrounded after ${Math.round(duration / 1000)}s`);

                if (duration > 300000) {
                    // >5 min: IdToken definitely expired, WebView may be dead
                    console.log(`${TAG} >5min background — checking WebView health`);
                    const alive = await checkWebViewAlive();
                    console.log(`${TAG} WebView alive: ${alive}`);
                    if (!alive) {
                        recreateWebView();
                    } else {
                        console.log(`${TAG} WebView alive — re-injecting cookies + refreshing IdToken`);
                        await setDynamicCookie('resume>5min');
                        await silentRefreshIdToken();
                    }
                } else if (duration > 240000) {
                    // 4–5 min: IdToken may have just expired
                    console.log(`${TAG} 4–5min background — proactive IdToken refresh`);
                    await silentRefreshIdToken();
                } else {
                    console.log(`${TAG} <4min background — IdToken still valid, no action needed`);
                }

                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => sub?.remove();
    }, [checkWebViewAlive, recreateWebView, setDynamicCookie, silentRefreshIdToken, startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (name) {
            analytics()
                .logEvent('screen_view', { screen_name: name, screen_class: 'AutoPayPCIConnector' })
                .catch((e) => console.warn(`${TAG} Analytics error:`, e.message));
        }
    }, [name]);

    // ── WebView handlers ──────────────────────────────────────────────────────

    const onShouldStartLoadWithRequest = useCallback((request) => {
        currentUrl.current = request.url;
        console.log(`${TAG} onShouldStartLoadWithRequest → ${request.url}`);
        if (request.url.includes('/postlogout') || request.url.includes(Env.SSO_LOGIN)) {
            console.warn(`${TAG} Session expired — postlogout/SSO redirect detected — going back`);
            showToastMessage();
            navigation.goBack();
            return false;
        }
        return true;
    }, [navigation, showToastMessage]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        console.log(`${TAG} onLoadStart | url: ${nativeEvent.url} | initialLoadComplete: ${initialLoadComplete.current}`);
        if (!initialLoadComplete.current) {
            setContentLoaded(false);
            setProgress(0);
        }
    }, []);

    const onLoadEnd = useCallback(({ nativeEvent }) => {
        const { url } = nativeEvent;
        console.log(`${TAG} onLoadEnd | url: ${url}`);
        setProgress(1);
        setContentLoaded(true);
        initialLoadComplete.current = true;
        // Post-load reinforcement — preload already handled first load auth seeding,
        // but this catches internal portal navigations and keeps localStorage fresh.
        setDynamicCookie(`onLoadEnd:${url}`);
    }, [setDynamicCookie]);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
    }, []);

    const onError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} WebView onError | code: ${nativeEvent?.code} | desc: ${nativeEvent?.description} | url: ${nativeEvent?.url}`);
        setContentLoaded(true); // release loading overlay
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        console.error(`${TAG} WebView HTTP error | status: ${nativeEvent?.statusCode} | url: ${nativeEvent?.url}`);
        if (nativeEvent?.statusCode === 503) {
            console.warn(`${TAG} 503 → showing maintenance screen`);
            setIsServiceDown(true);
        }
        setContentLoaded(true);
    }, []);

    const onMessage = useCallback(({ nativeEvent }) => {
        try {
            const data = JSON.parse(nativeEvent.data);
            switch (data.type) {
                case 'pong':
                    console.log(`${TAG} [Alive] PONG received — WebView responsive`);
                    if (aliveCheckResolver.current) {
                        aliveCheckResolver.current(true);
                        aliveCheckResolver.current = null;
                    }
                    break;
                case 'preload_ready':
                    console.log(`${TAG} [PreLoad] Ready | hasJwt: ${data.hasJwt} | hasIdToken: ${data.hasIdToken}`);
                    break;
                case 'preload_error':
                    console.error(`${TAG} [PreLoad] Error:`, data.error);
                    break;
                case 'network':
                    console.log(`${TAG} [Net] ${data.method} ${data.url} → ${data.status} (${data.duration}ms)`);
                    break;
                case 'network_error':
                    console.error(`${TAG} [Net Error] ${data.method} ${data.url} | ${data.error || 'unknown'} (${data.duration}ms)`);
                    break;
                case 'cookies_set':
                    console.log(`${TAG} [PostLoad] Done | domain: ${data.domain} | hasIdToken: ${data.hasIdToken} | hasJwt: ${data.hasJwt}`);
                    break;
                case 'cookies_skipped':
                    console.log(`${TAG} [PostLoad] Skipped | ${data.reason}`);
                    break;
                case 'cookies_error':
                    console.error(`${TAG} [PostLoad] Error:`, data.error);
                    break;
                case 'silent_refresh_complete':
                    console.log(`${TAG} [SilentRefresh] Done | domain: ${data.domain} | at: ${new Date(data.timestamp).toISOString()}`);
                    break;
                case 'silent_refresh_error':
                    console.error(`${TAG} [SilentRefresh] Error:`, data.error);
                    break;
                default:
                    console.log(`${TAG} [WebView Msg]`, JSON.stringify(data));
            }
        } catch {
            // Non-JSON portal messages — log raw
            console.log(`${TAG} [WebView Raw]`, nativeEvent.data);
        }
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                onPressBack={() => {
                    console.log(`${TAG} Back button pressed`);
                    navigation.goBack();
                }}
                title={isServiceDown ? 'Scheduled Maintenance' : name}
            />
            <View style={styles.contentContainer}>
                {html && !isServiceDown && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ html }}

                        // ── THE KEY FIX ───────────────────────────────────────
                        // Runs BEFORE any page JavaScript executes on every navigation.
                        // Pre-seeds jwt_token in localStorage + IdToken in cookies so the
                        // portal finds auth data ready during its own initialization.
                        // Also installs the XHR/Fetch monitor and PING handler.
                        injectedJavaScriptBeforeContentLoaded={preloadScriptRef.current}

                        onLoadProgress={onLoadProgress}
                        onLoadStart={onLoadStart}
                        onLoadEnd={onLoadEnd}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        onError={onError}
                        onHttpError={onHttpError}

                        sharedCookiesEnabled={true}          // iOS: share WKWebView ↔ NSHTTPCookieStorage
                        thirdPartyCookiesEnabled={true}      // Android: allow portal subdomain cookies
                        domStorageEnabled={true}             // Android: enable localStorage (iOS always on)
                        javaScriptEnabled={true}
                        originWhitelist={['*']}              // allow about:blank during form POST phase
                        mixedContentMode="compatibility"     // Android: allow HTTP assets in HTTPS pages
                        cacheEnabled={false}                 // no cached payment pages ever
                        scalesPageToFit={true}               // Android: fit content to viewport width
                        allowsInlineMediaPlayback={true}     // iOS: no forced fullscreen for media
                        mediaPlaybackRequiresUserAction={false}
                        androidLayerType="hardware"          // Android: GPU layer — prevents WebView flicker
                        nestedScrollEnabled={true}           // Android: scroll inside ScrollView
                        overScrollMode="never"               // Android: no edge glow on overscroll
                        style={styles.webView}
                    />
                )}

                {isServiceDown && <MaintenanceAlert />}

                {isLoading && !isServiceDown && (
                    <View style={styles.loadingOverlay}>
                        <LoadingOverlay loading={true} />
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
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        zIndex: 1000,
    },
    toast: {
        position: 'absolute',
        bottom: 100, left: 20, right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 2000,
    },
    toastText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AutoPayPCIConnector;