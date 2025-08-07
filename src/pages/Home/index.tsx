import SectionHero from './SectionHero';
import { useQuery } from '@tanstack/react-query';
import { offerService } from '../../services/supabase';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation('common');
  
  const { data: offers, isLoading: offersLoading, error: offersError } = useQuery({
    queryKey: ['home-offers'],
    queryFn: () => offerService.getActive(),
  });

  return (
    <>
      <SectionHero />
      
      {/* Special Offers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('offers.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('offers.subtitle')}</p>
          </motion.div>
          
          {offersLoading && (
            <div className="text-center text-gray-600">Loading offers...</div>
          )}
          
          {offersError && (
            <div className="text-center text-red-600">Error loading offers: {offersError.message}</div>
          )}
          
          {offers && offers.length > 0 ? (
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-lion-100 rounded-full opacity-30"></div>
                <div className="absolute bottom-20 right-20 w-16 h-16 bg-lion-200 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-lion-300 rounded-full opacity-20"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.slice(0, 6).map((offer, index) => {
                  // Create random positioning variations
                  const randomDelay = Math.random() * 0.3;
                  const randomY = (Math.random() - 0.5) * 40;
                  const randomRotation = (Math.random() - 0.5) * 6;
                  
                  return (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 50 + randomY, rotate: randomRotation }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.15 + randomDelay,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className={`
                        relative bg-white rounded-2xl shadow-xl overflow-hidden 
                        hover:shadow-2xl transition-all duration-300 transform
                        ${index % 3 === 0 ? 'md:translate-y-4' : ''}
                        ${index % 3 === 2 ? 'md:-translate-y-4' : ''}
                        ${index % 2 === 0 ? 'lg:translate-x-2' : 'lg:-translate-x-2'}
                      `}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-lion-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Discount badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-3">
                          {offer.discount_percentage}% OFF
                        </div>
                      </div>
                      
                      {offer.image && (
                        <div className="h-56 overflow-hidden relative">
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}
                      
                      <div className="p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">{offer.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{offer.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center">
                              <span className="w-2 h-2 bg-lion-500 rounded-full mr-2"></span>
                              {t('offers.validUntil')}: {new Date(offer.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {offer.discount_amount && (
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-lion-500">
                                Save €{offer.discount_amount}
                              </span>
                              <div className="bg-lion-100 text-lion-700 px-3 py-1 rounded-full text-sm font-semibold">
                                Limited Time!
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Decorative corner element */}
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-lion-200 rounded-full opacity-30"></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* View all offers button */}
              {offers.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center mt-12"
                >
                  <a 
                    href="/offers" 
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-lion-500 to-lion-600 text-white font-semibold rounded-full hover:from-lion-600 hover:to-lion-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    View All Offers
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">{t('offers.noOffers')}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Jozef Supermarkt</h2>
            <p className="text-lg text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-lg text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Fast Delivery", desc: "Same day delivery available" },
              { title: "Quality Products", desc: "Premium selection guaranteed" },
              { title: "24/7 Support", desc: "Always here to help you" },
              { title: "Easy Returns", desc: "Hassle-free return policy" }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-lion-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-lion-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white-400 mb-8">Subscribe to our newsletter for the latest offers and updates</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-lion-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-4">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">📧 info@jozefmarkt.com</p>
                  <p className="text-gray-600">📞 +1 (555) 123-4567</p>
                  <p className="text-gray-600">📍 123 Market Street, City, Country</p>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500"
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500"
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lion-500"
                  ></textarea>
                  <button className="w-full bg-lion-500 text-white py-2 rounded-lg font-semibold hover:bg-lion-600">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 