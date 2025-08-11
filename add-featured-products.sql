-- Add featured field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create index for better performance when querying featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Update existing products to have featured = false by default
UPDATE products SET featured = FALSE WHERE featured IS NULL;
