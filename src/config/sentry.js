import * as Sentry from '@sentry/react';

// Inert until VITE_SENTRY_DSN is set (Vite only exposes VITE_-prefixed env
// vars to client code) — mirrors the backend's same "safe until configured"
// pattern in src/config/sentry.js there.
const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
} else {
  console.warn('[WARN] VITE_SENTRY_DSN is not set — error tracking is disabled.');
}

export default Sentry;
export const sentryEnabled = Boolean(dsn);
