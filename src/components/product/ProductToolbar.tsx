import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types/Product';

interface FilterState {
  text: string;
  category: string;
}

interface ProductToolbarProps {
  products: Product[];
  onFilter: (filter: FilterState) => void;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({ products, onFilter }) => {
  const { t } = useTranslation('common');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('All');

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))];

  useEffect(() => {
    onFilter({ text, category });
  }, [text, category, onFilter]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder={t('label.search')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="sm:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}; 