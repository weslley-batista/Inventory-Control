import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { rawMaterialService } from '../../services/rawMaterialService';
import { RawMaterial, RawMaterialsState } from '../../types';

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchAll',
  async () => {
    return await rawMaterialService.getAll();
  }
);

export const fetchRawMaterialById = createAsyncThunk(
  'rawMaterials/fetchById',
  async (id: number) => {
    return await rawMaterialService.getById(id);
  }
);

export const createRawMaterial = createAsyncThunk(
  'rawMaterials/create',
  async (rawMaterial: Omit<RawMaterial, 'id'>) => {
    return await rawMaterialService.create(rawMaterial);
  }
);

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, rawMaterial }: { id: number; rawMaterial: Omit<RawMaterial, 'id'> }) => {
    return await rawMaterialService.update(id, rawMaterial);
  }
);

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/delete',
  async (id: number) => {
    await rawMaterialService.delete(id);
    return id;
  }
);

const initialState: RawMaterialsState = {
  items: [],
  loading: false,
  error: null,
};

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action: PayloadAction<RawMaterial[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.error.message || 'Failed to fetch raw materials';
        state.error = errorMessage.includes('Error') ? errorMessage : `Error: ${errorMessage}`;
      })
      .addCase(createRawMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(createRawMaterial.fulfilled, (state, action: PayloadAction<RawMaterial>) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createRawMaterial.rejected, (state, action) => {
        const errorMessage = action.error.message || 'Failed to create raw material';
        state.error = errorMessage.includes('Error') ? errorMessage : `Error: ${errorMessage}`;
      })
      .addCase(updateRawMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(updateRawMaterial.fulfilled, (state, action: PayloadAction<RawMaterial>) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        const errorMessage = action.error.message || 'Failed to update raw material';
        state.error = errorMessage.includes('Error') ? errorMessage : `Error: ${errorMessage}`;
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(rm => rm.id !== action.payload);
      });
  },
});

export const { clearError } = rawMaterialsSlice.actions;
export default rawMaterialsSlice.reducer;



