import { Link } from "react-router-dom";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { state, toggle } = useCart();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold">
          jozef&nbsp;supermarkt
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/products" className="nav-link">{t('nav.products')}</Link>
          <Link to="/offers" className="nav-link">{t('nav.offers')}</Link>
          <Link to="/account" className="nav-link">{t('nav.account')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart button */}
          <button
            onClick={toggle}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-lion-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Language switcher */}
          <button 
            onClick={handleLanguageChange}
            className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            {i18n.language === 'ar' ? 'العربية' : 'EN'} <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 