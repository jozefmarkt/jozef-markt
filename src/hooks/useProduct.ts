import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}; 