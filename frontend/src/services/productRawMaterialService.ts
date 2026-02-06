import api from './api';
import { ProductRawMaterial } from '../types';

export interface CreateProductRawMaterialRequest {
  rawMaterialId: number;
  requiredQuantity: number;
}

export const productRawMaterialService = {
  getByProductId: async (productId: number): Promise<ProductRawMaterial[]> => {
    const response = await api.get<ProductRawMaterial[]>(`/api/products/${productId}/raw-materials`);
    return response.data;
  },

  create: async (productId: number, association: CreateProductRawMaterialRequest): Promise<ProductRawMaterial> => {
    const response = await api.post<ProductRawMaterial>(`/api/products/${productId}/raw-materials`, association);
    return response.data;
  },

  update: async (id: number, association: CreateProductRawMaterialRequest): Promise<ProductRawMaterial> => {
    const response = await api.put<ProductRawMaterial>(`/api/product-raw-materials/${id}`, association);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/product-raw-materials/${id}`);
  },
};



