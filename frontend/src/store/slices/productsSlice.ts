import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import { Product, ProductsState } from '../../types';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    return await productService.getAll();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number) => {
    return await productService.getById(id);
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: Omit<Product, 'id'>) => {
    return await productService.create(product);
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, product }: { id: number; product: Omit<Product, 'id'> }) => {
    return await productService.update(id, product);
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number) => {
    await productService.delete(id);
    return id;
  }
);

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.error.message || 'Failed to fetch products';
        state.error = errorMessage.includes('Error') ? errorMessage : `Error: ${errorMessage}`;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;



