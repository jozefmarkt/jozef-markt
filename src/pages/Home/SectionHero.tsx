import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';
import ResponsiveHeroBackground from '../../components/common/ResponsiveHeroBackground';

const SectionHero = () => {
  const { t, i18n } = useTranslation('common');
  const isArabic = i18n.language === 'ar';
  const [currentSentence, setCurrentSentence] = useState(0);
  
  const marketingSentences = [
    t('hero.marketing.sentence1'),
    t('hero.marketing.sentence2'),
    t('hero.marketing.sentence3'),
    t('hero.marketing.sentence4'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % marketingSentences.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [marketingSentences.length]);
  
  return (
    <ResponsiveHeroBackground className="min-h-screen">
      {/* Animated background image with zoom effect */}
      <motion.div
        className="absolute inset-0 hero-zoom-bg"
        animate={{
          scale: [1, 1.02, 1],
          x: [0, -4, 0],
          y: [0, -3, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`relative z-10 mx-auto flex max-w-3xl flex-col items-center py-32 text-center text-white-500 justify-center min-h-screen px-4 sm:px-6 ${isArabic ? 'text-right' : 'text-left'}`}
      >
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {t('hero.title')}
      </motion.h1>
      
      <div className="mt-8 text-lg sm:text-xl lg:text-2xl text-white-300 font-medium leading-relaxed max-w-2xl h-16 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSentence}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute"
          >
            {marketingSentences[currentSentence]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 mt-12"
      >
        <Button
          className="bg-lion-500 hover:bg-lion-600 px-12 py-5 text-lg font-bold text-white-500 focus:outline-none focus:ring-4 focus:ring-lion-700/50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          aria-label={t('nav.products')}
          onClick={() => window.location.href = '/products'}
        >
          {t('nav.products')}
        </Button>
        
        <Button
          className="bg-lion-500 hover:bg-lion-600 px-12 py-5 text-lg font-bold text-white-500 focus:outline-none focus:ring-4 focus:ring-lion-700/50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          aria-label={t('nav.offers')}
          onClick={() => window.location.href = '/offers'}
        >
          {t('nav.offers')}
        </Button>
      </motion.div>
      
      <motion.span 
        className="mt-8 text-sm sm:text-base text-white-400 font-medium text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        {t('hero.shipping')}
      </motion.span>
      </motion.div>
    </ResponsiveHeroBackground>
  );
};

export default SectionHero; 