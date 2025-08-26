# Setting Up Multilingual Offers

## Issue
Offers are staying in English because the database doesn't have the multilingual fields yet.

## Solution Steps

### 1. Run Database Migration
Execute the SQL migration to add multilingual columns:

```sql
-- Run this in your database
\i add-multilingual-offers.sql
```

Or manually run:
```sql
-- Add new multilingual columns
ALTER TABLE offers ADD COLUMN IF NOT EXISTS title_nl VARCHAR(255);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS description_nl TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Update existing offers to copy current title/description to all languages
UPDATE offers 
SET title_nl = title,
    title_ar = title,
    description_nl = description,
    description_ar = description
WHERE title_nl IS NULL OR title_ar IS NULL OR description_nl IS NULL OR description_ar IS NULL;
```

### 2. Verify Migration
Check that the columns were added:
```sql
-- Check table structure
\d offers

-- Check existing data
SELECT id, title, title_nl, title_ar, description, description_nl, description_ar 
FROM offers LIMIT 5;
```

### 3. Test Language Switching
After running the migration:
1. Go to the Offers page
2. Switch languages using the language switcher
3. Check the browser console for debug logs
4. Offers should now display in the selected language

### 4. Update Offer Content (Optional)
To have proper translations instead of just copied English text:
1. Go to Admin → Offers
2. Edit each offer
3. Fill in the Dutch and Arabic fields with proper translations
4. Save the changes

## Debug Information
The Offers page now includes console logging to help debug:
- Check browser console for offer data structure
- Verify that multilingual fields exist and have content
- Confirm language switching is working

## Expected Result
After migration, offers should automatically display in the user's selected language, with fallback to English if translations are missing.



