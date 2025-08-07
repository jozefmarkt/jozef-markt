import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/supabase';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}; 