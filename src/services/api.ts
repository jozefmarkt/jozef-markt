import axios from 'axios';
import { Product } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5174',
  timeout: 5000, // 5 second timeout
});

// Fallback data when API is not available
const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Organic Tomatoes",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
    inStock: true,
    description: "Juicy, vine-ripened organic tomatoes perfect for salads, sauces, and fresh eating. Grown locally without pesticides.",
    nutrition: "Energy 18 kcal/100g, Protein 0.9g/100g, Carbohydrates 3.9g/100g",
    category: "Vegetables"
  },
  {
    id: "2",
    name: "Whole Grain Bread",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    inStock: true,
    description: "Artisan whole grain bread made with stone-ground flour. Rich in fiber and nutrients, perfect for healthy sandwiches.",
    nutrition: "Energy 247 kcal/100g, Protein 9g/100g, Carbohydrates 49g/100g, Fiber 7g/100g",
    category: "Bakery"
  },
  {
    id: "3",
    name: "Premium Dutch Cheese",
    price: 8.75,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    inStock: false,
    description: "Aged Dutch Gouda cheese with rich, nutty flavor and smooth texture. Perfect for cheese boards and cooking.",
    nutrition: "Energy 356 kcal/100g, Protein 25g/100g, Fat 28g/100g, Calcium 700mg/100g",
    category: "Cheese"
  },
  {
    id: "4",
    name: "Fresh Milk 1L",
    price: 1.29,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
    inStock: true,
    description: "Fresh, pasteurized whole milk from local dairy farms. Rich in calcium and essential nutrients for daily nutrition.",
    nutrition: "Energy 64 kcal/100ml, Protein 3.4g/100ml, Fat 3.6g/100ml, Calcium 120mg/100ml",
    category: "Dairy"
  }
];

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.warn('API server not available, using fallback data:', error);
      return fallbackProducts;
    }
  },
  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API server not available, using fallback data:', error);
      const fallbackProduct = fallbackProducts.find(p => p.id === id);
      if (!fallbackProduct) {
        throw new Error(`Product with id ${id} not found`);
      }
      return fallbackProduct;
    }
  },
  create: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.warn('API server not available, creating product locally:', error);
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData,
      };
      // Add to fallback data for consistency
      fallbackProducts.push(newProduct);
      return newProduct;
    }
  },
  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.warn('API server not available, updating product locally:', error);
      const productIndex = fallbackProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      const updatedProduct = { ...fallbackProducts[productIndex], ...productData };
      fallbackProducts[productIndex] = updatedProduct;
      return updatedProduct;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.warn('API server not available, deleting product locally:', error);
      const productIndex = fallbackProducts.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      fallbackProducts.splice(productIndex, 1);
    }
  },
};

export default api; 