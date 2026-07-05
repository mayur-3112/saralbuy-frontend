import React, { useEffect } from 'react';
import { useDispatchUser } from './redux/hooks/useUser';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes';

export const App = () => {
  const { dispatchUser } = useDispatchUser();

  useEffect(() => {
    dispatchUser();
  }, []);

  return <RouterProvider router={router} />;
};
