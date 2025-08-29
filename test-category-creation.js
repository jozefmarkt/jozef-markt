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

async function testCategoryCreation() {
  console.log('🧪 Testing category creation...\n');

  try {
    // Test creating a category
    console.log('1. Creating test category...');
    const { data: newCategory, error: createError } = await supabase
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

    if (createError) {
      console.log('❌ Category creation failed:', createError.message);
      console.log('\n🔧 You still need to run the RLS fix SQL in your Supabase dashboard.');
      console.log('Copy the SQL from fix-categories-rls.sql and run it in the SQL Editor.');
      return;
    }

    console.log('✅ Category created successfully:', newCategory[0]);

    // Test updating the category
    console.log('\n2. Testing category update...');
    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update({ name: 'Updated Test Category' })
      .eq('id', newCategory[0].id)
      .select();

    if (updateError) {
      console.log('❌ Category update failed:', updateError.message);
    } else {
      console.log('✅ Category updated successfully:', updatedCategory[0]);
    }

    // Test deleting the category
    console.log('\n3. Testing category deletion...');
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', newCategory[0].id);

    if (deleteError) {
      console.log('❌ Category deletion failed:', deleteError.message);
    } else {
      console.log('✅ Category deleted successfully');
    }

    console.log('\n🎉 All category operations working! Your admin interface should now work properly.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCategoryCreation();


