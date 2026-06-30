import { createContext, useEffect } from 'react';
import socket from '@/socket/socket';
import { useUserState } from '@/redux/hooks/useUser';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { user } = useUserState();

  useEffect(() => {
    // Only hold a socket connection while authenticated. Connecting without a
    // valid auth cookie just triggers an endless auth-fail reconnect storm.
    if (user?._id) {
      if (!socket.connected) socket.connect();
    } else {
      if (socket.connected) socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
