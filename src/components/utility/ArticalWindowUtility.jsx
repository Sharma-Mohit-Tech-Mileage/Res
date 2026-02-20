import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated, Alert } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import analytics from '@react-native-firebase/analytics';
import LoadingOverlay from '../common/customui/CustomLoading';
import LoadingSpinner from './LoadingSpinner';
import { getUser, getUpgradeToken } from '../../redux/utils/LocalStorage';

// ─── DEBUG TAG ────────────────────────────────────────────────────────────────
const DBG = '[ArticalWindowUtility]';
const log  = (...a) => console.log(DBG,  ...a);
const warn = (...a) => console.warn(DBG, ...a);
const err  = (...a) => console.error(DBG, ...a);

// ─── COMPREHENSIVE INJECTION SCRIPT ──────────────────────────────────────────
// Injected BEFORE & AFTER page load to capture everything possible.
const buildDebugScript = (token, userInfo, upgradeToken) => `
(function() {
    // ── 1. ENVIRONMENT SNAPSHOT ──────────────────────────────────────────────
    const env = {
        userAgent:       navigator.userAgent,
        origin:          location.origin,
        href:            location.href,
        protocol:        location.protocol,
        cookieEnabled:   navigator.cookieEnabled,
        onLine:          navigator.onLine,
        language:        navigator.language,
        platform:        navigator.platform,
        vendor:          navigator.vendor,
        doNotTrack:      navigator.doNotTrack,
        storageAvailable: (function() {
            try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return true; }
            catch(e) { return false; }
        })(),
        sessionStorageAvailable: (function() {
            try { sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return true; }
            catch(e) { return false; }
        })(),
    };
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'debug_env', data: env }));

    // ── 2. EXISTING STORAGE SNAPSHOT (before we write anything) ─────────────
    const existingStorage = {};
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            existingStorage[k] = localStorage.getItem(k)?.substring(0, 80) + '…';
        }
    } catch(e) { existingStorage._error = e.toString(); }
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'debug_storage_before', data: existingStorage }));

    // ── 3. EXISTING COOKIES SNAPSHOT ────────────────────────────────────────
    window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'debug_cookies_before',
        data: document.cookie || '(empty)'
    }));

    // ── 4. INJECT TOKENS ────────────────────────────────────────────────────
    const token          = ${JSON.stringify(token)};
    const userInfoStr    = ${JSON.stringify(typeof userInfo === 'object' ? JSON.stringify(userInfo) : userInfo)};
    const upgradeTokenVal= ${JSON.stringify(upgradeToken)};

    const tokenResults = {};
    try {
        if (token) {
            localStorage.setItem('jwt_token', token);
            tokenResults.jwt = 'SET (' + token.substring(0,20) + '…)';
        } else {
            tokenResults.jwt = 'MISSING — WebView will likely be unauthenticated';
        }
    } catch(e) { tokenResults.jwt_error = e.toString(); }

    try {
        if (userInfoStr && userInfoStr !== '{}') {
            localStorage.setItem('user_info', userInfoStr);
            tokenResults.userInfo = 'SET';
        } else {
            tokenResults.userInfo = 'EMPTY — user_info not written';
        }
    } catch(e) { tokenResults.userInfo_error = e.toString(); }

    try {
        if (upgradeTokenVal) {
            localStorage.setItem('upgrades_token', upgradeTokenVal);
            tokenResults.upgradeToken = 'SET (' + upgradeTokenVal.substring(0,20) + '…)';
        } else {
            tokenResults.upgradeToken = 'MISSING';
        }
    } catch(e) { tokenResults.upgradeToken_error = e.toString(); }

    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'debug_token_injection', data: tokenResults }));

    // ── 5. SET COOKIES & VERIFY ──────────────────────────────────────────────
    try {
        const domain  = location.hostname;
        const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
        document.cookie = 'Source=MobileApp; domain=' + domain + '; path=/; expires=' + expires + '; SameSite=Lax';
        document.cookie = 'CustomerType=Residential; domain=' + domain + '; path=/; expires=' + expires + '; SameSite=Lax';
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'debug_cookies_after',
            data: {
                cookiesNow: document.cookie,
                domain:     domain,
                note:       document.cookie.includes('Source=MobileApp') ? 'Cookie write SUCCESS' : 'WARNING: Source cookie NOT visible after write (HttpOnly/SameSite issue?)'
            }
        }));
    } catch(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type:'debug_cookies_error', data: e.toString() }));
    }

    // ── 6. INTERCEPT ALL XHR ────────────────────────────────────────────────
    const origXHROpen  = XMLHttpRequest.prototype.open;
    const origXHRSend  = XMLHttpRequest.prototype.send;
    const origXHRSetHdr= XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._dbgMethod  = method;
        this._dbgUrl     = url;
        this._dbgHeaders = {};

        this.addEventListener('loadstart', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'xhr_start',
                data: { method: this._dbgMethod, url: this._dbgUrl }
            }));
        });

        this.addEventListener('load', () => {
            const isAuth = this._dbgUrl.includes('login') || this._dbgUrl.includes('auth') || this._dbgUrl.includes('token') || this._dbgUrl.includes('sso');
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type:   this.status >= 400 ? 'xhr_error' : 'xhr_success',
                data: {
                    method:        this._dbgMethod,
                    url:           this._dbgUrl,
                    status:        this.status,
                    statusText:    this.statusText,
                    responseType:  this.responseType,
                    // Only log first 300 chars of response to avoid huge messages
                    responseSnippet: (this.responseText || '').substring(0, 300),
                    requestHeaders: this._dbgHeaders,
                    hasAuthHeader:  !!this._dbgHeaders['Authorization'],
                    isAuthEndpoint: isAuth,
                }
            }));

            // PDF intercept
            if ((this._dbgUrl.includes('/statements/') || this._dbgUrl.includes('Statement')) && this.status === 200) {
                try {
                    const d = JSON.parse(this.response);
                    if (d.fileBinary) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type:'pdf', data: d.fileBinary }));
                    }
                } catch(e) {}
            }
        });

        this.addEventListener('error', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'xhr_network_error',
                data: { method: this._dbgMethod, url: this._dbgUrl, status: this.status }
            }));
        });

        this.addEventListener('abort', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'xhr_aborted',
                data: { method: this._dbgMethod, url: this._dbgUrl }
            }));
        });

        this.addEventListener('timeout', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'xhr_timeout',
                data: { method: this._dbgMethod, url: this._dbgUrl }
            }));
        });

        return origXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (this._dbgHeaders) {
            // Redact sensitive header values
            this._dbgHeaders[name] = name.toLowerCase().includes('auth') || name.toLowerCase().includes('token')
                ? value.substring(0, 20) + '…'
                : value;
        }
        return origXHRSetHdr.apply(this, arguments);
    };

    // ── 7. INTERCEPT FETCH ──────────────────────────────────────────────────
    if (!window._fetchIntercepted) {
        const origFetch = window.fetch;
        window.fetch = async function(resource, init = {}) {
            const url    = typeof resource === 'string' ? resource : resource?.url;
            const method = (init.method || 'GET').toUpperCase();

            // Redact auth headers for logging
            const safeHeaders = {};
            if (init.headers) {
                const h = new Headers(init.headers);
                h.forEach((v, k) => {
                    safeHeaders[k] = k.toLowerCase().includes('auth') || k.toLowerCase().includes('token')
                        ? v.substring(0,20) + '…'
                        : v;
                });
            }

            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'fetch_start',
                data: { method, url, headers: safeHeaders, hasBody: !!init.body }
            }));

            try {
                const response = await origFetch.apply(this, arguments);
                // Clone so we can read body without consuming it
                const clone = response.clone();
                let bodySnippet = '';
                try {
                    const txt = await clone.text();
                    bodySnippet = txt.substring(0, 300);
                } catch(e) {}

                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type:   response.ok ? 'fetch_success' : 'fetch_error',
                    data: {
                        method,
                        url,
                        status:         response.status,
                        statusText:     response.statusText,
                        ok:             response.ok,
                        redirected:     response.redirected,
                        finalUrl:       response.url,
                        responseSnippet: bodySnippet,
                        requestHeaders: safeHeaders,
                    }
                }));

                return response;
            } catch(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'fetch_network_error',
                    data: { method, url, error: e.toString() }
                }));
                throw e;
            }
        };
        window._fetchIntercepted = true;
    }

    // ── 8. FORWARD console.log / warn / error TO RN ─────────────────────────
    ['log','warn','error','info'].forEach(level => {
        const orig = console[level];
        console[level] = function(...args) {
            orig.apply(console, args);
            try {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'console_' + level,
                    data: args.map(a => {
                        try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                        catch(e) { return '[unserializable]'; }
                    })
                }));
            } catch(e) {}
        };
    });

    // ── 9. UNCAUGHT ERRORS & PROMISE REJECTIONS ──────────────────────────────
    window.addEventListener('error', function(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'js_error',
            data: {
                message:  e.message,
                filename: e.filename,
                lineno:   e.lineno,
                colno:    e.colno,
                stack:    e.error?.stack?.substring(0, 500)
            }
        }));
    });

    window.addEventListener('unhandledrejection', function(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'unhandled_promise_rejection',
            data: {
                reason: e.reason ? (e.reason.toString ? e.reason.toString() : JSON.stringify(e.reason)) : 'unknown'
            }
        }));
    });

    // ── 10. NAVIGATION / REDIRECT TRACKING ──────────────────────────────────
    const origPushState    = history.pushState;
    const origReplaceState = history.replaceState;
    history.pushState = function(...args) {
        origPushState.apply(this, args);
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'nav_pushstate',
            data: { url: location.href, state: args[0] }
        }));
    };
    history.replaceState = function(...args) {
        origReplaceState.apply(this, args);
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'nav_replacestate',
            data: { url: location.href }
        }));
    };
    window.addEventListener('popstate', () => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'nav_popstate',
            data: { url: location.href }
        }));
    });

    // ── 11. PAGE LIFECYCLE EVENTS ────────────────────────────────────────────
    ['DOMContentLoaded','load','beforeunload','unload','visibilitychange'].forEach(evt => {
        window.addEventListener(evt, () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'page_event',
                data: {
                    event:       evt,
                    readyState:  document.readyState,
                    visibility:  document.visibilityState,
                    url:         location.href
                }
            }));
        });
    });

    // ── 12. STORAGE MUTATION TRACKING ────────────────────────────────────────
    const origSetItem    = Storage.prototype.setItem;
    const origRemoveItem = Storage.prototype.removeItem;
    const origClear      = Storage.prototype.clear;

    Storage.prototype.setItem = function(k, v) {
        origSetItem.apply(this, arguments);
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type:  'storage_set',
            data: { key: k, valueSnippet: String(v).substring(0,80) }
        }));
    };
    Storage.prototype.removeItem = function(k) {
        origRemoveItem.apply(this, arguments);
        window.ReactNativeWebView.postMessage(JSON.stringify({ type:'storage_remove', data:{ key: k } }));
    };
    Storage.prototype.clear = function() {
        origClear.apply(this);
        window.ReactNativeWebView.postMessage(JSON.stringify({ type:'storage_clear', data:{} }));
    };

    // ── 13. FORM STATE MANAGEMENT (unchanged from original) ──────────────────
    window.saveFormState = function() {
        const formData = {};
        document.querySelectorAll('input, select, textarea').forEach((el, i) => {
            if (el.type !== 'password' && el.value) {
                formData['field_' + i] = { value: el.value, id: el.id, name: el.name };
            }
        });
        localStorage.setItem('formState', JSON.stringify(formData));
        localStorage.setItem('scrollPosition', window.scrollY);
    };
    window.restoreFormState = function() {
        try {
            const saved = localStorage.getItem('formState');
            if (saved) {
                const formData = JSON.parse(saved);
                document.querySelectorAll('input, select, textarea').forEach((el, i) => {
                    const sf = formData['field_' + i];
                    if (sf && el.type !== 'password') el.value = sf.value;
                });
                const scrollPos = localStorage.getItem('scrollPosition');
                if (scrollPos) window.scrollTo(0, parseInt(scrollPos));
            }
        } catch(e) {}
    };
    window.addEventListener('message', function(e) {
        if (e.data === 'PING')       window.ReactNativeWebView.postMessage(JSON.stringify({type:'pong'}));
        else if (e.data === 'SAVE_STATE') window.saveFormState();
    });
    setInterval(window.saveFormState, 5000);
    if (document.readyState === 'complete') window.restoreFormState();
    else window.addEventListener('load', window.restoreFormState);

    // ── 14. FINAL READY SIGNAL ───────────────────────────────────────────────
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'injectionComplete' }));
    console.log('🔍 Debug injection complete');
})();
true;
`;

