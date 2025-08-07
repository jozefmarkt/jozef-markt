import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { offerService } from "../../services/supabase";
import { motion } from "framer-motion";

const OffersPage: React.FC = () => {
  const { t } = useTranslation('common');

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: () => offerService.getActive(),
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {offer.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{offer.title}</h3>
                  <span className="bg-lion-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {offer.discount_percentage}% OFF
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{t('offers.validUntil')}: {new Date(offer.end_date).toLocaleDateString()}</span>
                  {offer.discount_amount && (
                    <span className="font-semibold text-lion-500">
                      Save €{offer.discount_amount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
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