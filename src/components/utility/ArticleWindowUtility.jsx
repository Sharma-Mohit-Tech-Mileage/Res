import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, AppState, Alert, Linking } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import { fetchACPUserAccountDetails, fetchEasyPayStatus } from '../../redux/actions/ProfileActionSuite';
import { RefreshToken } from '../user/Session';
import Config from 'react-native-config';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import LoadingOverlay from '../common/customui/LoadingOverlay';
import LoadingSpinner from './LoadingSpinner';
import { getUser } from '../../redux/utils/LocalStorage';
import NetInfo from '@react-native-community/netinfo';
import { setAuthCookiesOnAllDomains, clearAuthCookies } from './NativeCookieManager';
import { logError } from '../../utils/logger';
import { getPrimaryEmail } from './constant';
import { quickPayAmount, isOffSiteUrl } from '../../utils/paymentPlan';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import CryptoJS from 'crypto-js';
import { Color } from "../../styles/GlobalStyles";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateTabBarHeight } from '../../navigations/tabBarHeight';

const TAG = '[ArticalWindow]';
const JS_COOKIE_DOMAIN = Config.COOKIE_DOMAIN;
const PAYMENT_OBJ_STORAGE_KEY = 'paymentObj';
const EASYPAY_INFO_STORAGE_KEY = 'easyPayInfo';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

const hostOf = (u) => { const m = /^https?:\/\/([^/]+)/i.exec(u || ''); return m ? m[1].toLowerCase() : ''; };
const TRUSTED_HOSTS = [hostOf(Config.PORTAL_BASE_URL), hostOf(Config.PAYMENT_BASE_URL)].filter(Boolean);
const TRUSTED_HOSTS_JS = JSON.stringify(TRUSTED_HOSTS);

const safeForJS = (val) => JSON.stringify(String(val || '')).slice(1, -1);

const toBillingAddress = (a) => {
    if (!a || typeof a !== 'object') return {};
    return {
        Address_line1: a.address_line_1 || a.addressLine1 || a.line1 || a.address1 || '',
        Address_line2: a.address_line_2 || a.addressLine2 || a.line2 || a.address2 || '',
        City:          a.city || '',
        State:         a.state || '',
        ZipCode1:      a.zip || a.postal_code || a.zip_code || '',
    };
};

const userInfoWithServiceAddress = (userInfo, ad) => {
    const sa = ad?.service_address || null;
    return { ...(userInfo || {}), service_address: sa, serviceAddress: sa };
};

const isSuccessPage = (u) => {
    if (!u) return false;
    const s = u.toLowerCase();
    return s.includes('confirmation') || s.includes('thankyou');
};

const isOverviewPage = (u) => {
    if (!u) return false;
    const path = u.split('?')[0].split('#')[0].toLowerCase();
    return /\/billing\/?$/.test(path);
};

const isQuickPayUrl = (u) => {
    if (!u) return false;
    const path = u.split('?')[0].split('#')[0].toLowerCase();
    return /\/quick-pay\/?$/.test(path);
};

// Payment plan / bill explainer: how long a page may load before the retry panel replaces the spinner.
const SLOW_LOAD_MS = 45000;

const isLoginUrl = (u) => {
    if (!u) return false;
    const s = u.toLowerCase();
    return s.includes('/secureloginsso')
        || s.includes('/auth/realms/external-sso-realm')
        || (Config.SSO_LOGIN && s.includes(Config.SSO_LOGIN.toLowerCase()));
};

