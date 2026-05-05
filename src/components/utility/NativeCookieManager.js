import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

const TAG = '[NativeCookieManager]';

const COOKIE_DOMAIN = Config.COOKIE_DOMAIN;
const PORTAL_URL = Config.PORTAL_BASE_URL;
const PCI_URL = Config.PAYMENT_BASE_URL;
const COOKIE_URLS = [PORTAL_URL, PCI_URL];

const longExpiry = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
const shortExpiry = () => new Date(Date.now() + 5 * 60 * 1000).toISOString();

const setCookie = (url, name, value, expires) =>
    CookieManager.set(url, { name, value, domain: COOKIE_DOMAIN, path: '/', expires, secure: true, sameSite: 'lax' });

export const dumpCookies = async () => {};

export const setAuthCookiesOnAllDomains = async (idToken) => {
    try {
        const long = longExpiry();
        const short = shortExpiry();
        const promises = [];
        for (const url of COOKIE_URLS) {
            promises.push(setCookie(url, 'Source', 'MobileApp', long));
            promises.push(setCookie(url, 'CustomerType', 'Residential', long));
            promises.push(setCookie(url, 'LatestVersion', 'true', long));
            if (idToken) promises.push(setCookie(url, 'IdToken', idToken, short));
        }
        await Promise.all(promises);
    } catch (e) {
        console.error(`${TAG} setAuthCookies FAILED | error=${e.message}`);
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
        console.error(`${TAG} refreshIdToken FAILED | error=${e.message}`);
    }
};

export const clearAuthCookies = async () => {
    try {
        await CookieManager.clearAll();
    } catch (e) {
        console.error(`${TAG} clearAuthCookies FAILED | error=${e.message}`);
    }
};
