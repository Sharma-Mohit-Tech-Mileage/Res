import CookieManager from '@react-native-cookies/cookies';
import { ISUAT } from '../../network/apis/account/Constants';

const TAG = '[NativeCookieManager]';

const COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';
const PORTAL_URL = ISUAT ? 'https://customer.uat.sparklight.com' : 'https://customer.sparklight.com';
const PCI_URL = ISUAT ? 'https://payment.uat.sparklight.com' : 'https://payment.sparklight.com';
const COOKIE_URLS = [PORTAL_URL, PCI_URL];

const longExpiry = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
const shortExpiry = () => new Date(Date.now() + 5 * 60 * 1000).toISOString();

const setCookie = (url, name, value, expires) =>
    CookieManager.set(url, { name, value, domain: COOKIE_DOMAIN, path: '/', expires });

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
        console.log(`${TAG} setAuthCookies OK | urls: ${COOKIE_URLS.join(', ')} | hasIdToken: ${!!idToken}`);
    } catch (e) {
        console.error(`${TAG} setAuthCookies FAILED:`, e.message);
    }
};

export const refreshIdTokenOnAllDomains = async (idToken) => {
    if (!idToken) return;
    try {
        await Promise.all(COOKIE_URLS.map(url => setCookie(url, 'IdToken', idToken, shortExpiry())));
        console.log(`${TAG} refreshIdToken OK | urls: ${COOKIE_URLS.join(', ')}`);
    } catch (e) {
        console.error(`${TAG} refreshIdToken FAILED:`, e.message);
    }
};
