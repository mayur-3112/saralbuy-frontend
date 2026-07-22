import { useState } from 'react';
import { toast } from 'sonner';
import Sentry from '@/config/sentry.js';
export const useFetch = cb => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [showToast,setShowToast] = useState<boolean>(true);
  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
      setLoading(false);
      setError(null);
      return response;
    } catch (err) {
      console.log(err?.response || err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        err;
      console.log(message);
      // Report genuine failures (no response at all — network/timeout — or
      // a 5xx server error), not expected validation 400s (wrong OTP,
      // duplicate email, etc.) — those aren't bugs, they're normal flow,
      // and capturing them would drown real signal in Sentry.
      const status = err?.response?.status;
      if (!status || status >= 500) {
        const requestId = err?.config?.headers?.['X-Request-Id'];
        Sentry.withScope(scope => {
          if (requestId) scope.setTag('request_id', requestId);
          Sentry.captureException(err);
        });
      }
      if (message === 'Token not found') {
        // message = 'Session expired, please login again'
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
      if (message !== 'Token not found') {
        toast.error(message);
      }
      setError(message);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, fn, error, setData, setError };
};
