import * as Keychain from "react-native-keychain";

export const SECURE_KEYS = {
  ID_TOKEN: "idToken",
  REFRESH_TOKEN: "refreshToken",
  ZENDESK_DATA: "zendeskData",
};

const SERVICE_PREFIX = "sparklight.secure.";

const serviceFor = (key) => `${SERVICE_PREFIX}${key}`;

const optionsFor = (key) => ({
  service: serviceFor(key),
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

async function set(key, value, { requireBiometric = false } = {}) {
  if (value === null || value === undefined || value === "") {
    return remove(key);
  }
  if (requireBiometric) {
    // Phase 2 attaches biometric accessControl on this entry; no-op in Phase 1.
  }
  try {
    await Keychain.setGenericPassword(key, String(value), optionsFor(key));
    return true;
  } catch {
    return false;
  }
}

async function get(key) {
  try {
    const stored = await Keychain.getGenericPassword({ service: serviceFor(key) });
    return stored ? stored.password : null;
  } catch {
    return null;
  }
}

async function remove(key) {
  try {
    await Keychain.resetGenericPassword({ service: serviceFor(key) });
    return true;
  } catch {
    return false;
  }
}

async function clear() {
  const results = await Promise.all(Object.values(SECURE_KEYS).map(remove));
  return results.every(Boolean);
}

const SecureStore = { SECURE_KEYS, set, get, remove, clear };

export default SecureStore;
