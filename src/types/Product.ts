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