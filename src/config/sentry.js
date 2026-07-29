import * as Sentry from '@sentry/react';

// Inert until VITE_SENTRY_DSN is set (Vite only exposes VITE_-prefixed env
// vars to client code) — mirrors the backend's same "safe until configured"
// pattern in src/config/sentry.js there.
const dsn = import.meta.env.VITE_SENTRY_DSN;

// Mirrors the backend's redaction list — a failed OTP/auth/verification
// request's body (phone number, OTP, GSTIN/PAN) shouldn't leave the browser
// unredacted just because Sentry happened to capture the surrounding error.
const SENSITIVE_KEYS = ['otp', 'pno', 'phone', 'gstin', 'pan', 'password', 'authtoken', 'admintoken', 'token'];

function redactSensitiveKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      obj[key] = '[Redacted]';
    } else if (typeof obj[key] === 'object') {
      redactSensitiveKeys(obj[key]);
    }
  }
  return obj;
}

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request) {
        redactSensitiveKeys(event.request.data);
        if (event.request.headers) delete event.request.headers.cookie;
      }
      redactSensitiveKeys(event.extra);
      return event;
    },
  });
} else {
  console.warn('[WARN] VITE_SENTRY_DSN is not set — error tracking is disabled.');
}

export default Sentry;
export const sentryEnabled = Boolean(dsn);
