import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <footer className="mt-auto bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">{t('footer.company')}</h4>
          <Link to="/about" className="footer-link">{t('footer.about')}</Link>
          <Link to="/press" className="footer-link">{t('footer.press')}</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">{t('footer.support')}</h4>
          <Link to="/help" className="footer-link">{t('footer.help')}</Link>
          <Link to="/contact" className="footer-link">{t('footer.contact')}</Link>
          <Link to="/shipping" className="footer-link">{t('footer.shipping')}</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">{t('footer.legal')}</h4>
          <Link to="/privacy" className="footer-link">{t('footer.privacy')}</Link>
          <Link to="/terms" className="footer-link">{t('footer.terms')}</Link>
          <Link to="/cookies" className="footer-link">{t('footer.cookies')}</Link>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
};

export default Footer; 