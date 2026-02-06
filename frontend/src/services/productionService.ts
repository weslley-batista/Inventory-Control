import api from './api';
import { ProductionSuggestion } from '../types';

export const productionService = {
  getSuggestions: async (): Promise<ProductionSuggestion> => {
    const response = await api.get<ProductionSuggestion>('/api/production/suggestions');
    return response.data;
  },
};



