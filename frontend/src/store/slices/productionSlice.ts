import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productionService } from '../../services/productionService';
import { ProductionSuggestion, ProductionState } from '../../types';

export const fetchProductionSuggestions = createAsyncThunk(
  'production/fetchSuggestions',
  async () => {
    return await productionService.getSuggestions();
  }
);

const initialState: ProductionState = {
  suggestions: null,
  loading: false,
  error: null,
};

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action: PayloadAction<ProductionSuggestion>) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch production suggestions';
      });
  },
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer;



