import CookieManager from '@react-native-cookies/cookies';
import { ISUAT } from '../../network/apis/account/Constants';

const TAG = '[NativeCookieManager]';

const COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';
const PORTAL_URL = ISUAT ? 'https://customer.uat.sparklight.com' : 'https://customer.sparklight.com';
const PCI_URL = ISUAT ? 'https://payment.uat.sparklight.com' : 'https://payment.sparklight.com';
const COOKIE_URLS = [PORTAL_URL, PCI_URL];

const longExpiry = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
const shortExpiry = () => new Date(Date.now() + 5 * 60 * 1000).toISOString();

const tokenPreview = (t) => {
    if (!t) return '(none)';
    const s = String(t);
    if (s.length <= 16) return s.substring(0, 4) + '…';
    return s.substring(0, 8) + '…' + s.substring(s.length - 4);
};

const setCookie = (url, name, value, expires) =>
    CookieManager.set(url, { name, value, domain: COOKIE_DOMAIN, path: '/', expires, secure: true, sameSite: 'lax' });

/**
 * Dump all current cookies for diagnostic purposes.
 * Call this at key checkpoints to verify cookie state.
 */
export const dumpCookies = async (caller = '') => {
    try {
        const all = await CookieManager.getAll();
        const relevant = {};
        for (const [name, cookie] of Object.entries(all)) {
            if (['IdToken', 'Source', 'CustomerType', 'LatestVersion'].includes(name)) {
                relevant[name] = {
                    value: name === 'IdToken' ? tokenPreview(cookie.value) : cookie.value,
                    domain: cookie.domain || '?',
                    expires: cookie.expires || '?',
                };
            }
        }
        console.log(`${TAG} dumpCookies [${caller}] | ts=${new Date().toISOString()} | cookies=${JSON.stringify(relevant)}`);
    } catch (e) {
        console.warn(`${TAG} dumpCookies [${caller}] FAILED:`, e.message);
    }
};

export const setAuthCookiesOnAllDomains = async (idToken) => {
    const ts = new Date().toISOString();
    try {
        const long = longExpiry();
        const short = shortExpiry();
        console.log(`${TAG} setAuthCookies START | ts=${ts} | idToken=${tokenPreview(idToken)} | idTokenExpiry=${short} | urls=${COOKIE_URLS.join(', ')}`);
        const promises = [];
        for (const url of COOKIE_URLS) {
            promises.push(setCookie(url, 'Source', 'MobileApp', long));
            promises.push(setCookie(url, 'CustomerType', 'Residential', long));
            promises.push(setCookie(url, 'LatestVersion', 'true', long));
            if (idToken) promises.push(setCookie(url, 'IdToken', idToken, short));
        }
        await Promise.all(promises);
        console.log(`${TAG} setAuthCookies OK | ts=${new Date().toISOString()} | cookieCount=${promises.length}`);
    } catch (e) {
        console.error(`${TAG} setAuthCookies FAILED | ts=${ts} | error=${e.message}`);
    }
};

export const refreshIdTokenOnAllDomains = async (idToken) => {
    if (!idToken) {
        console.warn(`${TAG} refreshIdToken SKIP — no idToken provided | ts=${new Date().toISOString()}`);
        return;
    }
    try {
        const expiry = shortExpiry();
        console.log(`${TAG} refreshIdToken START | ts=${new Date().toISOString()} | idToken=${tokenPreview(idToken)} | expiry=${expiry}`);
        await Promise.all(COOKIE_URLS.map(url => setCookie(url, 'IdToken', idToken, expiry)));
        console.log(`${TAG} refreshIdToken OK | ts=${new Date().toISOString()} | urls=${COOKIE_URLS.join(', ')}`);
    } catch (e) {
        console.error(`${TAG} refreshIdToken FAILED | error=${e.message} | ts=${new Date().toISOString()}`);
    }
};

export const clearAuthCookies = async () => {
    try {
        console.log(`${TAG} clearAuthCookies START | ts=${new Date().toISOString()}`);
        await CookieManager.clearAll();
        console.log(`${TAG} clearAuthCookies OK | ts=${new Date().toISOString()}`);
    } catch (e) {
        console.error(`${TAG} clearAuthCookies FAILED | error=${e.message} | ts=${new Date().toISOString()}`);
    }
};
