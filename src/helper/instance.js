import axios from 'axios';
let url =import.meta.env.VITE_API_BACKEND_URL;

const instance = axios.create({
  baseURL: url,
  withCredentials: true,
});
instance.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    if (status === 401 && message === 'Token not found') {
      window.dispatchEvent(new Event('session-expired'));
    }
    return Promise.reject(error);
  }
);
export default instance;
