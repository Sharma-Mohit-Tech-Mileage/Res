import CookieManager from '@react-native-cookies/cookies';
import { ISUAT } from '../../network/apis/account/Constants';

const TAG = '[NativeCookieManager]';

// Dot-prefix covers all subdomains (customer.*, payment.*, etc.)
const COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';

// Single representative URL — dot-prefixed domain (.sparklight.com) already covers
// ALL subdomains (customer.*, payment.*, etc.), so one URL context is sufficient.
const COOKIE_URL = ISUAT
    ? 'https://uat.sparklight.com'
    : 'https://sparklight.com';

const longExpiry = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
const shortExpiry = () => new Date(Date.now() + 5 * 60 * 1000).toISOString();

/**
 * Set a single cookie on a single URL via native CookieManager.
 */
const setCookie = (url, name, value, expires) =>
    CookieManager.set(url, {
        name,
        value,
        domain: COOKIE_DOMAIN,
        path: '/',
        expires,
    });

/**
 * Sets all 4 auth cookies (Source, CustomerType, LatestVersion, IdToken)
 * using the common domain (.sparklight.com) which covers all subdomains.
 *
 * Call this at initialization and on every page load.
 */
export const setAuthCookiesOnAllDomains = async (idToken) => {
    const long = longExpiry();
    const short = shortExpiry();

    try {
        const promises = [
            setCookie(COOKIE_URL, 'Source', 'MobileApp', long),
            setCookie(COOKIE_URL, 'CustomerType', 'Residential', long),
            setCookie(COOKIE_URL, 'LatestVersion', 'true', long),
        ];
        if (idToken) {
            promises.push(setCookie(COOKIE_URL, 'IdToken', idToken, short));
        }
        await Promise.all(promises);
        console.log(`${TAG} setAuthCookiesOnAllDomains succeeded | domain: ${COOKIE_DOMAIN} | url: ${COOKIE_URL} | hasIdToken: ${!!idToken}`);
    } catch (e) {
        console.error(`${TAG} setAuthCookiesOnAllDomains failed:`, e.message);
    }
};

/**
 * Lightweight refresh — only updates IdToken using common domain.
 *
 * Call this from the periodic silent refresh timer.
 */
export const refreshIdTokenOnAllDomains = async (idToken) => {
    if (!idToken) {
        console.warn(`${TAG} refreshIdTokenOnAllDomains skipped — no idToken`);
        return;
    }
    const short = shortExpiry();

    try {
        await setCookie(COOKIE_URL, 'IdToken', idToken, short);
        console.log(`${TAG} refreshIdTokenOnAllDomains succeeded | domain: ${COOKIE_DOMAIN} | url: ${COOKIE_URL}`);
    } catch (e) {
        console.error(`${TAG} refreshIdTokenOnAllDomains failed:`, e.message);
    }
};
