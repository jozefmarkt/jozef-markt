import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';

const SectionHero = () => {
  const { t } = useTranslation('common');
  
  return (
  <section className="relative isolate bg-cover bg-center bg-[url('/hero%20banner.png')] after:absolute after:inset-0 after:bg-jet/60 min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 mx-auto flex max-w-2xl flex-col items-center py-48 text-center text-white-500 justify-center min-h-screen"
    >
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
        {t('hero.title')}
      </h1>
      <p className="mt-6 text-xl text-white-400 sm:text-2xl">
        {t('hero.subtitle')}
      </p>
      <Button
        className="mt-10 bg-lion-500 px-10 py-4 text-lg font-semibold text-white-500 hover:bg-lion-600 focus:outline-none focus:ring-4 focus:ring-lion-700"
        aria-label={t('cta.shop')}
      >
        {t('cta.shop')}
      </Button>
      <span className="mt-4 text-base text-white-300">
        {t('hero.shipping')}
      </span>
    </motion.div>
  </section>
  );
};

export default SectionHero; 