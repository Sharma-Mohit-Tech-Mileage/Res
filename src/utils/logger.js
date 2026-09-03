import Config from 'react-native-config';

const PREFIX = '[App]';

const diagEnabled = () => __DEV__ || Config.WEBVIEW_DIAG_ENABLED === 'true';

const SENSITIVE_KEY_RE = /(token|password|secret|authorization|answer|jwt|refresh|\bpin\b)/i;

function redact(value, depth = 0) {
  if (value == null || depth > 5) return value;
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = SENSITIVE_KEY_RE.test(key) ? '[REDACTED]' : redact(value[key], depth + 1);
    }
    return out;
  }
  return value;
}

export function logError(context, error) {
  if (__DEV__) console.error(`${PREFIX} [${context}]`, error);
}

export function logWarn(context, msg) {
  if (__DEV__) console.warn(`${PREFIX} [${context}]`, msg);
}

export function logDebug(context, ...args) {
  if (__DEV__) console.log(`${PREFIX} [${context}]`, ...args.map((arg) => redact(arg)));
}

// UAT-visible diagnostic channel — gated on WEBVIEW_DIAG_ENABLED so it ships in dev/staging but stays silent in prod.
export function logDiag(context, payload) {
  if (!diagEnabled()) return;
  try {
    const line = typeof payload === 'string' ? payload : JSON.stringify(redact(payload));
    console.log(`${PREFIX} [DIAG] [${context}] ${line}`);
  } catch (e) {
    console.log(`${PREFIX} [DIAG] [${context}] <unserializable payload>`);
  }
}
