// [51768] OIDC auth-code + PKCE helper for the in-app WebView login (replaces the iOS system auth sheet).
import "react-native-get-random-values";
import CryptoJS from "crypto-js";

// Keycloak realm endpoints derived from the issuer.
export function getEndpoints(issuer) {
  const base = `${issuer.replace(/\/$/, "")}/protocol/openid-connect`;
  return { authorization: `${base}/auth`, token: `${base}/token` };
}

function base64Url(wordArray) {
  return CryptoJS.enc.Base64.stringify(wordArray).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  global.crypto.getRandomValues(bytes);
  return base64Url(CryptoJS.lib.WordArray.create(bytes));
}

// Builds the authorize URL + the PKCE/state values the caller must retain for the token exchange.
export function buildAuthRequest(config) {
  const codeVerifier = randomToken(32);
  const codeChallenge = base64Url(CryptoJS.SHA256(codeVerifier));
  const state = randomToken(16);
  const nonce = randomToken(16);

  const params = {
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: "code",
    scope: (config.scopes || ["openid"]).join(" "),
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    nonce,
  };
  const query = Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");

  return { url: `${getEndpoints(config.issuer).authorization}?${query}`, codeVerifier, state };
}

// Parses the redirect callback URL for code / state / session_state (Keycloak returns session_state here).
export function parseCallback(callbackUrl) {
  const query = callbackUrl.includes("?") ? callbackUrl.split("?")[1].split("#")[0] : "";
  const out = {};
  query.split("&").forEach((pair) => {
    if (!pair) return;
    const [k, v] = pair.split("=");
    out[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return { code: out.code, state: out.state, sessionState: out.session_state, error: out.error };
}

// Exchanges the auth code for tokens; returns the shape SplashScreen already consumes.
export async function exchangeCodeForTokens(config, code, codeVerifier, sessionState) {
  const body = {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUrl,
    client_id: config.clientId,
    code_verifier: codeVerifier,
  };
  const form = Object.keys(body).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join("&");

  const response = await fetch(getEndpoints(config.issuer).token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`TOKEN_EXCHANGE_FAILED:${response.status}`);
  }
  const json = await response.json();
  return {
    idToken: json.id_token,
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    idTokenGuid: sessionState,
  };
}
