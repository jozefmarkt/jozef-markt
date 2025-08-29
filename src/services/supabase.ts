import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product types
export interface Product {
  id: string;
  name: string;
  name_nl?: string; // Dutch name
  name_ar?: string; // Arabic name
  price: number;
  image: string;
  in_stock: boolean;
  description: string;
  description_nl?: string; // Dutch description
  description_ar?: string; // Arabic description
  nutrition: string;
  nutrition_nl?: string; // Dutch nutrition info
  nutrition_ar?: string; // Arabic nutrition info
  category: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Offer types
export interface Offer {
  id: string;
  title: string;
  title_nl?: string; // Dutch title
  title_ar?: string; // Arabic title
  description: string;
  description_nl?: string; // Dutch description
  description_ar?: string; // Arabic description
  price: number;
  price_before?: number;
  price_after?: number;
  start_date: string;
  end_date: string;
  valid_until?: string;
  is_active: boolean;
  product_ids?: string[];
  category_ids?: string[];
  image?: string;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  name_nl?: string; // Dutch name
  name_ar?: string; // Arabic name
  color: string;
  icon: string;
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

  // Get featured products
  async getFeatured(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching featured products: ${error.message}`);
    }

    return data || [];
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

  // Toggle featured status
  async toggleFeatured(id: string, featured: boolean): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ featured })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating featured status: ${error.message}`);
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
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%,description_ar.ilike.%${query}%`)
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

// Category service functions
export const categoryService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    return data || [];
  },

  // Get category by ID
  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching category: ${error.message}`);
    }

    return data;
  },

  // Create new category
  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }

    return data;
  },

  // Update category
  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }

    return data;
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },
}; 