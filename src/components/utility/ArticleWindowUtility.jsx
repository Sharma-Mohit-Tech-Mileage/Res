import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Alert } from 'react-native';
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
import { logError, logWarn, logDiag } from '../../utils/logger';
import { getPrimaryEmail } from './constant';
import analytics from '@react-native-firebase/analytics';
import CryptoJS from 'crypto-js';

const TAG = '[ArticalWindow]';
const JS_COOKIE_DOMAIN = Config.COOKIE_DOMAIN;
// localStorage key the portal reads the (unencrypted) payment object from on billing pages.
const PAYMENT_OBJ_STORAGE_KEY = 'paymentObj';
// localStorage key SubNavComponent reads EasyPay status from (autopay routing + EasyPayId/EasyPayEnabled).
const EASYPAY_INFO_STORAGE_KEY = 'easyPayInfo';
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

// Session/billing data is ONLY ever injected on these hosts (the portal + payment domains).
// Article/support/legal links share this WebView but must never receive the session.
const hostOf = (u) => { const m = /^https?:\/\/([^/]+)/i.exec(u || ''); return m ? m[1].toLowerCase() : ''; };
const TRUSTED_HOSTS = [hostOf(Config.PORTAL_BASE_URL), hostOf(Config.PAYMENT_BASE_URL)].filter(Boolean);
const TRUSTED_HOSTS_JS = JSON.stringify(TRUSTED_HOSTS);

const safeForJS = (val) => JSON.stringify(String(val || '')).slice(1, -1);

// Maps the ACP API's address shape (whatever variant it returns) into the PascalCase shape the
// portal's UtilsService.formatAddress(addressInfo) expects:
//   Address_line1 + Address_line2 + City + State + ZipCode1.
// We accept several source-field naming variants so a small API rename doesn't silently empty this.
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

// Once the user lands on a success/confirmation page, the next navigation away (e.g., the portal's
// "Back to Billing" link) closes the WebView and returns to the mobile app instead of dropping them
// on the portal overview. Matched broadly by substring because the exact path varies by env (UAT vs
// prod), profile (Residential vs Business), and flow (payment-confirmation, deactivate-confirmation,
// activate-confirmation, thankyou). Both branches share "confirmation" / "thankyou" in the path.
const isSuccessPage = (u) => {
    if (!u) return false;
    const s = u.toLowerCase();
    return s.includes('confirmation') || s.includes('thankyou');
};

// The portal's billing overview (e.g. /portals/billing, /portals/app-secure/billing) is owned by
// the mobile app — the WebView only handles action pages (make-payment, billing-payment, *-autopay).
// Any navigation that lands on the overview (the destination of Cancel and of any "Back to Billing"
// link) means the user is exiting the flow, so close the WebView instead of letting the portal load
// the overview and run its own login/auth logic. Path ends with /billing exactly — won't match
// /billing-payment or /billing-statement.
const isOverviewPage = (u) => {
    if (!u) return false;
    const path = u.split('?')[0].split('#')[0].toLowerCase();
    return /\/billing\/?$/.test(path);
};

// Any login URL — the portal's own `/SecureLoginSSO` entry, the SSO IdP at any host
// (login.* / canary-login.*), or the configured Config.SSO_LOGIN — means the user is being asked
// to re-authenticate. That happens when the portal's Cancel button clears state and its `/billing`
// route guard synchronously redirects (so the overview guard never sees `/billing`). Bring them
// back to the mobile app; the next opening will inject fresh tokens and load directly.
const isLoginUrl = (u) => {
    if (!u) return false;
    const s = u.toLowerCase();
    return s.includes('/secureloginsso')
        || s.includes('/auth/realms/external-sso-realm')
        || (Config.SSO_LOGIN && s.includes(Config.SSO_LOGIN.toLowerCase()));
};

