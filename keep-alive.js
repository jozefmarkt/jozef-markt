#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
  try {
    console.log('🔄 Pinging Supabase database...');
    
    // Simple query to keep database active
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database pinged successfully');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('🔄 Next ping in 6 days');
    
  } catch (error) {
    console.error('❌ Error pinging database:', error.message);
    process.exit(1);
  }
}

// Run the keep-alive function
keepAlive();
