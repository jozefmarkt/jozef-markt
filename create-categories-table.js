import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createCategoriesTable() {
  try {
    // First, let's try to insert a test category to see if the table exists
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: 'Test Category',
          name_nl: 'Test Categorie',
          name_ar: 'فئة تجريبية',
          color: '#4ade80',
          icon: '📦'
        }
      ])
      .select();

    if (error) {
      console.log('Table might not exist or there was an error:', error.message);
      console.log('You need to create the categories table in your Supabase dashboard.');
      console.log('Go to your Supabase project > SQL Editor and run the SQL from categories-schema.sql');
    } else {
      console.log('Categories table exists and test category created:', data);
      
      // Clean up the test category
      await supabase
        .from('categories')
        .delete()
        .eq('name', 'Test Category');
      
      console.log('Test category cleaned up');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createCategoriesTable();


