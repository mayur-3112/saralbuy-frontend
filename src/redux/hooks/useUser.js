import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../slices/user.slice';
import { setUser } from '../slices/user.slice';

export const useDispatchUser = () => {
  const dispatch = useDispatch();
  return {
    dispatchUser: () => dispatch(fetchUser()).unwrap(),
    updateUserState: payload => dispatch(setUser(payload)),
  };
};

export const useUserState = () => {
  const user = useSelector(state => state.user);
  return user;
};
