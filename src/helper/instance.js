import axios from 'axios';

const url = import.meta.env.VITE_API_BACKEND_URL;
if (!url) {
  // Surface a misconfigured env early instead of silently hitting `undefined`.
  console.error(
    '[config] VITE_API_BACKEND_URL is not set — API requests will fail. Check your .env file.'
  );
}

const instance = axios.create({
  baseURL: url,
  withCredentials: true,
  timeout: 30000, // 30s — fail loudly instead of hanging forever
});

// Any of these 401 messages mean the session is no longer valid (missing,
// invalid, or expired token) — prompt the user to re-authenticate.
const SESSION_EXPIRED_MESSAGES = new Set([
  'Token not found',
  'Invalid token',
  'Invalid or expired token',
]);

instance.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    if (status === 401 && SESSION_EXPIRED_MESSAGES.has(message)) {
      window.dispatchEvent(new Event('session-expired'));
    }
    return Promise.reject(error);
  }
);
export default instance;
