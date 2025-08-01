import axios from 'axios';
import { Product } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5174',
});

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

export default api; 