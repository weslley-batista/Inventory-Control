import axios, { AxiosError } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? (error.response.data as any).message
        : `Error: Request failed with status code ${status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Error: Network error - no response received'));
    } else {
      return Promise.reject(new Error(`Error: ${error.message}`));
    }
  }
);

export default api;



