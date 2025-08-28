-- Migration to add multilingual support for offers
-- Add Dutch and Arabic fields for title and description

-- Add new multilingual columns
ALTER TABLE offers ADD COLUMN IF NOT EXISTS title_nl VARCHAR(255);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS description_nl TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Add comments for documentation
COMMENT ON COLUMN offers.title_nl IS 'Dutch title for the offer';
COMMENT ON COLUMN offers.title_ar IS 'Arabic title for the offer';
COMMENT ON COLUMN offers.description_nl IS 'Dutch description for the offer';
COMMENT ON COLUMN offers.description_ar IS 'Arabic description for the offer';

-- Update existing offers to copy current title/description to default language
-- This ensures existing offers continue to work
UPDATE offers 
SET title_nl = title,
    title_ar = title,
    description_nl = description,
    description_ar = description
WHERE title_nl IS NULL OR title_ar IS NULL OR description_nl IS NULL OR description_ar IS NULL;




