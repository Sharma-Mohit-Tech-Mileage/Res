import Config from 'react-native-config';

const PREFIX = '[App]';

const diagEnabled = () => __DEV__ || Config.WEBVIEW_DIAG_ENABLED === 'true';

export function logError(context, error) {
  if (__DEV__) console.error(`${PREFIX} [${context}]`, error);
}

export function logWarn(context, msg) {
  if (__DEV__) console.warn(`${PREFIX} [${context}]`, msg);
}

export function logDebug(context, ...args) {
  if (__DEV__) console.log(`${PREFIX} [${context}]`, ...args);
}

// UAT-visible diagnostic channel — gated on WEBVIEW_DIAG_ENABLED so it ships in dev/staging but stays silent in prod.
export function logDiag(context, payload) {
  if (!diagEnabled()) return;
  try {
    const line = typeof payload === 'string' ? payload : JSON.stringify(payload);
    console.log(`${PREFIX} [DIAG] [${context}] ${line}`);
  } catch (e) {
    console.log(`${PREFIX} [DIAG] [${context}] <unserializable payload>`);
  }
}
