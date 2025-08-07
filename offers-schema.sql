-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  product_ids UUID[],
  category_ids VARCHAR(255)[],
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active offers
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active, start_date, end_date);

-- Create index for offer dates
CREATE INDEX IF NOT EXISTS idx_offers_dates ON offers(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active offers" ON offers;
DROP POLICY IF EXISTS "Authenticated users can manage offers" ON offers;
DROP POLICY IF EXISTS "Allow all operations on offers" ON offers;

-- Create policy for public read access to active offers
CREATE POLICY "Public can view active offers" ON offers
  FOR SELECT USING (is_active = true AND NOW() >= start_date AND NOW() <= end_date);

-- Create policy for all users to manage offers (temporary for development)
-- In production, this should be restricted to admin users only
CREATE POLICY "Allow all operations on offers" ON offers
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 