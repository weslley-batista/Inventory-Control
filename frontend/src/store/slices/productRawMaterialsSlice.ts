import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productRawMaterialService, CreateProductRawMaterialRequest } from '../../services/productRawMaterialService';
import { ProductRawMaterial, ProductRawMaterialsState } from '../../types';

export const fetchProductRawMaterials = createAsyncThunk(
  'productRawMaterials/fetchByProductId',
  async (productId: number) => {
    return await productRawMaterialService.getByProductId(productId);
  }
);

export const createProductRawMaterial = createAsyncThunk(
  'productRawMaterials/create',
  async ({ productId, association }: { productId: number; association: CreateProductRawMaterialRequest }) => {
    return await productRawMaterialService.create(productId, association);
  }
);

export const updateProductRawMaterial = createAsyncThunk(
  'productRawMaterials/update',
  async ({ id, association }: { id: number; association: CreateProductRawMaterialRequest }) => {
    return await productRawMaterialService.update(id, association);
  }
);

export const deleteProductRawMaterial = createAsyncThunk(
  'productRawMaterials/delete',
  async (id: number) => {
    await productRawMaterialService.delete(id);
    return id;
  }
);

const initialState: ProductRawMaterialsState = {
  items: [],
  loading: false,
  error: null,
};

const productRawMaterialsSlice = createSlice({
  name: 'productRawMaterials',
  initialState,
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductRawMaterials.fulfilled, (state, action: PayloadAction<ProductRawMaterial[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product raw materials';
      })
      .addCase(createProductRawMaterial.fulfilled, (state, action: PayloadAction<ProductRawMaterial>) => {
        state.items.push(action.payload);
      })
      .addCase(updateProductRawMaterial.fulfilled, (state, action: PayloadAction<ProductRawMaterial>) => {
        const index = state.items.findIndex(prm => prm.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProductRawMaterial.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(prm => prm.id !== action.payload);
      });
  },
});

export const { clearItems, clearError } = productRawMaterialsSlice.actions;
export default productRawMaterialsSlice.reducer;