// Mirrors the portal's UtilsService.encryptWithCryptoJS EXACTLY: AES-ECB / Pkcs7 with key = iv =
// Utf8.parse(atob(pci_keyVal)), which equals the decoded ENCRYPT_VAL_PASSWORD here. A key mismatch
// makes the portal's decrypt throw "Malformed UTF-8 data", so we self-check via a decrypt round-trip.
const PORTAL_FORM_KEY = Config.ENCRYPT_VAL_PASSWORD;
const buildEncryptedAccountBlob = (accountNo, form) => {
    if (!accountNo) return '';
    try {
        const key = CryptoJS.enc.Utf8.parse(PORTAL_FORM_KEY);
        const cfg = { keySize: 16, iv: key, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        const plain = JSON.stringify({ Form: form });
        const blob = CryptoJS.AES.encrypt(plain, key, cfg).toString();
        let roundtripOk = false;
        try {
            roundtripOk = CryptoJS.AES.decrypt(blob, key, cfg).toString(CryptoJS.enc.Utf8) === plain;
        } catch (_) {}
        if (!roundtripOk) {
            logError(`${TAG} buildEncryptedAccountBlob`, 'round-trip FAILED — check ENCRYPT_VAL_PASSWORD vs portal pci_keyVal');
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
    // paymentObjJson is already a JSON string; JSON.stringify wraps it in a safely-escaped JS literal.
    const paymentObjLine = paymentObjJson
        ? `try { localStorage.setItem('${PAYMENT_OBJ_STORAGE_KEY}', ${JSON.stringify(paymentObjJson)}); } catch(e) {}`
        : '';
    // SubNavComponent reads easyPayInfo for autopay routing + EasyPayId/EasyPayEnabled.
    const easyPayInfoLine = easyPayInfoJson
        ? `try { localStorage.setItem('${EASYPAY_INFO_STORAGE_KEY}', ${JSON.stringify(easyPayInfoJson)}); } catch(e) {}`
        : '';
    // "Form way": encrypted blob keyed by account number — ManageAutopayComponent reads it (no fallback).
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

        // Statement PDFs arrive as base64 fileBinary in an XHR JSON response — hand it to the native viewer.
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
    // Only billing pages (make-payment, activate/manage autopay, billing-payment) pass this.
    const [injectPaymentObj] = useState(route.params?.injectPaymentObj === true);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [webViewReady, setWebViewReady] = useState(false);
    const [injectionScript, setInjectionScript] = useState('');
    // Safety net: if accountDetails / easyPay never hydrate (network failure, slow API),
    // proceed with whatever's there after 5s so the WebView can't hang forever.
    const [proceedAfterTimeout, setProceedAfterTimeout] = useState(false);

    // Portal/payment pages get the session + token-refresh machinery; external links get a plain WebView.
    const isPortalUrl = TRUSTED_HOSTS.includes(hostOf(url));

    const user = useSelector(state => state.user.userData);
    const accountDetails = useSelector(state => state.profile?.accountDetails);
    const accountDetailsFetchedAt = useSelector(state => state.profile?.accountDetailsFetchedAt);
    const easyPay = useSelector(state => state.profile?.easyPay);
    const dispatch = useDispatch();
    const webViewRef = useRef();
    // Read in async callbacks without re-subscribing; avoids stale closures over Redux state.
    const accountDetailsRef = useRef(accountDetails);
    accountDetailsRef.current = accountDetails;
    const easyPayRef = useRef(easyPay);
    easyPayRef.current = easyPay;
    // Cached so silent refresh / WebView recreation re-injects without rebuilding.
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
    // Fires once per session on payment/AutoPay confirmation to refresh the backend account cache.
    const cacheUpdateFiredRef = useRef(false);
    // True once the user lands on a success/confirmation page — the next navigation away closes the WebView.
    const onSuccessPageRef = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    // Builds the unencrypted payment object + the encrypted { Form } blob the billing portal pages read.
    const buildPaymentObjJson = useCallback(async () => {
        try {
            const cu = await getUser();
            const userInfo = cu?.userInfo || {};
            const ad = accountDetailsRef.current || {};
            const ep = easyPayRef.current || {};
            // Clamp to ≥ 0 — a credit-balance account returns negative payment_due_amount, which
            // the portal would otherwise render as e.g. "$-52,732.10" on the payment-amount screen.
            const toNum = (v) => Math.max(0, v != null && v !== '' ? Number(v) : 0);
            easyPayInfoJsonRef.current = JSON.stringify({ isEasyPay: ep.isEasyPay || false, easyPayId: ep.easyPayId || '' });
            const paymentObj = {
                AccountNumber: userInfo.accountNumber || '',
                FirstName: userInfo.firstName || '',
                LastName: userInfo.lastName || '',
                TotalDue: toNum(ad.payment_due_amount),
                CustomerType: 'Residential',
                PastDue: toNum(ad.past_due_amount),
                DueDate: ad.payment_due_date || '',
                PastDueAmount: toNum(ad.past_due_amount),
                PaymentDueDate: ad.payment_due_date || '',
                Email: getPrimaryEmail(ad) || '',
                EasyPayId: ep.easyPayId || '',
                EasyPayEnabled: ep.isEasyPay || false,
                IsWithinDisconnectGracePeriod: false,
                // Mapped to the portal's PascalCase shape so UtilsService.formatAddress(Form.BillingAddress)
                // works directly. Sourced from accountDetails.bill_to_address (ACP API).
                BillingAddress: toBillingAddress(ad.bill_to_address),
            };
            // Same fields feed both read-paths; customer_type alias matches SubNavComponent's Form shape.
            accountNoRef.current = userInfo.accountNumber || '';
            accountBlobRef.current = buildEncryptedAccountBlob(accountNoRef.current, { ...paymentObj, customer_type: paymentObj.CustomerType });
            // One-shot diag for the autopay fields specifically — easypayacc in ManageAutopay
            // requires Form.EasyPayId to be non-empty AND to match an acc.id in getFundingAccounts.
            // Showing both the Redux source (ep) and what we end up injecting so a mismatch is obvious.
            // Also surfaces the mapped BillingAddress so you can confirm the ACP API sub-field names
            // mapped through correctly (empty strings = mapper missed the source field name).
            logDiag(`${TAG} autopayFields`, {
                accountNo: accountNoRef.current,
                ep_isEasyPay: ep.isEasyPay,
                ep_easyPayId: ep.easyPayId,
                injected_EasyPayId: paymentObj.EasyPayId,
                injected_EasyPayEnabled: paymentObj.EasyPayEnabled,
                injected_BillingAddress: paymentObj.BillingAddress,
            });
            return JSON.stringify(paymentObj);
        } catch (e) {
            logError(`${TAG} buildPaymentObjJson`, e.message);
            return '';
        }
    }, []);

    // Builds the payment object once (billing pages only) and caches it for later re-injections.
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
        setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp, paymentObjJsonRef.current || '', easyPayInfoJsonRef.current || '', accountNo, accountBlobRef.current || ''));
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
            setInjectionScript(buildInjectionScript(cu?.token || '', cu?.userInfo || {}, cu?.idToken || '', cu?.jwtTimestamp, paymentObjJson, easyPayInfoJsonRef.current || '', accountNo, accountBlobRef.current || ''));
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

    // Billing pages need fresh accountDetails + EasyPay before building the payment object —
    // kick off both saga fetches on mount and arm a 5s safety net so a slow API can't hang the WebView.
    const mountTs = useRef(Date.now());
    useEffect(() => {
        if (!injectPaymentObj) return undefined;
        dispatch(fetchEasyPayStatus());
        dispatch(fetchACPUserAccountDetails({})); // saga skips if data is < 60s old
        const t = setTimeout(() => setProceedAfterTimeout(true), 5000);
        return () => clearTimeout(t);
    }, [injectPaymentObj, dispatch]);

    // Prepare injection once. External (non-portal) links render immediately with no injection.
    // Billing pages wait for both accountDetails (so TotalDue/PastDue/Email are populated, not zeroed)
    // and a fresh EasyPay fetch — or for the 5s safety-net timeout — before the portal page loads.
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

    // Fire one screen_view per opening with the real label ("Make a Payment", "Privacy Policy", etc.)
    // so analytics can tell each flow apart instead of collapsing them all under "ArticleWindowUtility".
    // injectPaymentObj separates billing flows from external article/support/legal pages.
    useEffect(() => {
        if (!name) return;
        analytics().logEvent('screen_view', {
            screen_name: name,
            screen_class: injectPaymentObj ? 'BillingFlow' : 'ArticleView',
        }).catch(() => {});
    }, []);   // mount-only

    const onShouldStartLoadWithRequest = useCallback((request) => {
        const reqUrl = request.url || '';
        logDiag(`${TAG}`, { event: 'nav', url: reqUrl, isTopFrame: request.isTopFrame });

        // Only act on top-frame navigation. Subframe (iframe) loads — e.g. the Orbipay funding-
        // account widget embedded in manage-autopay — must pass through; otherwise our exit
        // guards would close the WebView the moment the widget loads.
        if (request.isTopFrame === false) return true;

        // After the user has been on a success page, the next navigation away from it
        // (e.g., "Back to Billing") closes the WebView instead of going to the portal overview.
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

        // The portal overview is the mobile app's territory — Cancel and "Back to Billing" both
        // land here. Close the WebView so the portal never tries to load its overview / login.
        if (isOverviewPage(reqUrl) || isLoginUrl(reqUrl)) {
            navigation.goBack();
            return false;
        }

        // Payment / AutoPay confirmation: refresh once so Redux has fresh balance/email on return,
        // and arm the post-success → back-to-mobile guard.
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
    }, [navigation, dispatch, stopSilentRefresh]);

    // Catches Angular client-side ("SPA") navigation that onShouldStartLoadWithRequest doesn't fire for —
    // specifically a routerLink from a success page to the portal overview.
    const onNavigationStateChange = useCallback((navState) => {
        const u = navState?.url || '';
        // navState.url is the top-document URL — iframe loads (Orbipay widget) don't update it,
        // so this hook is naturally safe from the subframe issue that onShouldStartLoadWithRequest had.
        if (u) logDiag(`${TAG}`, { event: 'navState', url: u, loading: !!navState?.loading });
        // Same exit rules as onShouldStartLoadWithRequest, for Angular SPA pushState/routerLink navs
        // that don't trigger the shouldStartLoad hook.
        if (u && (isOverviewPage(u) || isLoginUrl(u))) {
            navigation.goBack();
            return;
        }
        if (onSuccessPageRef.current && u && !isSuccessPage(u) && !u.includes('/postlogout')) {
            onSuccessPageRef.current = false;
            navigation.goBack();
        }
    }, [navigation]);

    const onLoadStart = useCallback(({ nativeEvent }) => {
        if (nativeEvent?.url) currentUrlRef.current = nativeEvent.url;
        if (!initialLoadComplete.current) { setProgress(0); setContentLoaded(false); }
        setIsError(false);
        setErrorMessage('');
        // Refresh cookies when entering the payment domain (Orbipay / eBillPay).
        if (nativeEvent?.url && (nativeEvent.url.includes('payment.sparklight.com') || nativeEvent.url.includes('payment.uat.sparklight.com'))) {
            (async () => {
                try {
                    const cu = await getUser();
                    if (cu?.idToken) await setAuthCookiesOnAllDomains(cu.idToken, accountNoRef.current || '');
                } catch (_) {}
            })();
        }
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => { setProgress(nativeEvent.progress); }, []);

    const onLoadEnd = useCallback(async () => {
        setProgress(1);
        // Re-assert the IdToken cookie after load on portal pages (not on the payment domain mid-transaction).
        if (isPortalUrl && !isOnPaymentDomain()) {
            await injectIdTokenOnly();
        }
        setTimeout(() => { setContentLoaded(true); initialLoadComplete.current = true; }, 300);
    }, [isPortalUrl, injectIdTokenOnly, isOnPaymentDomain]);

    const onError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} WebView error`, `${nativeEvent.description || 'Unknown'} | ${currentUrlRef.current}`);
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback(({ nativeEvent }) => {
        logError(`${TAG} HTTP error`, `${nativeEvent.statusCode} | ${nativeEvent.url}`);
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
                        onNavigationStateChange={onNavigationStateChange}
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
});

export default ArticleWindowUtility;
