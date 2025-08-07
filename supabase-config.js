// Supabase Configuration
// Replace these with your actual Supabase project credentials

export const supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  serviceRoleKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
};

// Environment variables to add to your .env file:
/*
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
*/ 