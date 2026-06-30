import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket', 'polling'],
  // Resilient reconnection so chat/notifications survive a backend restart
  // (Render cold starts, deploys) instead of silently dying.
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000, // start at 1s
  reconnectionDelayMax: 10000, // back off up to 10s
  randomizationFactor: 0.5,
});
export default socket;
