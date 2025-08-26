import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { offerService } from "../../services/supabase";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

const OffersPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { addOffer } = useCart();
  const currentLanguage = i18n.language;

  const { data: offers, isLoading, error, refetch } = useQuery({
    queryKey: ['offers', currentLanguage],
    queryFn: () => offerService.getActive(),
  });

  // Refetch offers when language changes
  useEffect(() => {
    refetch();
  }, [currentLanguage, refetch]);

  const handleAddToCart = (offer: any) => {
    addOffer(offer);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lion-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('offers.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{t('offers.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('offers.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('offers.subtitle')}</p>
      </motion.div>

             {offers && offers.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {offers.map((offer, index) => {
             // Debug: Log offer data to see what fields are available
             console.log('Offer data:', offer);
             console.log('Current language:', currentLanguage);
             console.log('Title fields:', { title: offer.title, title_nl: offer.title_nl, title_ar: offer.title_ar });
             
             const colors = [
               'from-pink-500 to-purple-600',
               'from-blue-500 to-cyan-600',
               'from-green-500 to-emerald-600',
               'from-orange-500 to-red-600',
               'from-indigo-500 to-purple-600',
               'from-teal-500 to-blue-600',
               'from-yellow-500 to-orange-600',
               'from-red-500 to-pink-600',
               'from-purple-500 to-indigo-600'
             ];
             const colorClass = colors[index % colors.length];
             
             return (
               <motion.div
                 key={offer.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className={`bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-4 border-white`}
               >
                 {offer.image && (
                   <div className="h-80 overflow-hidden relative">
                     <img
                       src={offer.image}
                       alt={currentLanguage === 'ar' ? offer.title_ar || offer.title : 
                            currentLanguage === 'nl' ? offer.title_nl || offer.title : 
                            offer.title}
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
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                       {currentLanguage === 'ar' ? offer.title_ar || offer.title : 
                        currentLanguage === 'nl' ? offer.title_nl || offer.title : 
                        offer.title}
                     </h3>
                     {offer.price_before && offer.price_before > offer.price && (
                       <span className="bg-gradient-to-r from-lion-500 to-lion-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                         🎉 {Math.round(((offer.price_before - offer.price) / offer.price_before) * 100)}% {t('offers.off')} 🎉
                       </span>
                     )}
                   </div>
                   <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                     {currentLanguage === 'ar' ? offer.description_ar || offer.description : 
                      currentLanguage === 'nl' ? offer.description_nl || offer.description : 
                      offer.description}
                   </p>
                   
                   {/* Enhanced Price Display */}
                   <div className="mb-6">
                     <div className="flex items-center gap-3 mb-3">
                       <span className="text-4xl font-bold text-gray-900">€{offer.price.toFixed(2)}</span>
                       {offer.price_before && offer.price_before > offer.price && (
                         <span className="text-xl text-gray-500 line-through font-medium">€{offer.price_before.toFixed(2)}</span>
                       )}
                     </div>
                     {offer.price_before && offer.price_before > offer.price && (
                       <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-full text-center font-bold text-lg shadow-lg mb-4">
                         💰 Save €{(offer.price_before - offer.price).toFixed(2)} 💰
                       </div>
                     )}
                   </div>
                   
                   <div className="flex items-center justify-between text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl mb-6 border-2 border-gray-300">
                     <span className="font-medium">🕒 {t('offers.validUntil')}:</span>
                     <span className="font-bold">{new Date(offer.end_date).toLocaleDateString()}</span>
                   </div>
                   
                   <button
                     onClick={() => handleAddToCart(offer)}
                     className="w-full bg-gradient-to-r from-lion-500 to-lion-600 text-white py-4 px-6 rounded-xl hover:from-lion-600 hover:to-lion-700 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                   >
                     <ShoppingCart size={20} />
                     {t('offers.addToCart')}
                   </button>
                 </div>
               </motion.div>
             );
           })}
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
  );
};

export default OffersPage; 