const ArticalWindowUtility = ({ navigation, route }) => {
    log('Mounted | name:', route.params?.name, '| url:', route.params?.url);

    const [progress,          setProgress]          = useState(0);
    const [name]                                     = useState(route.params?.name);
    const [isError,           setIsError]            = useState(false);
    const [errorMessage,      setErrorMessage]       = useState('');
    const [url]                                      = useState(route.params?.url);
    const [showPDFModal,      setShowPDFModal]       = useState(false);
    const [showPDFUrl,        setShowPDFUrl]         = useState('');
    const [isTokenRefreshing, setIsTokenRefreshing]  = useState(false);
    const [contentLoaded,     setContentLoaded]      = useState(false);
    const [webViewKey,        setWebViewKey]         = useState(Date.now());
    const [showToast,         setShowToast]          = useState(false);
    const [webViewReady,      setWebViewReady]       = useState(false);
    const [injectionScript,   setInjectionScript]    = useState('');

    const user                  = useSelector(state => state.user.userData);
    const webViewRef            = useRef();
    const aliveCheckResolver    = useRef(null);
    const backgroundTimestamp   = useRef(0);
    const toastOpacity          = useRef(new Animated.Value(0)).current;
    const initialLoadComplete   = useRef(false);
    const sessionInjected       = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    // ── Prepare injection script ────────────────────────────────────────────
    const prepareInjectionScript = useCallback(async () => {
        log('prepareInjectionScript — start');
        try {
            const currentUser    = await getUser();
            const upgradeToken   = await getUpgradeToken();

            log('prepareInjectionScript — currentUser keys:', currentUser ? Object.keys(currentUser) : 'NULL');
            log('prepareInjectionScript — token present?', !!currentUser?.token);
            log('prepareInjectionScript — userInfo present?', !!currentUser?.userInfo);
            log('prepareInjectionScript — upgradeToken present?', !!upgradeToken?.access_token);

            if (!currentUser?.token) {
                warn('prepareInjectionScript — TOKEN IS MISSING. WebView will be unauthenticated!');
            }

            const script = buildDebugScript(
                currentUser?.token       || '',
                currentUser?.userInfo    || {},
                upgradeToken?.access_token || ''
            );

            setInjectionScript(script);
            setWebViewReady(true);
            log('prepareInjectionScript — done, WebView ready');
        } catch (error) {
            err('prepareInjectionScript — FAILED:', error);
            setWebViewReady(true);
        }
    }, []);

    useEffect(() => { prepareInjectionScript(); }, [prepareInjectionScript]);

    // ── Toast ────────────────────────────────────────────────────────────────
    const showToastMessage = useCallback(() => {
        log('showToastMessage — session expired toast');
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1,    duration: 300,  useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0,    duration: 300,  useNativeDriver: true }),
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

    // ── Alive check ──────────────────────────────────────────────────────────
    const checkWebViewAlive = useCallback(() => {
        return new Promise((resolve) => {
            if (aliveCheckResolver.current) { resolve(false); return; }
            aliveCheckResolver.current = resolve;
            const timeout = setTimeout(() => {
                if (aliveCheckResolver.current) {
                    warn('checkWebViewAlive — TIMEOUT, WebView did not respond to PING');
                    aliveCheckResolver.current(false);
                    aliveCheckResolver.current = null;
                }
            }, 2000);
            webViewRef.current?.injectJavaScript(`window.postMessage('PING'); true;`);
        });
    }, []);

    // ── Refresh token in WebView ─────────────────────────────────────────────
    const refreshTokenInWebView = useCallback(async () => {
        log('refreshTokenInWebView — start');
        try {
            const currentUser  = await getUser();
            const upgradeToken = await getUpgradeToken();
            log('refreshTokenInWebView — token:', currentUser?.token?.substring(0,20));
            webViewRef.current?.injectJavaScript(`
                (function() {
                    const domain  = location.hostname;
                    const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
                    document.cookie = 'Source=MobileApp; domain=' + domain + '; path=/; expires=' + expires + '; SameSite=Lax';
                    document.cookie = 'CustomerType=Residential; domain=' + domain + '; path=/; expires=' + expires + '; SameSite=Lax';
                    localStorage.setItem('jwt_token', '${currentUser?.token || ''}');
                    localStorage.setItem('user_info', '${JSON.stringify(currentUser?.userInfo || {})}');
                    localStorage.setItem('upgrades_token', '${upgradeToken?.access_token || ''}');
                    window.dispatchEvent(new Event('tokenRefreshed'));
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'debug_token_refreshed', data: { ok: true } }));
                })();
                true;
            `);
        } catch(e) {
            err('refreshTokenInWebView — FAILED:', e);
        }
    }, []);

    // ── Recreate WebView ─────────────────────────────────────────────────────
    const recreateWebView = useCallback(() => {
        warn('recreateWebView — forcing full WebView recreation');
        webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
        setTimeout(() => {
            sessionInjected.current     = false;
            initialLoadComplete.current = false;
            setWebViewKey(Date.now());
            setContentLoaded(false);
            setProgress(0);
        }, 100);
    }, []);

    // ── onShouldStartLoadWithRequest ─────────────────────────────────────────
    const onShouldStartLoadWithRequest = useCallback((request) => {
        log('onShouldStartLoadWithRequest |', request.navigationType, '|', request.url?.substring(0, 100));

        const isLogout   = request.url.includes('/postlogout');
        const isSSO      = request.url.includes(Env.SSO_LOGIN);
        const isExternal = !request.url.startsWith('https://') && !request.url.startsWith('http://');

        if (isLogout || isSSO) {
            warn('onShouldStartLoadWithRequest — BLOCKING redirect to', isLogout ? '/postlogout' : 'SSO_LOGIN');
            showToastMessage();
            navigation.goBack();
            return false;
        }

        if (isExternal) {
            warn('onShouldStartLoadWithRequest — BLOCKING non-http URL:', request.url);
            return false;
        }

        log('onShouldStartLoadWithRequest — ALLOWING:', request.url?.substring(0, 80));
        return true;
    }, [showToastMessage, navigation]);

    // ── onMessage — the main debug handler ───────────────────────────────────
    const onMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            switch (data.type) {
                // ── Session ──────────────────────────────────────────────────
                case 'injectionComplete':
                    sessionInjected.current = true;
                    log('✅ injectionComplete — session is ready');
                    break;

                case 'injectionError':
                    err('❌ injectionError —', data.error);
                    break;

                // ── Environment / token ──────────────────────────────────────
                case 'debug_env':
                    log('📋 WebView ENV snapshot:\n', JSON.stringify(data.data, null, 2));
                    if (!data.data.storageAvailable)   warn('⚠️  localStorage NOT AVAILABLE in WebView!');
                    if (!data.data.cookieEnabled)      warn('⚠️  Cookies DISABLED in WebView!');
                    if (!data.data.onLine)             warn('⚠️  WebView reports OFFLINE!');
                    break;

                case 'debug_storage_before':
                    log('📦 Storage before injection:', JSON.stringify(data.data, null, 2));
                    break;

                case 'debug_cookies_before':
                    log('🍪 Cookies before injection:', data.data);
                    break;

                case 'debug_cookies_after':
                    log('🍪 Cookies after write:', JSON.stringify(data.data, null, 2));
                    if (data.data.note?.includes('WARNING')) {
                        warn('⚠️  COOKIE WRITE PROBLEM:', data.data.note);
                    }
                    break;

                case 'debug_cookies_error':
                    err('❌ Cookie write failed:', data.data);
                    break;

                case 'debug_token_injection':
                    log('🔑 Token injection results:\n', JSON.stringify(data.data, null, 2));
                    if (data.data.jwt?.includes('MISSING'))       warn('⚠️  JWT TOKEN MISSING — auth will fail!');
                    if (data.data.userInfo?.includes('EMPTY'))    warn('⚠️  user_info EMPTY');
                    if (data.data.upgradeToken?.includes('MISSING')) warn('⚠️  upgradeToken MISSING');
                    break;

                case 'debug_token_refreshed':
                    log('🔄 Token refreshed in WebView:', JSON.stringify(data.data));
                    break;

                case 'debug_storage_set':
                    log('📦 Storage SET:', data.data?.key, '=', data.data?.valueSnippet);
                    break;

                // ── XHR ─────────────────────────────────────────────────────
                case 'xhr_start':
                    log(`🌐 XHR ▶  ${data.data.method} ${data.data.url?.substring(0, 120)}`);
                    break;

                case 'xhr_success':
                    log(`🌐 XHR ✅ ${data.data.status} ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    if (data.data.isAuthEndpoint) {
                        log('   🔐 Auth endpoint — has Auth header?', data.data.hasAuthHeader);
                        log('   📄 Response snippet:', data.data.responseSnippet?.substring(0,200));
                    }
                    break;

                case 'xhr_error':
                    err(`🌐 XHR ❌ ${data.data.status} ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    err('   Headers sent:', JSON.stringify(data.data.requestHeaders));
                    err('   Response:', data.data.responseSnippet?.substring(0,300));
                    break;

                case 'xhr_network_error':
                    err(`🌐 XHR 🔴 NETWORK ERROR ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    break;

                case 'xhr_aborted':
                    warn(`🌐 XHR ⛔ ABORTED ${data.data.method} ${data.data.url?.substring(0,80)}`);
                    break;

                case 'xhr_timeout':
                    warn(`🌐 XHR ⏱ TIMEOUT ${data.data.method} ${data.data.url?.substring(0,80)}`);
                    break;

                // ── Fetch ────────────────────────────────────────────────────
                case 'fetch_start':
                    log(`🌍 FETCH ▶  ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    break;

                case 'fetch_success':
                    log(`🌍 FETCH ✅ ${data.data.status} ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    if (data.data.redirected) log('   ↪ Redirected to:', data.data.finalUrl);
                    break;

                case 'fetch_error':
                    err(`🌍 FETCH ❌ ${data.data.status} ${data.data.method} ${data.data.url?.substring(0,120)}`);
                    err('   Headers:', JSON.stringify(data.data.requestHeaders));
                    err('   Body snippet:', data.data.responseSnippet?.substring(0,300));
                    break;

                case 'fetch_network_error':
                    err(`🌍 FETCH 🔴 NETWORK ERROR ${data.data.method} ${data.data.url?.substring(0,120)}`, data.data.error);
                    break;

                // ── Console forwarding ───────────────────────────────────────
                case 'console_log':
                    log('💬 [WV]', ...(data.data || []));
                    break;
                case 'console_warn':
                    warn('💬 [WV]', ...(data.data || []));
                    break;
                case 'console_error':
                    err('💬 [WV]', ...(data.data || []));
                    break;
                case 'console_info':
                    log('💬 [WV ℹ]', ...(data.data || []));
                    break;

                // ── JS errors ────────────────────────────────────────────────
                case 'js_error':
                    err('🚨 JS ERROR in WebView:', data.data?.message);
                    err('   at', data.data?.filename, 'line', data.data?.lineno);
                    if (data.data?.stack) err('   Stack:', data.data.stack);
                    break;

                case 'unhandled_promise_rejection':
                    err('🚨 UNHANDLED PROMISE REJECTION in WebView:', data.data?.reason);
                    break;

                // ── Navigation ───────────────────────────────────────────────
                case 'nav_pushstate':
                    log('🗺 SPA pushState →', data.data?.url?.substring(0,100));
                    break;
                case 'nav_replacestate':
                    log('🗺 SPA replaceState →', data.data?.url?.substring(0,100));
                    break;
                case 'nav_popstate':
                    log('🗺 SPA popstate →', data.data?.url?.substring(0,100));
                    break;

                // ── Page lifecycle ───────────────────────────────────────────
                case 'page_event':
                    log(`📄 Page [${data.data.event}] readyState=${data.data.readyState} visibility=${data.data.visibility}`);
                    break;

                // ── Storage mutations ────────────────────────────────────────
                case 'storage_set':
                    log(`📦 Storage.setItem("${data.data.key}", "${data.data.valueSnippet}")`);
                    break;
                case 'storage_remove':
                    warn(`📦 Storage.removeItem("${data.data.key}")`);
                    break;
                case 'storage_clear':
                    warn('📦 Storage.clear() called — ALL tokens wiped!');
                    break;

                // ── PDF ──────────────────────────────────────────────────────
                case 'pdf':
                    log('📄 PDF binary received, length:', data.data?.length);
                    setShowPDFUrl(data.data);
                    setShowPDFModal(true);
                    break;

                // ── Alive check ──────────────────────────────────────────────
                case 'pong':
                    log('🏓 PONG received — WebView is alive');
                    if (aliveCheckResolver.current) {
                        aliveCheckResolver.current(true);
                        aliveCheckResolver.current = null;
                    }
                    break;

                default:
                    log('📨 Unknown message type:', data.type, JSON.stringify(data.data)?.substring(0,100));
            }
        } catch (error) {
            // Raw (non-JSON) messages from the page
            log('📨 Raw message (non-JSON):', event.nativeEvent.data?.substring(0,200));
        }
    }, []);

    // ── WebView event handlers ───────────────────────────────────────────────
    const onLoadStart = useCallback(({ nativeEvent }) => {
        log('onLoadStart | url:', nativeEvent.url?.substring(0,100));
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        setIsError(false);
        setErrorMessage('');
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
        if (nativeEvent.progress < 0.99) {
            log(`onLoadProgress — ${Math.round(nativeEvent.progress * 100)}%`);
        }
    }, []);

    const onLoadEnd = useCallback(({ nativeEvent }) => {
        log('onLoadEnd | url:', nativeEvent.url?.substring(0,100));
        setProgress(1);
        setTimeout(() => {
            setContentLoaded(true);
            initialLoadComplete.current = true;
            log('onLoadEnd — contentLoaded = true');
        }, 300);
    }, []);

    const onError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        err('onError — WebView native error:', JSON.stringify({
            code:        nativeEvent.code,
            description: nativeEvent.description,
            domain:      nativeEvent.domain,
            url:         nativeEvent.url,
        }));
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        err('onHttpError — HTTP error:', JSON.stringify({
            statusCode:   nativeEvent.statusCode,
            description:  nativeEvent.description,
            url:          nativeEvent.url,
        }));

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

    // ── Auth guard ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user?.token) {
            warn('Auth guard — no token in Redux, showing alert');
            Alert.alert(
                'Authentication Required',
                'Please log in to continue.',
                [{ text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') }]
            );
        } else {
            log('Auth guard — token present ✅');
        }
    }, [user]);

    // ── Analytics ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (name) {
            analytics().logEvent('screen_view', {
                screen_name:  name,
                screen_class: 'ArticalWindowUtility'
            }).catch(console.error);
        }
    }, [name]);

    // ── AppState (background/foreground) ────────────────────────────────────
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            log('AppState change →', nextAppState);
            if (nextAppState === 'background') {
                backgroundTimestamp.current = Date.now();
                webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const bgDuration = Date.now() - backgroundTimestamp.current;
                log('Returned from background after', Math.round(bgDuration / 1000), 'seconds');

                if (bgDuration > 300000) {
                    log('Background > 5 min — checking WebView alive...');
                    const isAlive = await checkWebViewAlive();
                    log('WebView alive?', isAlive);
                    if (!isAlive) {
                        recreateWebView();
                    } else {
                        try {
                            await RefreshToken();
                            await refreshTokenInWebView();
                        } catch(e) {
                            err('Token refresh failed after background:', e);
                            recreateWebView();
                        }
                    }
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [checkWebViewAlive, recreateWebView, refreshTokenInWebView]);

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
                {webViewReady && !isTokenRefreshing && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ uri: url }}
                        onLoadStart={onLoadStart}
                        onLoadProgress={onLoadProgress}
                        onLoadEnd={onLoadEnd}
                        onError={onError}
                        onHttpError={onHttpError}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        injectedJavaScriptBeforeContentLoaded={injectionScript}
                        injectedJavaScript={injectionScript}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
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

                {(isLoading || isTokenRefreshing || !webViewReady) && !isError && (
                    <View style={styles.loadingOverlay}>
                        {name === 'Billing Details' ? <LoadingSpinner /> : <LoadingOverlay loading={true} />}
                    </View>
                )}

                {isError && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Unable to Load Page</Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <Text style={styles.retryText} onPress={() => {
                            log('User tapped Retry');
                            setIsError(false);
                            setErrorMessage('');
                            setContentLoaded(false);
                            setProgress(0);
                            initialLoadComplete.current  = false;
                            sessionInjected.current      = false;
                            webViewRef.current?.reload();
                        }}>
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
                <PDFViewModal
                    url={showPDFUrl}
                    onClose={() => setShowPDFModal(false)}
                />
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
    webView:         { flex: 1 },
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
    errorTitle:  { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    errorText:   { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
    retryText:   { fontSize: 16, color: '#8D3B90', fontWeight: '600', textDecorationLine: 'underline' },
    toast: {
        position: 'absolute', bottom: 100, left: 20, right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)', paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: 8, alignItems: 'center', zIndex: 2000,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});

export default ArticalWindowUtility;