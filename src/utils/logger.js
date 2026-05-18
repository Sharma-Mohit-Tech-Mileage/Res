// Centralised dev-only logging. Add Sentry/Firebase routing here later without touching call-sites.

const PREFIX = '[App]';

export function logError(context, error) {
  if (__DEV__) console.error(`${PREFIX} [${context}]`, error);
}

export function logWarn(context, msg) {
  if (__DEV__) console.warn(`${PREFIX} [${context}]`, msg);
}

export function logDebug(context, ...args) {
  if (__DEV__) console.log(`${PREFIX} [${context}]`, ...args);
}
