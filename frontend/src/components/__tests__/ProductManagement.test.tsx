import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import ProductManagement from '../ProductManagement';
import productsReducer from '../../store/slices/productsSlice';
import rawMaterialsReducer from '../../store/slices/rawMaterialsSlice';
import productRawMaterialsReducer from '../../store/slices/productRawMaterialsSlice';
import { Product, RawMaterial } from '../../types';
import * as productService from '../../services/productService';
import * as rawMaterialService from '../../services/rawMaterialService';

jest.mock('../../services/productService', () => ({
  productService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../services/rawMaterialService', () => ({
  rawMaterialService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const createMockStore = (initialState: {
  products?: Product[];
  rawMaterials?: RawMaterial[];
  associations?: any[];
} = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      rawMaterials: rawMaterialsReducer,
      productRawMaterials: productRawMaterialsReducer,
    },
    preloadedState: {
      products: {
        items: initialState.products || [],
        loading: false,
        error: null,
      },
      rawMaterials: {
        items: initialState.rawMaterials || [],
        loading: false,
        error: null,
      },
      productRawMaterials: {
        items: initialState.associations || [],
        loading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState: {
  products?: Product[];
  rawMaterials?: RawMaterial[];
  associations?: any[];
} = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('ProductManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.productService.getAll as jest.Mock).mockResolvedValue([]);
    (rawMaterialService.rawMaterialService.getAll as jest.Mock).mockResolvedValue([]);
  });

  test('renders product management page', async () => {
    renderWithProviders(<ProductManagement />);
    
    expect(screen.getByText('Product Management')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(productService.productService.getAll).toHaveBeenCalled();
    });
  });

  test('displays products list', async () => {
    const mockProducts = [
      { id: 1, code: 'PROD001', name: 'Product 1', value: 100.0 },
      { id: 2, code: 'PROD002', name: 'Product 2', value: 200.0 },
    ];
    
    const initialState = {
      products: mockProducts,
    };

    (productService.productService.getAll as jest.Mock).mockResolvedValue(mockProducts);

    renderWithProviders(<ProductManagement />, initialState);
    
    await waitFor(() => {
      expect(screen.getByText('PROD001')).toBeInTheDocument();
    });
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('PROD002')).toBeInTheDocument();
  });

  test('displays empty state when no products', async () => {
    renderWithProviders(<ProductManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  test('shows add product button', async () => {
    renderWithProviders(<ProductManagement />);
    
    expect(screen.getByText('Add Product')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(productService.productService.getAll).toHaveBeenCalled();
    });
  });
});



