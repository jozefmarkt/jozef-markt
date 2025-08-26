-- Migration to update offers table schema
-- Replace discount_percentage and discount_amount with price, price_before, and price_after

-- Add new columns
ALTER TABLE offers ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS price_before DECIMAL(10,2);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS price_after DECIMAL(10,2);

-- Update existing data (optional - you may want to handle this differently)
-- This sets a default price based on discount_percentage if it exists
UPDATE offers 
SET price = CASE 
    WHEN discount_percentage > 0 THEN 10.00  -- Default price, adjust as needed
    ELSE 0.00
END
WHERE price = 0;

-- Drop old columns (uncomment when ready to remove old fields)
-- ALTER TABLE offers DROP COLUMN IF EXISTS discount_percentage;
-- ALTER TABLE offers DROP COLUMN IF EXISTS discount_amount;

-- Add comments for documentation
COMMENT ON COLUMN offers.price IS 'Current price of the offer';
COMMENT ON COLUMN offers.price_before IS 'Original price before discount (optional)';
COMMENT ON COLUMN offers.price_after IS 'Price after discount (optional)';

