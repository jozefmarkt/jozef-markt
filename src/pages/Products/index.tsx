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
  const { t } = useTranslation('products');
  const { data: products, isLoading, error } = useProducts();
  const [filter, setFilter] = useState<FilterState>({ text: '', category: 'All' });

  const filtered = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const matchesText = product.name.toLowerCase().includes(filter.text.toLowerCase());
      const matchesCategory = filter.category === 'All' || product.category === filter.category;
      
      return matchesText && matchesCategory;
    });
  }, [products, filter]);

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