import { createContext, useEffect } from 'react';
import socket from '@/socket/socket';
import { useUserState } from '@/redux/hooks/useUser';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
