import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values for testing
const supabaseUrl = 'https://wsqcpoexahwqnafyvsbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWNwb2V4YWh3cW5hZnl2c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDAyMTYsImV4cCI6MjA3MDA3NjIxNn0.jKXZ2TvGdsVRiM2PvvC5BGyzTZFEIjxKFJF_PXbz4hY';

// Debug: Log environment variables
console.log('Environment variables:', {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'EXISTS' : 'MISSING'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  in_stock: boolean;
  description: string;
  nutrition: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Offer types
export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  discount_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product_ids?: string[];
  category_ids?: string[];
  image?: string;
  created_at: string;
  updated_at: string;
}

// Product service functions
export const productService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return data || [];
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }

    return data;
  },

  // Create new product (requires authentication)
  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }

    return data;
  },

  // Update product (requires authentication)
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }

    return data;
  },

  // Delete product (requires authentication)
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  },

  // Get products by category
  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }

    return data || [];
  },

  // Search products
  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }

    return data || [];
  },
};

// Offer service functions
export const offerService = {
  // Get all offers
  async getAll(): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching offers: ${error.message}`);
    }

    return data || [];
  },

  // Get active offers
  async getActive(): Promise<Offer[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching active offers: ${error.message}`);
    }

    return data || [];
  },

  // Get offer by ID
  async getById(id: string): Promise<Offer | null> {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching offer: ${error.message}`);
    }

    return data;
  },

  // Create new offer
  async create(offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .insert([offer])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating offer: ${error.message}`);
    }

    return data;
  },

  // Update offer
  async update(id: string, updates: Partial<Offer>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating offer: ${error.message}`);
    }

    return data;
  },

  // Delete offer
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting offer: ${error.message}`);
    }
  },
}; 