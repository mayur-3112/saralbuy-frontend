import { useState } from 'react';
import { toast } from 'sonner';
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
    } catch (error) {
      console.log(error?.response || error);
      error =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error.message ||
        error;
      console.log(error);
      if (error === 'Token not found') {
        // error = 'Session expired, please login again'
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
      if (error !== 'Token not found') {
        toast.error(error);
      }
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, fn, error, setData, setError };
};
