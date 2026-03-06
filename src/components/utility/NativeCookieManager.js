import CookieManager from '@react-native-cookies/cookies';
import { ISUAT } from '../../network/apis/account/Constants';

const TAG = '[NativeCookieManager]';

// Dot-prefix covers all subdomains (customer.*, payment.*, etc.)
const COOKIE_DOMAIN = ISUAT ? '.uat.sparklight.com' : '.sparklight.com';

// Representative URLs for each subdomain — CookieManager needs a URL context
const DOMAIN_URLS = ISUAT
    ? [
        'https://customer.uat.sparklight.com',
        'https://payment.uat.sparklight.com',
    ]
    : [
        'https://customer.sparklight.com',
        'https://payment.sparklight.com',
    ];

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
 * on BOTH customer and payment domains simultaneously.
 *
 * Call this at initialization and on every page load.
 */
export const setAuthCookiesOnAllDomains = async (idToken) => {
    const long = longExpiry();
    const short = shortExpiry();

    try {
        const promises = [];
        for (const url of DOMAIN_URLS) {
            promises.push(
                setCookie(url, 'Source', 'MobileApp', long),
                setCookie(url, 'CustomerType', 'Residential', long),
                setCookie(url, 'LatestVersion', 'true', long),
            );
            if (idToken) {
                promises.push(setCookie(url, 'IdToken', idToken, short));
            }
        }
        await Promise.all(promises);
        console.log(`${TAG} setAuthCookiesOnAllDomains succeeded | domain: ${COOKIE_DOMAIN} | hasIdToken: ${!!idToken}`);
    } catch (e) {
        console.error(`${TAG} setAuthCookiesOnAllDomains failed:`, e.message);
    }
};

/**
 * Lightweight refresh — only updates IdToken on both domains.
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
        await Promise.all(
            DOMAIN_URLS.map((url) => setCookie(url, 'IdToken', idToken, short)),
        );
        console.log(`${TAG} refreshIdTokenOnAllDomains succeeded | domain: ${COOKIE_DOMAIN}`);
    } catch (e) {
        console.error(`${TAG} refreshIdTokenOnAllDomains failed:`, e.message);
    }
};
