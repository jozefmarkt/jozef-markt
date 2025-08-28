# Multilingual Offers Feature

## Overview
This feature adds multilingual support for offers, allowing administrators to create offers in English, Dutch, and Arabic, similar to how products work.

## What's Been Implemented

### 1. Database Schema Updates
- **File**: `add-multilingual-offers.sql`
- **Changes**: Added new columns to the offers table:
  - `title_nl` - Dutch title
  - `title_ar` - Arabic title  
  - `description_nl` - Dutch description
  - `description_ar` - Arabic description

### 2. TypeScript Types
- **File**: `src/types/Offer.ts`
- **New Interface**: `Offer` with multilingual fields
- **Exported**: Added to `src/types/index.ts`

### 3. Admin Form Updates
- **File**: `src/components/admin/OfferForm.tsx`
- **Changes**: 
  - Added multilingual title fields (English, Dutch, Arabic)
  - Added multilingual description fields (English, Dutch, Arabic)
  - Updated form data interface to include new fields
  - Updated form submission to handle multilingual data

### 4. Localization Updates
- **Files**: 
  - `public/locales/en/admin.json`
  - `public/locales/nl/admin.json`
  - `public/locales/ar/admin.json`
- **Changes**: Added translation keys for multilingual fields

### 5. Frontend Display Updates
- **File**: `src/pages/Offers/index.tsx`
- **Changes**: 
  - Updated to display offers in the current language
  - Falls back to English if translation not available
  - Supports RTL for Arabic text

## How It Works

### For Administrators
1. When creating/editing an offer, admins can now input:
   - Title in English (required)
   - Title in Dutch (optional)
   - Title in Arabic (optional)
   - Description in English (required)
   - Description in Dutch (optional)
   - Description in Arabic (optional)

2. The form automatically saves all language versions

### For Users
1. Offers are displayed in the user's selected language
2. If a translation isn't available, it falls back to English
3. Arabic text is properly displayed with RTL support

## Database Migration

To apply the database changes, run:
```sql
-- Run the migration file
\i add-multilingual-offers.sql
```

## Usage Examples

### Creating a Multilingual Offer
```typescript
const offerData = {
  title: "Summer Sale - 20% Off",
  title_nl: "Zomeruitverkoop - 20% Korting", 
  title_ar: "عرض الصيف - خصم 20%",
  description: "Get amazing discounts on summer products",
  description_nl: "Krijg geweldige kortingen op zomerproducten",
  description_ar: "احصل على خصومات مذهلة على منتجات الصيف",
  // ... other fields
};
```

### Displaying Offers
```typescript
// Automatically shows correct language based on i18n.language
const displayTitle = currentLanguage === 'ar' ? offer.title_ar || offer.title : 
                    currentLanguage === 'nl' ? offer.title_nl || offer.title : 
                    offer.title;
```

## Benefits
1. **Better User Experience**: Users see offers in their preferred language
2. **Consistent with Products**: Same multilingual pattern as products
3. **Flexible**: Optional translations, falls back gracefully
4. **Admin Friendly**: Easy to manage multiple languages in one form

## Future Enhancements
- Add validation for required fields in all languages
- Add language-specific offer images
- Add language-specific pricing
- Add language-specific terms and conditions




