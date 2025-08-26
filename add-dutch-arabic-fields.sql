-- Add Dutch and Arabic fields to products table
ALTER TABLE products 
ADD COLUMN name_nl VARCHAR(255),
ADD COLUMN description_nl TEXT,
ADD COLUMN nutrition_nl TEXT,
ADD COLUMN name_ar VARCHAR(255),
ADD COLUMN description_ar TEXT,
ADD COLUMN nutrition_ar TEXT;

-- Update existing products with Dutch translations
UPDATE products SET 
  name_nl = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'Verse Biologische Tomaten'
    WHEN name = 'Whole Grain Bread' THEN 'Volkoren Brood'
    WHEN name = 'Premium Dutch Cheese' THEN 'Premium Nederlandse Kaas'
    WHEN name = 'Fresh Milk 1L' THEN 'Verse Melk 1L'
    ELSE name
  END,
  description_nl = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'Sappige, aan de wijnstok gerijpte biologische tomaten perfect voor salades, sauzen en verse consumptie. Lokaal geteeld zonder pesticiden.'
    WHEN name = 'Whole Grain Bread' THEN 'Ambachtelijk volkoren brood gemaakt met steengemalen meel. Rijk aan vezels en voedingsstoffen, perfect voor gezonde boterhammen.'
    WHEN name = 'Premium Dutch Cheese' THEN 'Gerijpte Nederlandse Gouda kaas met rijke, nootachtige smaak en zachte textuur. Perfect voor kaasplankjes en koken.'
    WHEN name = 'Fresh Milk 1L' THEN 'Verse, gepasteuriseerde volle melk van lokale boerderijen. Rijk aan calcium en essentiële voedingsstoffen voor dagelijkse voeding.'
    ELSE description
  END,
  nutrition_nl = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'Energie 18 kcal/100g, Eiwit 0.9g/100g, Koolhydraten 3.9g/100g'
    WHEN name = 'Whole Grain Bread' THEN 'Energie 247 kcal/100g, Eiwit 9g/100g, Koolhydraten 49g/100g, Vezels 7g/100g'
    WHEN name = 'Premium Dutch Cheese' THEN 'Energie 356 kcal/100g, Eiwit 25g/100g, Vet 28g/100g, Calcium 700mg/100g'
    WHEN name = 'Fresh Milk 1L' THEN 'Energie 64 kcal/100ml, Eiwit 3.4g/100ml, Vet 3.6g/100ml, Calcium 120mg/100ml'
    ELSE nutrition
  END;

-- Update existing products with Arabic translations
UPDATE products SET 
  name_ar = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'طماطم عضوية طازجة'
    WHEN name = 'Whole Grain Bread' THEN 'خبز الحبوب الكاملة'
    WHEN name = 'Premium Dutch Cheese' THEN 'جبن هولندي مميز'
    WHEN name = 'Fresh Milk 1L' THEN 'حليب طازج 1 لتر'
    ELSE name
  END,
  description_ar = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'طماطم عضوية طازجة ناضجة على الكرمة مثالية للسلطات والصلصات والأكل الطازج. مزروعة محلياً بدون مبيدات.'
    WHEN name = 'Whole Grain Bread' THEN 'خبز حبوب كاملة حرفي مصنوع من الدقيق المطحون بالحجر. غني بالألياف والمواد الغذائية مثالي للسندويتشات الصحية.'
    WHEN name = 'Premium Dutch Cheese' THEN 'جبن هولندي معتق بنكهة غنية وجوزية وملمس ناعم. مثالي لألواح الجبن والطبخ.'
    WHEN name = 'Fresh Milk 1L' THEN 'حليب طازج مبستر كامل الدسم من مزارع الألبان المحلية. غني بالكالسيوم والمواد الغذائية الأساسية للتغذية اليومية.'
    ELSE description
  END,
  nutrition_ar = CASE 
    WHEN name = 'Fresh Organic Tomatoes' THEN 'الطاقة 18 سعرة حرارية/100غ، البروتين 0.9غ/100غ، الكربوهيدرات 3.9غ/100غ'
    WHEN name = 'Whole Grain Bread' THEN 'الطاقة 247 سعرة حرارية/100غ، البروتين 9غ/100غ، الكربوهيدرات 49غ/100غ، الألياف 7غ/100غ'
    WHEN name = 'Premium Dutch Cheese' THEN 'الطاقة 356 سعرة حرارية/100غ، البروتين 25غ/100غ، الدهون 28غ/100غ، الكالسيوم 700ملغ/100غ'
    WHEN name = 'Fresh Milk 1L' THEN 'الطاقة 64 سعرة حرارية/100مل، البروتين 3.4غ/100مل، الدهون 3.6غ/100مل، الكالسيوم 120ملغ/100مل'
    ELSE nutrition
  END;


