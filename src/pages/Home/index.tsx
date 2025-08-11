import SectionHero from './SectionHero';
import { useQuery } from '@tanstack/react-query';
import { offerService, productService } from '../../services/supabase';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language;
  
  const { data: offers, isLoading: offersLoading, error: offersError } = useQuery({
    queryKey: ['home-offers'],
    queryFn: () => offerService.getActive(),
  });

  const { data: featuredProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured(),
  });

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

  return (
    <>
      <SectionHero />
      
      {/* Special Offers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('offers.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('offers.subtitle')}</p>
          </div>
          
          {offersLoading && (
            <div className="text-center text-gray-600">Loading offers...</div>
          )}
          
          {offersError && (
            <div className="text-center text-red-600">Error loading offers: {offersError.message}</div>
          )}
          
          {offers && offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.slice(0, 6).map((offer) => (
                <div key={offer.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {offer.image && (
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-lion-600">
                        €{offer.discount_price?.toFixed(2) || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        €{offer.original_price?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {t('offers.validUntil')} {new Date(offer.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>{t('offers.noOffers')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('products.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('products.subtitle')}</p>
          </div>
          
          {productsLoading && (
            <div className="text-center text-gray-600">Loading products...</div>
          )}
          
          {productsError && (
            <div className="text-center text-red-600">Error loading products: {productsError.message}</div>
          )}
          
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={getProductName(product)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-lion-100 to-lion-200 flex items-center justify-center">
                        <span className="text-4xl text-lion-600">🛒</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-lion-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                      {getProductName(product)}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-lion-600">€{product.price.toFixed(2)}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-lion-500 to-lion-600 text-white py-2 rounded-lg font-semibold hover:from-lion-600 hover:to-lion-700 transition-all duration-300">
                      {t('products.addToCart')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('products.noFeatured')}</p>
            </div>
          )}
          
          {featuredProducts && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <a 
                href="/products" 
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-lion-500 to-lion-600 text-white font-semibold rounded-full hover:from-lion-600 hover:to-lion-700 transition-all duration-300 shadow-lg"
              >
                {t('products.viewAll')}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{t('about.title')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t('services.fastDelivery.title'), desc: t('services.fastDelivery.desc') },
              { title: t('services.qualityProducts.title'), desc: t('services.qualityProducts.desc') },
              { title: t('services.support.title'), desc: t('services.support.desc') },
              { title: t('services.returns.title'), desc: t('services.returns.desc') }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-lion-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-lion-600">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
