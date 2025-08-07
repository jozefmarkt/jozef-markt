# 🚀 Supabase Setup Guide for Jozef Supermarkt

## 📋 Prerequisites
- Supabase account (free at [supabase.com](https://supabase.com))
- Your existing React project

## 🎯 Step-by-Step Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `jozef-supermarkt`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

### Step 2: Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `your-anon-key-here`
   - **Service Role Key**: `your-service-role-key-here`

### Step 3: Set Up Environment Variables
1. Create a `.env` file in your project root (jozef-markt folder)
2. Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` file
3. Paste and run the SQL
4. This will create:
   - `products` table with all your current data
   - Row Level Security (RLS) policies
   - Automatic timestamp updates

### Step 5: Test Your Setup
1. Start your development server:
```bash
npm run dev
```
2. Check the browser console for any errors
3. Your products should now load from Supabase instead of JSON Server

## 🔄 Migration from JSON Server

### What's Changed:
- ✅ Supabase client installed (`@supabase/supabase-js`)
- ✅ New service file: `src/services/supabase.ts`
- ✅ Updated hooks: `src/hooks/useProducts.ts`
- ✅ Environment variables configured
- ✅ Database schema ready

### What You Need to Do:
1. **Create Supabase project** (Step 1 above)
2. **Add environment variables** (Step 3 above)
3. **Run the SQL schema** (Step 4 above)
4. **Test the application** (Step 5 above)

## 🎯 Benefits of Supabase

### ✅ Advantages:
- **Real-time updates** with subscriptions
- **Built-in authentication** system
- **Row Level Security** for data protection
- **Automatic API generation**
- **Database backups** and versioning
- **Scalable** PostgreSQL database
- **Free tier** with generous limits

### 🔧 Features You Can Add Later:
- User authentication
- Real-time product updates
- Admin dashboard with real-time data
- Image uploads to Supabase Storage
- Advanced search and filtering

## 🚨 Troubleshooting

### Common Issues:
1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists
   - Verify variable names start with `VITE_`
   - Restart your dev server after adding env vars

2. **"Error fetching products"**
   - Check your Supabase URL and keys
   - Verify the `products` table exists
   - Check RLS policies are set correctly

3. **"CORS errors"**
   - Supabase handles CORS automatically
   - Check your Supabase project settings

## 📞 Next Steps

After setup is complete:
1. Test all product functionality
2. Consider adding authentication
3. Set up real-time subscriptions
4. Configure image uploads
5. Add admin features

## 🎉 You're Ready!

Your Jozef Supermarkt website is now powered by Supabase! 🚀 