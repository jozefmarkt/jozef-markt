import React, { useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation('cart');
  const { state, close, remove, clear } = useCart();
  const currentLanguage = i18n.language;

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2).replace('.', ',')}`;
  };

  // Helper function to get product name in current language
  const getProductName = (product: any): string => {
    switch (currentLanguage) {
      case 'nl':
        return product.name_nl || product.name;
      case 'ar':
        return product.name_ar || product.name;
      default:
        return product.name;
    }
  };

  const totalItems = state.items.reduce((total, item) => total + item.qty, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.product.price * item.qty), 0);

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, close]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={close}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            {totalItems > 0 && (
              <span className="bg-lion-500 text-white text-xs rounded-full px-2 py-1">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={close}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={48} className="mb-4 opacity-50" />
              <p className="text-center">{t('empty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={getProductName(item.product)}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{getProductName(item.product)}</h3>
                    <p className="text-sm text-gray-600">
                      {item.qty} × {formatPrice(item.product.price)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.qty)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('subtotal')}</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={clear}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('clear')}
              </button>
              <button
                className="flex-1 py-2 px-4 bg-lion-500 text-white rounded-lg hover:bg-lion-600 transition-colors"
              >
                {t('checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 