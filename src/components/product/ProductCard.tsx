import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { add } = useCart();
  const { t } = useTranslation(['common', 'products']);
  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-48 object-cover rounded-t-xl ${
              !product.in_stock ? 'opacity-50' : ''
            }`}
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{t('outOfStock', { ns: 'products' })}</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-lion-600 transition-colors">
            {product.name}
          </h3>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <p className="text-xl font-semibold text-gray-800 mb-4">
          {formatPrice(product.price)}
        </p>
        <button
          onClick={() => add(product)}
          disabled={!product.in_stock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.in_stock
              ? 'bg-lion-500 text-white hover:bg-lion-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.in_stock ? t('addToCart', { ns: 'products' }) : t('outOfStock', { ns: 'products' })}
        </button>
      </div>
    </div>
  );
}; 