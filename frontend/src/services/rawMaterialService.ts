import api from './api';
import { RawMaterial } from '../types';

export const rawMaterialService = {
  getAll: async (): Promise<RawMaterial[]> => {
    const response = await api.get<RawMaterial[]>('/api/raw-materials');
    return response.data;
  },

  getById: async (id: number): Promise<RawMaterial> => {
    const response = await api.get<RawMaterial>(`/api/raw-materials/${id}`);
    return response.data;
  },

  create: async (rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> => {
    const response = await api.post<RawMaterial>('/api/raw-materials', rawMaterial);
    return response.data;
  },

  update: async (id: number, rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> => {
    const response = await api.put<RawMaterial>(`/api/raw-materials/${id}`, rawMaterial);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/raw-materials/${id}`);
  },
};



