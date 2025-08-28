-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_nl VARCHAR(255), -- Dutch name
  name_ar VARCHAR(255), -- Arabic name
  color VARCHAR(7) NOT NULL DEFAULT '#4ade80', -- Hex color code
  icon VARCHAR(10) NOT NULL DEFAULT '📦', -- Emoji icon
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin)
CREATE POLICY "Allow authenticated users full access" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_categories_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, name_nl, name_ar, color, icon) VALUES
  ('Vegetables', 'Groenten', 'خضروات', '#4ade80', '🥬'),
  ('Fruits', 'Fruit', 'فواكه', '#fbbf24', '🍎'),
  ('Dairy', 'Zuivel', 'منتجات الألبان', '#60a5fa', '🥛'),
  ('Bakery', 'Bakkerij', 'مخبز', '#f87171', '🍞'),
  ('Meat', 'Vlees', 'لحوم', '#a78bfa', '🥩'),
  ('Cheese', 'Kaas', 'جبن', '#fb7185', '🧀'),
  ('Beverages', 'Dranken', 'مشروبات', '#34d399', '🥤'),
  ('Snacks', 'Snacks', 'وجبات خفيفة', '#f59e0b', '🍪'),
  ('Preserves', 'Conserven', 'معلبات', '#4ade80', '📦');

