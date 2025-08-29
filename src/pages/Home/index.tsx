import SectionHero from './SectionHero';
import { useQuery } from '@tanstack/react-query';
import { offerService, productService } from '../../services/supabase';
import { useTranslation } from 'react-i18next';
import { ProductGrid } from '../../components/product/ProductGrid';
import { motion } from 'framer-motion';
import TikTokVideo from '../../components/TikTokVideo';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language;
  
  const { data: offers, isLoading: offersLoading, error: offersError } = useQuery({
    queryKey: ['home-offers', currentLanguage],
    queryFn: () => offerService.getActive(),
  });

  const { data: featuredProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured(),
  });



  return (
    <>
      <SectionHero />
      
      {/* Special Offers Section */}
      <section id="offers-section" className="py-16 bg-gray-50">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {offers.map((offer, index) => {
                 const colors = [
                   'from-pink-500 to-purple-600',
                   'from-blue-500 to-cyan-600',
                   'from-green-500 to-emerald-600',
                   'from-orange-500 to-red-600',
                   'from-indigo-500 to-purple-600',
                   'from-teal-500 to-blue-600'
                 ];
                 const colorClass = colors[index % colors.length];
                 
                 return (
                   <div key={offer.id} className={`bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border-4 border-white`}>
                     {offer.image && (
                       <div className="h-80 overflow-hidden relative">
                         <img
                           src={offer.image}
                           alt={offer.title}
                           className="w-full h-full object-contain bg-white transform hover:scale-110 transition-transform duration-500"
                         />
                         {offer.price_before && offer.price_before > offer.price && (
                           <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl animate-pulse">
                             🔥 {Math.round(((offer.price_before - offer.price) / offer.price_before) * 100)}% OFF 🔥
                           </div>
                         )}
                       </div>
                     )}
                     
                     <div className="p-8 bg-white/95 backdrop-blur-sm">
                       <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                         {currentLanguage === 'ar' && offer.title_ar ? offer.title_ar : 
                          currentLanguage === 'nl' && offer.title_nl ? offer.title_nl : 
                          offer.title}
                       </h3>
                       <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                         {currentLanguage === 'ar' && offer.description_ar ? offer.description_ar : 
                          currentLanguage === 'nl' && offer.description_nl ? offer.description_nl : 
                          offer.description}
                       </p>
                       
                       <div className="mb-6">
                         <div className="flex items-center justify-between mb-3">
                           <div className="text-4xl font-bold text-lion-600">
                             €{offer.price.toFixed(2)}
                           </div>
                           {offer.price_before && offer.price_before > offer.price && (
                             <div className="text-xl text-gray-500 line-through font-medium">
                               €{offer.price_before.toFixed(2)}
                             </div>
                           )}
                         </div>
                         {offer.price_before && offer.price_before > offer.price && (
                           <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-full text-center font-bold text-lg shadow-lg">
                             💰 Save €{(offer.price_before - offer.price).toFixed(2)} 💰
                           </div>
                         )}
                       </div>
                       
                       <div className="flex items-center justify-between text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl border-2 border-gray-300">
                         <span className="font-medium">🕒 Valid until:</span>
                         <span className="font-bold">{new Date(offer.end_date).toLocaleDateString()}</span>
                       </div>
                     </div>
                   </div>
                 );
               })}
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
            <ProductGrid products={featuredProducts.slice(0, 8)} />
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-800 mb-6 tracking-tight">
                {t('about.title')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-lion-500 to-lion-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                  {t('about.description')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-lion-500 rounded-full"></div>
                    <span className="text-gray-600 font-medium">{t('about.features.fresh')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-lion-500 rounded-full"></div>
                    <span className="text-gray-600 font-medium">{t('about.features.quality')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/shopfront.png" 
                    alt="Yousef Market Shopfront" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl p-12"
            >
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-black mr-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
                    {t('about.tiktok.title')}
                  </h2>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t('about.tiktok.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* TikTok Video Preview */}
                <div className="flex justify-center">
                  <TikTokVideo />
                </div>
                
                {/* Content and CTA */}
                <div className="text-center lg:text-left">
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-4 h-4 bg-lion-500 rounded-full"></div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {t('about.features.fresh')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-4 h-4 bg-lion-500 rounded-full"></div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {t('about.features.quality')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-4 h-4 bg-lion-500 rounded-full"></div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {t('services.support.title')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <a
                      href="https://www.tiktok.com/@jozef.market"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                      {t('about.tiktok.followButton')}
                    </a>
                    
                    <p className="text-gray-500 text-sm">
                      {t('about.tiktok.videoPlaceholder')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-800 mb-6 tracking-tight">
              {t('services.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lion-500 to-lion-600 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { 
                title: t('services.fastDelivery.title'), 
                desc: t('services.fastDelivery.desc'),
                icon: "🚚",
                gradient: "from-blue-500 to-cyan-600",
                bgGradient: "from-blue-50 to-cyan-50"
              },
              { 
                title: t('services.qualityProducts.title'), 
                desc: t('services.qualityProducts.desc'),
                icon: "⭐",
                gradient: "from-green-500 to-emerald-600",
                bgGradient: "from-green-50 to-emerald-50"
              },
              { 
                title: t('services.support.title'), 
                desc: t('services.support.desc'),
                icon: "🛟",
                gradient: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              },
              { 
                title: t('services.returns.title'), 
                desc: t('services.returns.desc'),
                icon: "🔄",
                gradient: "from-orange-500 to-red-600",
                bgGradient: "from-orange-50 to-red-50"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${service.bgGradient} rounded-3xl p-8 h-full border-2 border-transparent hover:border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}>
                  {/* Icon Container */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full opacity-60`}></div>
                  <div className={`absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-r ${service.gradient} rounded-full opacity-40`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
