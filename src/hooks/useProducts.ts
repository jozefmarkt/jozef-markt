import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
}; 