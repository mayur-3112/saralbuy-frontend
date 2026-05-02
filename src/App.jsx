import React, { useEffect } from 'react';
import { useDispatchUser } from './redux/hooks/useUser';
import AppRoutes from './Routes';

export const App = () => {
  const { dispatchUser } = useDispatchUser();

  useEffect(() => {
    dispatchUser();
  }, []);

  return <AppRoutes />;
};
