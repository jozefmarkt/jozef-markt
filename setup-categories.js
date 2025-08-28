import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://wsqcpoexahwqnafyvsbh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWNwb2V4YWh3cW5hZnl2c2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUwMDIxNiwiZXhwIjoyMDcwMDc2MjE2fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // You'll need to get this from your Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCategories() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./categories-schema.sql', 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
    } else {
      console.log('Categories table created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

setupCategories();

