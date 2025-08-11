import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../../hooks/useProduct';

const ProductDetails: React.FC = () => {
  const { t, i18n } = useTranslation('products');
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);
  const currentLanguage = i18n.language;

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2).replace('.', ',')}`;
  };

  // Get the appropriate name and description based on current language
  const getDisplayName = (): string => {
    if (!product) return '';
    switch (currentLanguage) {
      case 'nl':
        return product.name_nl || product.name;
      case 'ar':
        return product.name_ar || product.name;
      default:
        return product.name;
    }
  };

  const getDisplayDescription = (): string => {
    if (!product) return '';
    switch (currentLanguage) {
      case 'nl':
        return product.description_nl || product.description;
      case 'ar':
        return product.description_ar || product.description;
      default:
        return product.description;
    }
  };

  const displayName = getDisplayName();
  const displayDescription = getDisplayDescription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-xl font-jet text-gray-600">{t('loadingProduct')}</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-xl font-jet text-red-600">
          {t('errorLoadingProduct')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center text-lion-600 hover:text-lion-700 font-medium"
        >
          {t('backToProducts')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img
            src={product.image}
            alt={displayName}
            className={`w-full h-96 object-cover rounded-xl shadow-lg ${
              !product.in_stock ? 'opacity-50' : ''
            }`}
          />
          {!product.in_stock && (
            <div className="text-center">
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-medium">
                {t('outOfStock')}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-jet font-bold text-gray-900 mb-2">
              {displayName}
            </h1>
            <p className="text-2xl font-lion font-semibold text-gray-800">
              {formatPrice(product.price)}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-jet font-semibold text-gray-900 mb-3">
              {t('description')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {displayDescription}
            </p>
          </div>

          <button
            disabled={!product.in_stock}
            className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
              product.in_stock
                ? 'bg-lion-500 text-white hover:bg-lion-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.in_stock ? t('addToCart', 'Add to Cart') : t('outOfStock', 'Out of Stock')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 