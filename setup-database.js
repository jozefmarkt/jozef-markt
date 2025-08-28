import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsqcpoexahwqnafyvsbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWNwb2V4YWh3cW5hZnl2c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDAyMTYsImV4cCI6MjA3MDA3NjIxNn0.jKXZ2TvGdsVRiM2PvvC5BGyzTZFEIjxKFJF_PXbz4hY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Check if categories table exists
    console.log('1. Checking categories table...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (categoriesError) {
      console.log('❌ Categories table does not exist or is not accessible');
      console.log('Error:', categoriesError.message);
      console.log('\n📋 To create the categories table:');
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste the SQL from categories-schema.sql');
      console.log('5. Run the SQL');
    } else {
      console.log('✅ Categories table exists');
      
      // Try to get all categories
      const { data: allCategories, error: fetchError } = await supabase
        .from('categories')
        .select('*');
      
      if (fetchError) {
        console.log('❌ Error fetching categories:', fetchError.message);
      } else {
        console.log(`📊 Found ${allCategories.length} categories`);
        if (allCategories.length > 0) {
          console.log('Sample categories:');
          allCategories.slice(0, 3).forEach(cat => {
            console.log(`  - ${cat.name} (${cat.icon})`);
          });
        }
      }
    }

    // Check if products table exists
    console.log('\n2. Checking products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (productsError) {
      console.log('❌ Products table does not exist or is not accessible');
      console.log('Error:', productsError.message);
    } else {
      console.log('✅ Products table exists');
      
      const { data: allProducts, error: fetchProductsError } = await supabase
        .from('products')
        .select('*');
      
      if (fetchProductsError) {
        console.log('❌ Error fetching products:', fetchProductsError.message);
      } else {
        console.log(`📊 Found ${allProducts.length} products`);
      }
    }

    console.log('\n🎉 Database check completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseSetup();

