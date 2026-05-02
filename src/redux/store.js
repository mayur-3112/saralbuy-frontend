import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slices/category.slice';
import userReducer from './slices/user.slice';
export const store = configureStore({
  reducer: {
    category: categoryReducer,
    user: userReducer,
  },
});
