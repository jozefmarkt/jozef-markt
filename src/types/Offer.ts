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
  is_active: boolean;
  product_ids?: string[];
  category_ids?: string[];
  image?: string;
  created_at: string;
  updated_at: string;
}



