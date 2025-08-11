import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductToolbar } from '../../components/product/ProductToolbar';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/Product';

interface FilterState {
  text: string;
  category: string;
}

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation('products');
  const { data: products, isLoading, error } = useProducts();
  const [filter, setFilter] = useState<FilterState>({ text: '', category: 'All' });
  const currentLanguage = i18n.language;

  const filtered = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      // Get the appropriate name and description based on current language for filtering
      const getProductName = (): string => {
        switch (currentLanguage) {
          case 'nl':
            return product.name_nl || product.name;
          case 'ar':
            return product.name_ar || product.name;
          default:
            return product.name;
        }
      };

      const getProductDescription = (): string => {
        switch (currentLanguage) {
          case 'nl':
            return product.description_nl || product.description;
          case 'ar':
            return product.description_ar || product.description;
          default:
            return product.description;
        }
      };

      const productName = getProductName();
      const productDescription = getProductDescription();
      
      const matchesText = filter.text === '' || 
        productName.toLowerCase().includes(filter.text.toLowerCase()) ||
        productDescription.toLowerCase().includes(filter.text.toLowerCase());
      const matchesCategory = filter.category === 'All' || product.category === filter.category;
      
      return matchesText && matchesCategory;
    });
  }, [products, filter, currentLanguage]);

  const handleFilter = useCallback((newFilter: FilterState) => {
    setFilter(newFilter);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">{t('loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{t('error')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>
      <ProductToolbar products={products || []} onFilter={handleFilter} />
      {filtered.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">{t('noItems')}</div>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
};

export default ProductsPage; 