import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import productsReducer from './slices/productsSlice';
import rawMaterialsReducer from './slices/rawMaterialsSlice';
import productRawMaterialsReducer from './slices/productRawMaterialsSlice';
import productionReducer from './slices/productionSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productRawMaterials: productRawMaterialsReducer,
    production: productionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

