import React, { useEffect, useState } from 'react';
import { X, ShoppingCart, MessageCircle, Truck, MapPin, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation('cart');
  const { state, close, remove, clear } = useCart();
  const currentLanguage = i18n.language;
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup' | null>(null);
  const [address, setAddress] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: ''
  });

  // WhatsApp configuration
  const whatsappNumber = '+31623735563';

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    setShowDeliveryOptions(true);
  };

  const handleDeliverySelection = (type: 'delivery' | 'pickup') => {
    setDeliveryType(type);
    if (type === 'pickup') {
      handleWhatsAppCheckout();
    }
  };

  const handleDeliverySubmit = () => {
    if (!address.street.trim() || !address.houseNumber.trim() || !address.postalCode.trim() || !address.city.trim()) return;
    handleWhatsAppCheckout();
  };

  const handleWhatsAppCheckout = () => {
    if (state.items.length === 0) return;

    // Create order message
    const orderItems = state.items.map(item => {
      let itemName = '';
      let itemTotal = item.price * item.qty;
      
      if (item.type === 'product' && item.product) {
        itemName = getProductName(item.product);
      } else if (item.type === 'offer' && item.offer) {
        itemName = item.offer.title;
      }
      
      return `• ${itemName} - ${item.qty}x €${item.price.toFixed(2).replace('.', ',')} = €${itemTotal.toFixed(2).replace('.', ',')}`;
    }).join('\n');

    const total = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Add delivery information to message
    let deliveryInfo = '';
    if (deliveryType === 'pickup') {
      switch (currentLanguage) {
        case 'ar':
          deliveryInfo = '\n\nطريقة الاستلام: استلام من المتجر';
          break;
        case 'nl':
          deliveryInfo = '\n\nAfhalen: Ophalen in de winkel';
          break;
        default:
          deliveryInfo = '\n\nPickup: Pick up from store';
      }
    } else if (deliveryType === 'delivery') {
      const formattedAddress = `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`;
      switch (currentLanguage) {
        case 'ar':
          deliveryInfo = `\n\nطريقة الاستلام: توصيل إلى المنزل\nالعنوان: ${formattedAddress}\n\nسيخبرك البائع بموعد التوصيل.`;
          break;
        case 'nl':
          deliveryInfo = `\n\nAfhalen: Bezorging aan huis\nAdres: ${formattedAddress}\n\nDe verkoper zal u laten weten wanneer het wordt bezorgd.`;
          break;
        default:
          deliveryInfo = `\n\nDelivery: Home delivery\nAddress: ${formattedAddress}\n\nThe seller will let you know when it will be delivered.`;
      }
    }
    
    // Create message based on language
    let message = '';
    switch (currentLanguage) {
      case 'ar':
        message = `مرحباً! أريد أن أطلب من سوبرماركت جوزيف:\n\n${orderItems}\n\nالمجموع: €${total.toFixed(2).replace('.', ',')}${deliveryInfo}\n\nشكراً لك!`;
        break;
      case 'nl':
        message = `Hallo! Ik wil bestellen bij Jozef Supermarkt:\n\n${orderItems}\n\nTotaal: €${total.toFixed(2).replace('.', ',')}${deliveryInfo}\n\nBedankt!`;
        break;
      default:
        message = `Hello! I would like to order from Jozef Supermarkt:\n\n${orderItems}\n\nTotal: €${total.toFixed(2).replace('.', ',')}${deliveryInfo}\n\nThank you!`;
    }

    // Format WhatsApp URL
    const formattedNumber = whatsappNumber.replace(/\s+/g, '').replace(/[()]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    
    // Try to open in WhatsApp app first, fallback to web
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Mobile device - try to open WhatsApp app
      window.location.href = whatsappUrl;
    } else {
      // Desktop - open in new tab
      window.open(whatsappUrl, '_blank');
    }

    // Reset states and close cart after sending
    setShowDeliveryOptions(false);
    setDeliveryType(null);
    setAddress({
      street: '',
      houseNumber: '',
      postalCode: '',
      city: ''
    });
    close();
  };

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

  // Helper function to get item name and image
  const getItemDetails = (item: any) => {
    if (item.type === 'product' && item.product) {
      return {
        name: getProductName(item.product),
        image: item.product.image,
        isOffer: false
      };
    } else if (item.type === 'offer' && item.offer) {
      return {
        name: item.offer.title,
        image: item.offer.image,
        isOffer: true
      };
    }
    return { name: '', image: '', isOffer: false };
  };

  const totalItems = state.items.reduce((total, item) => total + item.qty, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.qty), 0);

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
      <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b bg-gradient-to-r from-lion-500 via-lion-600 to-lion-700 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full shadow-lg">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('title')}</h2>
              {totalItems > 0 && (
                <p className="text-base opacity-90">{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
              )}
            </div>
          </div>
          <button
            onClick={close}
            className="p-3 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-8">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-lg">
                <ShoppingCart size={64} className="opacity-50" />
              </div>
              <p className="text-center text-xl font-semibold">{t('empty')}</p>
              <p className="text-center text-base text-gray-400 mt-3">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-8">
              {state.items.map((item) => {
                const itemDetails = getItemDetails(item);
                return (
                  <div key={item.id} className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0">
                          <img
                            src={itemDetails.image}
                            alt={itemDetails.name}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                          />
                          {itemDetails.isOffer && (
                            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-lion-500 to-lion-600 text-white rounded-full p-2 shadow-xl">
                              <Tag size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2">
                                {itemDetails.name}
                              </h3>
                              {itemDetails.isOffer && (
                                <span className="inline-block bg-gradient-to-r from-lion-100 to-lion-200 text-lion-800 text-sm font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm">
                                  🎉 SPECIAL OFFER 🎉
                                </span>
                              )}
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-base text-gray-600 font-medium">
                                  Quantity: {item.qty}
                                </span>
                                <span className="text-gray-300 text-lg">•</span>
                                <span className="text-xl font-bold text-lion-600">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-base text-gray-500 line-through font-medium">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                  <span className="text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-full font-bold shadow-sm">
                                    💰 Save {formatPrice(item.originalPrice - item.price)} 💰
                                  </span>
                                </div>
                              )}
                              <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatPrice(item.price * item.qty)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => remove(item.id)}
                              className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delivery Options */}
        {showDeliveryOptions && (
          <div className="border-t p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">
              {currentLanguage === 'ar' ? 'كيف تريد استلام طلبك؟' : 
               currentLanguage === 'nl' ? 'Hoe wilt u uw bestelling ontvangen?' : 
               'How would you like to receive your order?'}
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDeliverySelection('pickup')}
                className="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-lion-500 hover:bg-lion-50 transition-colors flex items-center gap-3"
              >
                <MapPin size={20} className="text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {currentLanguage === 'ar' ? 'استلام من المتجر' : 
                     currentLanguage === 'nl' ? 'Ophalen in de winkel' : 
                     'Pick up from store'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ar' ? 'احصل على طلبك من متجرنا' : 
                     currentLanguage === 'nl' ? 'Haal uw bestelling op in onze winkel' : 
                     'Collect your order from our store'}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleDeliverySelection('delivery')}
                className="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-lion-500 hover:bg-lion-50 transition-colors flex items-center gap-3"
              >
                <Truck size={20} className="text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {currentLanguage === 'ar' ? 'توصيل إلى المنزل' : 
                     currentLanguage === 'nl' ? 'Bezorging aan huis' : 
                     'Home delivery'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentLanguage === 'ar' ? 'نوصلك طلبك إلى منزلك' : 
                     currentLanguage === 'nl' ? 'We bezorgen uw bestelling bij u thuis' : 
                     'We deliver your order to your home'}
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowDeliveryOptions(false)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {currentLanguage === 'ar' ? 'رجوع' : 
               currentLanguage === 'nl' ? 'Terug' : 
               'Back'}
            </button>
          </div>
        )}

        {/* Address Input for Delivery */}
        {deliveryType === 'delivery' && (
          <div className="border-t p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">
              {currentLanguage === 'ar' ? 'أدخل عنوان التوصيل' : 
               currentLanguage === 'nl' ? 'Voer uw bezorgadres in' : 
               'Enter delivery address'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentLanguage === 'ar' ? 'اسم الشارع' : 
                   currentLanguage === 'nl' ? 'Straatnaam' : 
                   'Street name'}
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  placeholder={
                    currentLanguage === 'ar' ? 'مثال: شارع الملك' : 
                    currentLanguage === 'nl' ? 'Bijv. Hoofdstraat' : 
                    'e.g. Main Street'
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500 focus:border-lion-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'ar' ? 'رقم المنزل' : 
                     currentLanguage === 'nl' ? 'Huisnummer' : 
                     'House number'}
                  </label>
                  <input
                    type="text"
                    value={address.houseNumber}
                    onChange={(e) => setAddress({...address, houseNumber: e.target.value})}
                    placeholder={
                      currentLanguage === 'ar' ? '123' : 
                      currentLanguage === 'nl' ? '123' : 
                      '123'
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500 focus:border-lion-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'ar' ? 'الرمز البريدي' : 
                     currentLanguage === 'nl' ? 'Postcode' : 
                     'Postal code'}
                  </label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    placeholder={
                      currentLanguage === 'ar' ? '1234 AB' : 
                      currentLanguage === 'nl' ? '1234 AB' : 
                      '1234 AB'
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500 focus:border-lion-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentLanguage === 'ar' ? 'المدينة' : 
                   currentLanguage === 'nl' ? 'Plaats' : 
                   'City'}
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  placeholder={
                    currentLanguage === 'ar' ? 'روتردام' : 
                    currentLanguage === 'nl' ? 'Rotterdam' : 
                    'Rotterdam'
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500 focus:border-lion-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeliveryType(null);
                  setAddress({
                    street: '',
                    houseNumber: '',
                    postalCode: '',
                    city: ''
                  });
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {currentLanguage === 'ar' ? 'رجوع' : 
                 currentLanguage === 'nl' ? 'Terug' : 
                 'Back'}
              </button>
              <button
                onClick={handleDeliverySubmit}
                disabled={!address.street.trim() || !address.houseNumber.trim() || !address.postalCode.trim() || !address.city.trim()}
                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                {currentLanguage === 'ar' ? 'إرسال الطلب' : 
                 currentLanguage === 'nl' ? 'Bestelling verzenden' : 
                 'Send Order'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {state.items.length > 0 && !showDeliveryOptions && deliveryType !== 'delivery' && (
          <div className="border-t bg-gradient-to-br from-gray-50 to-gray-100 p-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700 text-lg">{t('subtotal')}</span>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

            </div>
            
            <div className="flex gap-4">
              <button
                onClick={clear}
                className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                {t('clear')}
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white rounded-xl hover:from-green-600 hover:via-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <MessageCircle size={20} />
                {t('checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 