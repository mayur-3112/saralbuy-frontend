import categoryService from '@/services/category.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await categoryService.getCategories();
  return response;
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});
export default categorySlice.reducer;
