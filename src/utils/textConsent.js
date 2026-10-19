export const TEXT_SUPPORT_NUMBER = "1-877-692-2253";

export const TEXT_DISCLAIMER_SUBSCRIBED = `You're subscribed to Sparklight text alerts. Message frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to cancel. Questions? Call ${TEXT_SUPPORT_NUMBER}.`;

export const TEXT_DISCLAIMER_SUBSCRIBING = `You're subscribing to Sparklight text alerts. Message frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to cancel. Questions? Call ${TEXT_SUPPORT_NUMBER}.`;

export const CONSENT_LABEL = "I agree to the Text Messaging Terms & Conditions and Privacy Policy.";

export const CONSENT_ERROR = "Please agree to the Text Messaging Terms & Conditions and Privacy Policy to continue.";

// Spoken by the checkbox itself while the error shows, so one focus move reads both.
export const CONSENT_LABEL_WITH_ERROR = `${CONSENT_LABEL} Error: ${CONSENT_ERROR}`;

// Digits only, with a leading US country code dropped, so "(555) 123-4567" and "15551234567" compare equal.
export const normalizePhoneDigits = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
};

export const isSamePhoneNumber = (a, b) => normalizePhoneDigits(a) === normalizePhoneDigits(b);

export const isCompletePhoneNumber = (value) => normalizePhoneDigits(value).length === 10;
