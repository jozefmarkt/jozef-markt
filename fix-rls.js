import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsqcpoexahwqnafyvsbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWNwb2V4YWh3cW5hZnl2c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDAyMTYsImV4cCI6MjA3MDA3NjIxNn0.jKXZ2TvGdsVRiM2PvvC5BGyzTZFEIjxKFJF_PXbz4hY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixRLS() {
  console.log('🔧 Fixing RLS policies for categories table...\n');

  try {
    // Test if we can read categories (this should work)
    console.log('1. Testing read access...');
    const { data: readTest, error: readError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (readError) {
      console.log('❌ Read access failed:', readError.message);
    } else {
      console.log('✅ Read access works');
    }

    // Test if we can insert a category (this should fail with current RLS)
    console.log('\n2. Testing insert access...');
    const { data: insertTest, error: insertError } = await supabase
      .from('categories')
      .insert([
        {
          name: 'Test Category for RLS',
          name_nl: 'Test Categorie',
          name_ar: 'فئة تجريبية',
          color: '#4ade80',
          icon: '📦'
        }
      ])
      .select();

    if (insertError) {
      console.log('❌ Insert access failed (expected):', insertError.message);
      console.log('\n📋 You need to run the RLS fix SQL in your Supabase dashboard:');
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste the SQL from fix-categories-rls.sql');
      console.log('5. Run the SQL');
    } else {
      console.log('✅ Insert access works');
      
      // Clean up the test category
      await supabase
        .from('categories')
        .delete()
        .eq('name', 'Test Category for RLS');
      
      console.log('🧹 Test category cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixRLS();

