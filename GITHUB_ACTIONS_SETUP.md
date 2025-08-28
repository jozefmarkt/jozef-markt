# 🔄 GitHub Actions Setup for Supabase Keep-Alive

## What This Does
This GitHub Actions workflow automatically pings your Supabase database every 6 days to keep it active and prevent pausing on the free tier.

## Setup Steps

### 1. Push to GitHub
Make sure your project is pushed to a GitHub repository.

### 2. Add GitHub Secrets
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_URL`: Your Supabase project URL

### 3. Update the Workflow
Edit `.github/workflows/keep-alive.yml` and replace:
- `your-project-id` with your actual Supabase project ID
- The URL should match your actual Supabase URL

### 4. Test the Workflow
1. Go to **Actions** tab in your GitHub repo
2. Click **Keep Supabase Database Active**
3. Click **Run workflow** to test it manually

## How It Works
- Runs automatically every 6 days at 2 AM UTC
- Makes a simple API call to your products table
- Keeps database active without any manual work
- Completely free using GitHub's infrastructure

## Manual Trigger
You can also run it manually anytime from the Actions tab if needed.

## Troubleshooting
- Check the Actions tab for any error logs
- Verify your GitHub secrets are set correctly
- Ensure your Supabase project is active


