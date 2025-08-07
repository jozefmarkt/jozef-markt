import { productService } from './supabase';
import type { Product } from './supabase';

// Re-export the Product type for compatibility
export type { Product } from './supabase';

// Use the Supabase product service directly
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      return await productService.getAll();
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const product = await productService.getById(id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      console.error('Error fetching product from Supabase:', error);
      throw error;
    }
  },

  create: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    try {
      return await productService.create(productData);
    } catch (error) {
      console.error('Error creating product in Supabase:', error);
      throw error;
    }
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      return await productService.update(id, productData);
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await productService.delete(id);
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
      throw error;
    }
  },

  // Additional methods from Supabase service
  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      return await productService.getByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category from Supabase:', error);
      throw error;
    }
  },

  search: async (query: string): Promise<Product[]> => {
    try {
      return await productService.search(query);
    } catch (error) {
      console.error('Error searching products in Supabase:', error);
      throw error;
    }
  }
};

// Export the Supabase client for direct access if needed
export { supabase } from './supabase'; 