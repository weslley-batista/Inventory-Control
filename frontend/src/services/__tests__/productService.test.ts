import { Product } from '../../types';
import '@testing-library/jest-dom';
import api from '../api';
import { productService } from '../productService';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));


const mockApi = api as jest.Mocked<typeof api>;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll fetches all products', async () => {
    const mockProducts: Product[] = [
      { id: 1, code: 'PROD001', name: 'Product 1', value: 100.0 },
      { id: 2, code: 'PROD002', name: 'Product 2', value: 200.0 },
    ];

    mockApi.get.mockResolvedValue({ data: mockProducts } as any);

    const result = await productService.getAll();

    expect(mockApi.get).toHaveBeenCalledWith('/api/products');
    expect(result).toEqual(mockProducts);
  });

  test('getById fetches product by id', async () => {
    const mockProduct: Product = { id: 1, code: 'PROD001', name: 'Product 1', value: 100.0 };

    mockApi.get.mockResolvedValue({ data: mockProduct } as any);

    const result = await productService.getById(1);

    expect(mockApi.get).toHaveBeenCalledWith('/api/products/1');
    expect(result).toEqual(mockProduct);
  });

  test('create creates a new product', async () => {
    const newProduct = { code: 'PROD003', name: 'Product 3', value: 300.0 };
    const createdProduct: Product = { id: 3, ...newProduct };

    mockApi.post.mockResolvedValue({ data: createdProduct } as any);

    const result = await productService.create(newProduct);

    expect(mockApi.post).toHaveBeenCalledWith('/api/products', newProduct);
    expect(result).toEqual(createdProduct);
  });

  test('update updates an existing product', async () => {
    const updatedProduct = { code: 'PROD001', name: 'Updated Product', value: 150.0 };
    const responseProduct: Product = { id: 1, ...updatedProduct };

    mockApi.put.mockResolvedValue({ data: responseProduct } as any);

    const result = await productService.update(1, updatedProduct);

    expect(mockApi.put).toHaveBeenCalledWith('/api/products/1', updatedProduct);
    expect(result).toEqual(responseProduct);
  });

  test('delete deletes a product', async () => {
    mockApi.delete.mockResolvedValue({} as any);

    await productService.delete(1);

    expect(mockApi.delete).toHaveBeenCalledWith('/api/products/1');
  });
});



