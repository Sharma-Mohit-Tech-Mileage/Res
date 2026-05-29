import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

const TAG = '[NativeCookieManager]';

const COOKIE_DOMAIN = Config.COOKIE_DOMAIN;
const PORTAL_URL = Config.PORTAL_BASE_URL;
const COOKIE_URLS = [PORTAL_URL];

const longExpiry = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
const shortExpiry = () => new Date(Date.now() + 5 * 60 * 1000).toISOString();

const setCookie = (url, name, value, expires) =>
    CookieManager.set(url, { name, value, domain: COOKIE_DOMAIN, path: '/', expires, secure: true, sameSite: 'lax' });

// idToken expires in ~5 min; AccountNo is long-lived and doubles as the localStorage key for the
// encrypted Form blob. AccountNo must be JS-readable (the portal reads it via cookieService.get).
export const setAuthCookiesOnAllDomains = async (idToken, accountNumber = '') => {
    try {
        const long = longExpiry();
        const short = shortExpiry();
        const promises = [];
        for (const url of COOKIE_URLS) {
            promises.push(setCookie(url, 'Source', 'MobileApp', long));
            promises.push(setCookie(url, 'CustomerType', 'Residential', long));
            promises.push(setCookie(url, 'LatestVersion', 'true', long));
            if (idToken) promises.push(setCookie(url, 'IdToken', idToken, short));
            if (accountNumber) promises.push(setCookie(url, 'AccountNo', String(accountNumber), long));
        }
        await Promise.all(promises);
    } catch (e) {
        console.warn(`${TAG} setAuthCookies FAILED | error=${e.message}`);
    }
};

export const refreshIdTokenOnAllDomains = async (idToken) => {
    if (!idToken) {
        return;
    }
    try {
        const expiry = shortExpiry();
        await Promise.all(COOKIE_URLS.map(url => setCookie(url, 'IdToken', idToken, expiry)));
    } catch (e) {
        console.warn(`${TAG} refreshIdToken FAILED | error=${e.message}`);
    }
};

export const clearAuthCookies = async () => {
    try {
        await CookieManager.clearAll();
    } catch (e) {
        console.warn(`${TAG} clearAuthCookies FAILED | error=${e.message}`);
    }
};
