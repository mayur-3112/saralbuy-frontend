import authService from '@/services/auth.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const repsonse = await authService.userProfile();

    return repsonse;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      console.log('UPDATE REDUX STATE------------>', action.payload);
      state.user = action.payload;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
