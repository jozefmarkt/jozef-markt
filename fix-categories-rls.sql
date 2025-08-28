-- Fix RLS policies for categories table to allow public access for testing
-- This is a temporary solution - in production, you should use proper authentication

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'categories';

-- Drop ALL existing policies on categories table
DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON categories;
DROP POLICY IF EXISTS "Allow public full access" ON categories;

-- Disable RLS temporarily to clear any issues
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policy that allows public access for all operations
CREATE POLICY "Allow public full access" ON categories
  FOR ALL USING (true) WITH CHECK (true);

-- Alternative: Create separate policies for each operation
-- CREATE POLICY "Allow public select" ON categories FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'categories';
