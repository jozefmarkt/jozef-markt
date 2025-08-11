-- Add Arabic language fields to products table
ALTER TABLE products 
ADD COLUMN name_ar VARCHAR(255),
ADD COLUMN description_ar TEXT,
ADD COLUMN nutrition_ar TEXT;

-- Add featured field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'featured') THEN
        ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing products with Arabic translations (optional - you can fill these in manually)
-- Example:
-- UPDATE products SET 
--   name_ar = 'طماطم عضوية طازجة',
--   description_ar = 'طماطم عضوية ناضجة على الكرمة مثالية للسلطات والصلصات والأكل الطازج. تزرع محلياً بدون مبيدات.',
--   nutrition_ar = 'الطاقة 18 سعرة/100غ، البروتين 0.9غ/100غ، الكربوهيدرات 3.9غ/100غ'
-- WHERE name = 'Fresh Organic Tomatoes';