const PORTAL_FORM_KEY = Config.ENCRYPT_VAL_PASSWORD;
const buildEncryptedAccountBlob = (accountNo, form, custInfo) => {
    if (!accountNo) return '';
    try {
        const key = CryptoJS.enc.Utf8.parse(PORTAL_FORM_KEY);
        const cfg = { keySize: 16, iv: key, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        const payload = custInfo ? { Form: form, CustInfo: custInfo } : { Form: form };
        const plain = JSON.stringify(payload);
        const blob = CryptoJS.AES.encrypt(plain, key, cfg).toString();
        let roundtripOk = false;
        try {
            roundtripOk = CryptoJS.AES.decrypt(blob, key, cfg).toString(CryptoJS.enc.Utf8) === plain;
        } catch (_) {}
        if (!roundtripOk) {
            logError(`${TAG} buildEncryptedAccountBlob`, 'roundtrip failed; verify ENCRYPT_VAL_PASSWORD');
        }
        return blob;
    } catch (e) {
        logError(`${TAG} buildEncryptedAccountBlob`, e.message);
        return '';
    }
};

const buildCookieJS = (idToken, accountNo = '') => {
    const safe = safeForJS(idToken);
    const acct = safeForJS(accountNo);
    return `var _long = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
var _short = new Date(Date.now() + 5*60*1000).toUTCString();
var _dom = '; domain=${JS_COOKIE_DOMAIN}';
document.cookie = 'Source=MobileApp; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
document.cookie = 'CustomerType=Residential; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
document.cookie = 'LatestVersion=true; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';
if ('${safe}') document.cookie = 'IdToken=${safe}; path=/' + _dom + '; expires=' + _short + '; Secure; SameSite=Lax;';
if ('${acct}') document.cookie = 'AccountNo=${acct}; path=/' + _dom + '; expires=' + _long + '; Secure; SameSite=Lax;';`;
};

const buildInjectionScript = (token, userInfo, idToken, jwtTimestamp, paymentObjJson = '', easyPayInfoJson = '', accountNo = '', accountBlob = '') => {
    const safeToken = safeForJS(token);
    const safeUserInfo = safeForJS(typeof userInfo === 'string' ? userInfo : JSON.stringify(userInfo || {}));
    const paymentObjLine = paymentObjJson
        ? `try { localStorage.setItem('${PAYMENT_OBJ_STORAGE_KEY}', ${JSON.stringify(paymentObjJson)}); } catch(e) {}`
        : '';
    const easyPayInfoLine = easyPayInfoJson
        ? `try { localStorage.setItem('${EASYPAY_INFO_STORAGE_KEY}', ${JSON.stringify(easyPayInfoJson)}); } catch(e) {}`
        : '';
    const accountBlobLine = (accountNo && accountBlob)
        ? `try { localStorage.setItem(${JSON.stringify(String(accountNo))}, ${JSON.stringify(accountBlob)}); } catch(e) {}`
        : '';

    return `(function() {
    try {
        // Never write the session/billing data on untrusted (external) hosts.
        if (${TRUSTED_HOSTS_JS}.indexOf(location.hostname) === -1) return;

        if ('${safeToken}') {
            localStorage.setItem('jwt_token', '${safeToken}');
            localStorage.setItem('user_info', '${safeUserInfo}');
            localStorage.setItem('tokenIssuedAt', '${jwtTimestamp || Date.now()}');
        }
        ${paymentObjLine}
        ${easyPayInfoLine}
        ${accountBlobLine}

        // Some portal flows (e.g. SelectPaymentOptionComponent.handleCancel) call localStorage.clear(),
        // which would wipe the auth tokens we just injected and bounce the user to the login form.
        // Override clear() so it preserves the keys we need; portal code can still selectively removeItem.
        try {
            var _origClear = localStorage.clear.bind(localStorage);
            localStorage.clear = function() {
                var _keep = ['jwt_token', 'user_info', 'tokenIssuedAt', 'easyPayInfo'];
                var _acct = (document.cookie.match(/(?:^|; )AccountNo=([^;]+)/) || [])[1];
                if (_acct) _keep.push(_acct);
                var _saved = {};
                _keep.forEach(function(k) {
                    try { var v = localStorage.getItem(k); if (v != null) _saved[k] = v; } catch(e) {}
                });
                _origClear();
                Object.keys(_saved).forEach(function(k) {
                    try { localStorage.setItem(k, _saved[k]); } catch(e) {}
                });
            };
        } catch(e) {}

        try {
            var _expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'IdToken=; path=/; expires=' + _expire + ';';
            document.cookie = 'Source=; path=/; expires=' + _expire + ';';
            document.cookie = 'CustomerType=; path=/; expires=' + _expire + ';';
            document.cookie = 'LatestVersion=; path=/; expires=' + _expire + ';';
        } catch(e) {}
        try { ${buildCookieJS(idToken, accountNo)} } catch(e) {}

        // Statement PDFs arrive as base64 fileBinary in an XHR JSON response — hand to native viewer.
        var _xs = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            this.addEventListener('load', function() {
                try {
                    var u = self.responseURL || '';
                    if ((u.indexOf('/statements/') !== -1 || u.indexOf('Statement') !== -1) && self.status === 200) {
                        var d = JSON.parse(self.response);
                        if (d && d.fileBinary) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pdf', data: d.fileBinary }));
                    }
                } catch(e) {}
            });
            return _xs.apply(this, arguments);
        };

        // Native pings to confirm the WebView is alive (drives recreation after a long background).
        window.addEventListener('message', function(e) {
            if (e.data === 'PING') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pong' }));
            } else if (e.data === 'SAVE_STATE' && window.saveFormState) {
                window.saveFormState();
            }
        });

        // Preserve in-progress form input across app backgrounding / WebView recreation.
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
                if (!s) return;
                var fd = JSON.parse(s);
                document.querySelectorAll('input, select, textarea').forEach(function(el, i) {
                    var sf = fd['field_' + i];
                    if (sf && el.type !== 'password') el.value = sf.value;
                });
                var sp = localStorage.getItem('scrollPosition');
                if (sp) window.scrollTo(0, parseInt(sp));
            } catch(e) {}
        };
        setInterval(window.saveFormState, 5000);
        if (document.readyState === 'complete') window.restoreFormState();
        else window.addEventListener('load', window.restoreFormState);
    } catch(e) {}
})();
true;`;
};

const ArticleWindowUtility = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [name] = useState(route.params?.name);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [url] = useState(route.params?.url);
    const [injectPaymentObj] = useState(route.params?.injectPaymentObj === true);
    const [quickPayToNative] = useState(route.params?.quickPayToNative === true);
    const insets = useSafeAreaInsets();
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [webViewReady, setWebViewReady] = useState(false);
    const [injectionScript, setInjectionScript] = useState('');
    const [proceedAfterTimeout, setProceedAfterTimeout] = useState(false);

    const isPortalUrl = TRUSTED_HOSTS.includes(hostOf(url));

    const user = useSelector(state => state.user.userData);
    const accountDetails = useSelector(state => state.profile?.accountDetails);
    const accountDetailsFetchedAt = useSelector(state => state.profile?.accountDetailsFetchedAt);
    const easyPay = useSelector(state => state.profile?.easyPay);
    const dispatch = useDispatch();
    const webViewRef = useRef();
    const accountDetailsRef = useRef(accountDetails);
    accountDetailsRef.current = accountDetails;
    const easyPayRef = useRef(easyPay);
    easyPayRef.current = easyPay;
    const paymentObjJsonRef = useRef(null);
    const easyPayInfoJsonRef = useRef(null);
    const accountNoRef = useRef('');
    const accountBlobRef = useRef('');
    const aliveCheckResolver = useRef(null);
    const aliveCheckTimeout = useRef(null);
    const backgroundTimestamp = useRef(0);
    const initialLoadComplete = useRef(false);
    const silentRefreshTimer = useRef(null);
    const pendingOfflineRefresh = useRef(false);
    const lastIdTokenRefresh = useRef(0);
    const currentUrlRef = useRef('');
    const cacheUpdateFiredRef = useRef(false);
    const onSuccessPageRef = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    const buildPaymentObjJson = useCallback(async () => {
        try {
            const cu = await getUser();
            const userInfo = cu?.userInfo || {};
            const ad = accountDetailsRef.current || {};
            const ep = easyPayRef.current || {};
            const toNum = (v) => (v != null && v !== '' ? Number(v) : 0);
            easyPayInfoJsonRef.current = JSON.stringify({ isEasyPay: ep.isEasyPay || false, easyPayId: ep.easyPayId || '' });
            const paymentObj = {
                AccountNumber: userInfo.accountNumber || '',
                FirstName: userInfo.firstName || '',
                LastName: userInfo.lastName || '',
                TotalDue: toNum(ad.current_balance),
                CustomerType: 'Residential',
                PastDue: toNum(ad.past_due_amount),
                DueDate: ad.payment_due_date || '',
                PastDueAmount: toNum(ad.past_due_amount),
                PaymentDueDate: ad.payment_due_date || '',
                Email: getPrimaryEmail(ad) || '',
                EasyPayId: ep.easyPayId || '',
                EasyPayEnabled: ep.isEasyPay || false,
                IsWithinDisconnectGracePeriod: false,
                BillingAddress: toBillingAddress(ad.bill_to_address),
            };
            accountNoRef.current = userInfo.accountNumber || '';
            const custInfo = {
                email:     paymentObj.Email,
                firstName: paymentObj.FirstName,
                lastName:  paymentObj.LastName,
                address:   paymentObj.BillingAddress,
            };
            accountBlobRef.current = buildEncryptedAccountBlob(
                accountNoRef.current,
                { ...paymentObj, customer_type: paymentObj.CustomerType },
                custInfo,
            );
            return JSON.stringify(paymentObj);
        } catch (e) {
            logError(`${TAG} buildPaymentObjJson`, e.message);
            return '';
        }
    }, []);

    const ensurePaymentObjJson = useCallback(async () => {
        if (!injectPaymentObj) return '';
        if (paymentObjJsonRef.current) return paymentObjJsonRef.current;
        const json = await buildPaymentObjJson();
        paymentObjJsonRef.current = json;
        return json;
    }, [injectPaymentObj, buildPaymentObjJson]);

    const refreshInjectionScript = useCallback(async () => {
        const cu = await getUser();
        const accountNo = injectPaymentObj ? (accountNoRef.current || cu?.userInfo?.accountNumber || '') : '';
        const userInfoOut = userInfoWithServiceAddress(cu?.userInfo, accountDetailsRef.current);
        setInjectionScript(buildInjectionScript(cu?.token || '', userInfoOut, cu?.idToken || '', cu?.jwtTimestamp, paymentObjJsonRef.current || '', easyPayInfoJsonRef.current || '', accountNo, accountBlobRef.current || ''));
    }, [injectPaymentObj]);

    const prepareInjectionScript = useCallback(async () => {
        try {
            let cu = await getUser();
            const idTokenAge = cu?.idTokenTimestamp ? Date.now() - cu.idTokenTimestamp : Infinity;
            if (idTokenAge > 240000) {
                try {
                    await RefreshToken();
                    cu = await getUser();
                } catch (refreshErr) {
                    logError(`${TAG} prepareInjectionScript`, `token refresh failed: ${refreshErr.message}`);
                }
            }
            lastIdTokenRefresh.current = cu?.idTokenTimestamp || Date.now();
            const paymentObjJson = await ensurePaymentObjJson();
            const accountNo = injectPaymentObj ? (accountNoRef.current || cu?.userInfo?.accountNumber || '') : '';
            await setAuthCookiesOnAllDomains(cu?.idToken || '', accountNo);
            const userInfoOut = userInfoWithServiceAddress(cu?.userInfo, accountDetailsRef.current);
            setInjectionScript(buildInjectionScript(cu?.token || '', userInfoOut, cu?.idToken || '', cu?.jwtTimestamp, paymentObjJson, easyPayInfoJsonRef.current || '', accountNo, accountBlobRef.current || ''));
            setWebViewReady(true);
        } catch (e) {
            logError(`${TAG} prepareInjectionScript`, e.message);
            setWebViewReady(true);
        }
    }, [ensurePaymentObjJson, injectPaymentObj]);

    const injectIdTokenOnly = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const cu = await getUser();
            const idToken = cu?.idToken || '';
            const accountNo = injectPaymentObj ? (accountNoRef.current || cu?.userInfo?.accountNumber || '') : '';
            if (idToken) await setAuthCookiesOnAllDomains(idToken, accountNo);
            webViewRef.current.injectJavaScript(`(function() {
    try {
        if (${TRUSTED_HOSTS_JS}.indexOf(location.hostname) === -1) return;
        var _ae = document.activeElement;
        var _wasInput = _ae && (_ae.tagName === 'INPUT' || _ae.tagName === 'TEXTAREA' || _ae.tagName === 'SELECT');
        if (_wasInput) _ae.blur();
        ${buildCookieJS(idToken, accountNo)}
        if (_wasInput && _ae) { _ae.focus(); }
    } catch(e) {}
})(); true;`);
        } catch (e) {
            logError(`${TAG} injectIdTokenOnly`, e.message);
        }
    }, [injectPaymentObj]);

    const isOnPaymentDomain = useCallback(() => {
        const cur = currentUrlRef.current || '';
        return cur.includes('payment.sparklight.com') || cur.includes('payment.uat.sparklight.com');
    }, []);

    const silentRefreshIdToken = useCallback(async () => {
        if (!webViewRef.current) return;
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected || !netState.isInternetReachable) {
                pendingOfflineRefresh.current = true;
                return;
            }
            const newToken = await RefreshToken();
            if (!newToken) {
                pendingOfflineRefresh.current = true;
                return;
            }
            pendingOfflineRefresh.current = false;
            lastIdTokenRefresh.current = Date.now();
            await refreshInjectionScript();
            const cu = await getUser();
            if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken, accountNoRef.current || '');
            await injectIdTokenOnly();
        } catch (e) {
            logError(`${TAG} silentRefresh`, e.message);
            pendingOfflineRefresh.current = true;
        }
    }, [injectIdTokenOnly, refreshInjectionScript]);

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

    const mountTs = useRef(Date.now());
    useEffect(() => {
        if (!injectPaymentObj) return undefined;
        dispatch(fetchEasyPayStatus());
        dispatch(fetchACPUserAccountDetails({})); 
        const t = setTimeout(() => setProceedAfterTimeout(true), 5000);
        return () => clearTimeout(t);
    }, [injectPaymentObj, dispatch]);

    const injectionPreparedRef = useRef(false);
    useEffect(() => {
        if (injectionPreparedRef.current) return;
        if (!isPortalUrl) {
            injectionPreparedRef.current = true;
            setInjectionScript('');
            setWebViewReady(true);
            return;
        }
        const dataReady = !!accountDetailsFetchedAt && easyPay?.fetchedAt > mountTs.current;
        if (injectPaymentObj && !proceedAfterTimeout && !dataReady) return;
        injectionPreparedRef.current = true;
        prepareInjectionScript();
    }, [isPortalUrl, injectPaymentObj, accountDetailsFetchedAt, easyPay?.fetchedAt, proceedAfterTimeout, prepareInjectionScript]);

    useEffect(() => {
        if (!isPortalUrl) return undefined;
        return () => {
            webViewRef.current?.injectJavaScript(`
                try { localStorage.removeItem('formState'); localStorage.removeItem('scrollPosition'); } catch(e) {}
                true;
            `);
        };
    }, [isPortalUrl]);

    useEffect(() => {
        if (!isPortalUrl) return undefined;
        startSilentRefresh();
        return stopSilentRefresh;
    }, [isPortalUrl, startSilentRefresh, stopSilentRefresh]);

    useEffect(() => {
        if (!isPortalUrl) return undefined;
        const unsub = NetInfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable && pendingOfflineRefresh.current) silentRefreshIdToken();
        });
        return () => unsub();
    }, [isPortalUrl, silentRefreshIdToken]);

    useEffect(() => {
        if (!isPortalUrl) return undefined;
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
                    if (!isOnline) { pendingOfflineRefresh.current = true; }
                    else {
                        const alive = await checkWebViewAlive();
                        if (!alive) { recreateWebView(); }
                        else {
                            try { await RefreshToken(); lastIdTokenRefresh.current = Date.now(); await refreshInjectionScript(); await injectIdTokenOnly(); }
                            catch (_) { recreateWebView(); }
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
                }
                backgroundTimestamp.current = 0;
                startSilentRefresh();
            }
        };
        const sub = AppState.addEventListener('change', handleAppState);
        return () => sub?.remove();
    }, [isPortalUrl, checkWebViewAlive, recreateWebView, injectIdTokenOnly, refreshInjectionScript, startSilentRefresh, stopSilentRefresh]);

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

    useEffect(() => {
        if (!name) return;
        logEvent(getAnalytics(), 'screen_view', {
            screen_name: name,
            screen_class: injectPaymentObj ? 'BillingFlow' : 'ArticleView',
        }).catch(() => {});
    }, []); 

    // Payment plan / bill explainer only: their pay links open native Make a Payment.
    const openPaymentNatively = useCallback((reqUrl) => {
        if (!navigation.getState()?.routeNames?.includes('MakePayment')) return false;
        if (isQuickPayUrl(reqUrl)) {
            const prefillAmount = quickPayAmount(reqUrl);
            navigation.replace('MakePayment', prefillAmount ? { prefillAmount } : undefined);
            return true;
        }
        if (isLoginUrl(reqUrl)) {
            navigation.replace('MakePayment');
            return true;
        }
        return false;
    }, [navigation]);

    // Payment plan / bill explainer only: other new-window links open in the system browser.
    const onOpenWindow = useCallback(({ nativeEvent }) => {
        const targetUrl = nativeEvent?.targetUrl || '';
        if (!targetUrl || openPaymentNatively(targetUrl)) return;
        Linking.openURL(targetUrl).catch(() => {});
    }, [openPaymentNatively]);

    const onShouldStartLoadWithRequest = useCallback((request) => {
        const reqUrl = request.url || '';

        if (request.isTopFrame === false) return true;
        if (onSuccessPageRef.current && !isSuccessPage(reqUrl) && !reqUrl.includes('/postlogout')) {
            onSuccessPageRef.current = false;
            navigation.goBack();
            return false;
        }

        if (reqUrl.includes('/postlogout')) {
            stopSilentRefresh();
            clearAuthCookies();
            navigation.goBack();
            return false;
        }

        if (quickPayToNative && openPaymentNatively(reqUrl)) return false;
        // Payment plan / bill explainer only: links that leave the page's own site (e.g. My Account, Support) open in the system browser.
        if (quickPayToNative && isOffSiteUrl(reqUrl, url)) {
            Linking.openURL(reqUrl).catch(() => {});
            return false;
        }
        if (isOverviewPage(reqUrl) || isLoginUrl(reqUrl)) {
            navigation.goBack();
            return false;
        }
        if (isSuccessPage(reqUrl)) {
            onSuccessPageRef.current = true;
            if (!cacheUpdateFiredRef.current) {
                cacheUpdateFiredRef.current = true;
                dispatch(fetchACPUserAccountDetails({ force: true }));
            }
            return true;
        }

        if (!reqUrl.startsWith('https://') && !reqUrl.startsWith('http://')) return false;
        return true;
    }, [navigation, dispatch, stopSilentRefresh, quickPayToNative, openPaymentNatively, url]);

    const onNavigationStateChange = useCallback((navState) => {
        const u = navState?.url || '';
        if (u && (isOverviewPage(u) || isLoginUrl(u))) {
            navigation.goBack();
            return;
        }
        if (onSuccessPageRef.current && u && !isSuccessPage(u) && !u.includes('/postlogout')) {
            onSuccessPageRef.current = false;
            navigation.goBack();
        }
    }, [navigation]);

    const slowLoadRef = useRef(false);
    const remountPage = useCallback(() => {
        slowLoadRef.current = false;
        setIsError(false);
        setErrorMessage('');
        setContentLoaded(false);
        setProgress(0);
        initialLoadComplete.current = false;
        setWebViewKey(Date.now());
    }, []);

    // Payment plan / bill explainer only: a page that never finishes loading shows the retry panel instead of an endless spinner.
    useEffect(() => {
        if (!quickPayToNative || !webViewReady || contentLoaded || isError) return undefined;
        const t = setTimeout(() => {
            slowLoadRef.current = true;
            setIsError(true);
            setErrorMessage('This page is taking longer than usual to load.');
        }, SLOW_LOAD_MS);
        return () => clearTimeout(t);
    }, [quickPayToNative, webViewReady, contentLoaded, isError, webViewKey]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        if (nativeEvent?.url) currentUrlRef.current = nativeEvent.url;
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        // Payment plan / bill explainer keep the error panel until Retry, so the WebView's raw error page never shows.
        if (!quickPayToNative) {
            setIsError(false);
            setErrorMessage('');
        }
        if (nativeEvent?.url && (nativeEvent.url.includes('payment.sparklight.com') || nativeEvent.url.includes('payment.uat.sparklight.com'))) {
            (async () => {
                try {
                    const cu = await getUser();
                    if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken, accountNoRef.current || '');
                } catch (_) {}
            })();
        }
    }, [quickPayToNative]);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        if (isPortalUrl && !isOnPaymentDomain()) {
            await injectIdTokenOnly();
        }
        if (slowLoadRef.current) {
            slowLoadRef.current = false;
            setIsError(false);
            setErrorMessage('');
        }
        setTimeout(() => { setContentLoaded(true); initialLoadComplete.current = true; }, 300);
    }, [isPortalUrl, injectIdTokenOnly, isOnPaymentDomain]);

    const onError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} WebView error`, nativeEvent.description || 'unknown');
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} HTTP error`, String(nativeEvent.statusCode));
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
            if (data.type === 'pong') {
                if (aliveCheckTimeout.current) { clearTimeout(aliveCheckTimeout.current); aliveCheckTimeout.current = null; }
                if (aliveCheckResolver.current) { aliveCheckResolver.current(true); aliveCheckResolver.current = null; }
            } else if (data.type === 'pdf') {
                setShowPDFUrl(data.data);
                setShowPDFModal(true);
            }
        } catch (_) {}
    }, []);

    return (
        <View style={[styles.container, { marginBottom: calculateTabBarHeight(insets) }]}>
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
                        onNavigationStateChange={onNavigationStateChange}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        // Payment plan / bill explainer are vendor single-page apps: a cached shell can point at scripts the vendor has since replaced (blank page).
                        cacheEnabled={!quickPayToNative}
                        cacheMode={quickPayToNative ? 'LOAD_NO_CACHE' : 'LOAD_DEFAULT'}
                        originWhitelist={['https://*']}
                        onOpenWindow={quickPayToNative ? onOpenWindow : undefined}
                        // iOS: reload if the page's content process is killed, otherwise the screen stays blank.
                        onContentProcessDidTerminate={quickPayToNative ? () => webViewRef.current?.reload() : undefined}
                        // Android: a killed renderer leaves a blank page, so mount a fresh WebView.
                        onRenderProcessGone={quickPayToNative ? remountPage : undefined}
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
                            if (quickPayToNative) { remountPage(); return; }
                            setIsError(false); setErrorMessage(''); setContentLoaded(false);
                            setProgress(0); initialLoadComplete.current = false;
                            webViewRef.current?.reload();
                        }}>Tap to Retry</Text>
                        {quickPayToNative && (
                            <Text style={[styles.retryText, styles.browserText]} onPress={() => Linking.openURL(url).catch(() => {})}>
                                Open in browser
                            </Text>
                        )}
                    </View>
                )}
            </View>
            {showPDFModal && <PDFViewModal url={showPDFUrl} onClose={() => setShowPDFModal(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1, position: 'relative' },
    webView: { flex: 1 },
    loadingOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', backgroundColor: Color.sparklightWhite, zIndex: 1000,
    },
    errorContainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: Color.sparklightWhite,
    },
    errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    errorText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
    retryText: { fontSize: 16, color: Color.sparklightPrimaryPurple, fontWeight: '600', textDecorationLine: 'underline' },
    browserText: { marginTop: 16 },
});

export default ArticleWindowUtility;
