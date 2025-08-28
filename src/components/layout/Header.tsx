import { Link } from "react-router-dom";
import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { setUserLanguageChoice } from "../../i18n";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isArabic = i18n.language === 'ar';
  const { state, toggle } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // WhatsApp configuration - change this to your number first, then to the final number
  const whatsappNumber = '+31623735563'; // Your WhatsApp number
  const whatsappMessage = t('whatsapp.message');

  const handleWhatsAppClick = () => {
    const formattedNumber = whatsappNumber.replace(/\s+/g, '').replace(/[()]/g, '');
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    
    // Try to open in WhatsApp app first, fallback to web
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Mobile device - try to open WhatsApp app
      window.location.href = whatsappUrl;
    } else {
      // Desktop - open in new tab
      window.open(whatsappUrl, '_blank');
    }
  };

  // Scroll animation for logo - simplified
  const { scrollY } = useScroll();
  
  
  // Simplified animations - only essential ones with better performance
  // Reduced scroll range to 25px for even smoother, more responsive animations
  const logoScale = useTransform(scrollY, [0, 25], [1.8, 1]);
  const logoOpacity = useTransform(scrollY, [0, 25], [1, 0]);
  const headerHeight = useTransform(scrollY, [0, 25], [140, 80]);
  const navOpacity = useTransform(scrollY, [0, 25], [0, 1]);
  const rightComponentsOpacity = useTransform(scrollY, [0, 25], [0, 1]);
  const writingOpacity = useTransform(scrollY, [0, 25], [0, 1]);
  
  // Left side logo should fade out when centered logo appears
  // When centered logo is big (scroll 0), left logo should be hidden
  // When centered logo is small (scroll 25), left logo should be visible
  const leftLogoOpacity = useTransform(scrollY, [0, 25], [0, 1]);

  // Navigation split opacity - when logo is big, show split nav
  const splitNavOpacity = useTransform(scrollY, [0, 25], [1, 0]);

  // Mobile specific animations
  const mobileLogoOpacity = useTransform(scrollY, [0, 25], [1, 0]);
  const mobileLeftLogoOpacity = useTransform(scrollY, [0, 25], [0, 1]);
  const mobileRightComponentsOpacity = useTransform(scrollY, [0, 25], [0, 1]);

  // Pointer events control to prevent overlapping clicks
  const [splitNavPE, setSplitNavPE] = useState<'auto' | 'none'>('auto');
  const [mainNavPE, setMainNavPE] = useState<'auto' | 'none'>('none');
  const [rightComponentsPE, setRightComponentsPE] = useState<'auto' | 'none'>('none');

  useEffect(() => {
    const unsub1 = splitNavOpacity.on('change', (v) => {
      setSplitNavPE(v > 0.3 ? 'auto' : 'none');
      setRightComponentsPE(v > 0.3 ? 'none' : 'auto');
    });
    const unsub2 = navOpacity.on('change', (v) => {
      setMainNavPE(v > 0.3 ? 'auto' : 'none');
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [splitNavOpacity, navOpacity]);

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    let newLang;
    if (currentLang === 'en') {
      newLang = 'nl';
    } else if (currentLang === 'nl') {
      newLang = 'ar';
    } else {
      newLang = 'en';
    }
    // Use the new function to mark this as an explicit user choice
    setUserLanguageChoice(newLang);
  };

  const totalItems = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.qty, 0), 
    [state.items]
  );

  // Navigation items - language aware
  const smallNavItems = isArabic
    ? [
        { to: "/", key: "home" },
        { to: "/products", key: "products" },
        { to: "/offers", key: "offers" },
        { to: "/contact", key: "contact" },
      ]
    : [
        { to: "/", key: "home" },
        { to: "/products", key: "products" },
        { to: "/offers", key: "offers" },
        { to: "/contact", key: "contact" },
      ];

  const leftSplitPosition = isArabic ? 'right-8' : 'left-8';
  const rightSplitPosition = isArabic ? 'left-8' : 'right-16';

  const leftSplitItems = isArabic
    ? [
        { to: "/", key: "home" },
        { to: "/products", key: "products" },
      ]
    : [
        { to: "/", key: "home" },
        { to: "/products", key: "products" },
      ];

  const rightSplitItems = [
    { to: "/offers", key: "offers" },
    { to: "/contact", key: "contact" },
  ];



  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        {/* Mobile header - Clean and simple */}
        <motion.div 
          className="md:hidden relative w-full px-4 py-3"
          style={{ height: headerHeight }}
        >
          {/* Top row - Logo and actions */}
          <div className="flex items-center justify-between h-full">
            {/* Left side - Small logo (always visible) */}
            <motion.div
              style={{ opacity: mobileLeftLogoOpacity }}
              className="flex items-center flex-shrink-0"
            >
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo-symbol-text.png" 
                  alt="Jozef Supermarkt Logo" 
                  className="h-10 w-auto object-contain drop-shadow-sm"
                />
              </Link>
            </motion.div>

            {/* Center - Large logo (only when at top) */}
            <motion.div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                opacity: mobileLogoOpacity,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                mass: 0.8
              }}
            >
              <img 
                src="/logo-symbol-text.png" 
                alt="Jozef Supermarkt Logo" 
                className="h-24 w-auto object-contain drop-shadow-sm"
              />
            </motion.div>

            {/* Right side - Action buttons */}
            <motion.div 
              className="flex items-center gap-2"
              style={{ 
                opacity: mobileRightComponentsOpacity,
                pointerEvents: rightComponentsPE
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                mass: 0.8
              }}
            >
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center bg-lion-500 text-white p-2 rounded-lg hover:bg-lion-600 transition-all duration-300 hover:scale-105 shadow-md"
                aria-label="Chat on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>

              <button
                onClick={toggle}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 group"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={18} className="text-gray-700 group-hover:text-lion-500 transition-colors duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lion-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>

              <button 
                onClick={handleLanguageChange}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-sm hover:bg-gray-50 hover:border-lion-300 transition-all duration-300 hover:scale-105 font-semibold text-gray-700 hover:text-lion-500"
              >
                <span>{i18n.language === 'ar' ? 'عربي' : i18n.language === 'nl' ? 'NL' : 'EN'}</span>
                <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X size={18} className="text-gray-700" />
                ) : (
                  <Menu size={18} className="text-gray-700" />
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop header */}
        <motion.div 
          className="hidden md:flex container mx-auto items-center justify-between px-4 sm:px-6 py-3 relative"
          style={{ height: headerHeight }}
        >
            {/* Single animated logo - simplified */}
            <motion.div 
              className="absolute left-1/2 top-1/2 z-10"
              style={{
                x: "-50%",
                y: "-30%",
                scale: logoScale,
                opacity: logoOpacity,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                mass: 0.8
              }}
            >
              <img 
                src="/logo-symbol-text.png" 
                alt="Jozef Supermarkt Logo" 
                className="h-24 w-auto object-contain drop-shadow-sm"
                style={{
                  filter: 'none',
                  transform: 'none',
                  display: 'block',
                  maxWidth: 'none',
                  willChange: 'transform'
                }}
              />
            </motion.div>

            {/* Left side logo and writing */}
            <Link to="/" className="flex items-center flex-shrink-0 gap-2 sm:gap-3">
              <motion.img 
                src="/logo-symbol-text.png" 
                alt="Jozef Supermarkt Logo" 
                className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm"
                style={{
                  opacity: leftLogoOpacity
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.8
                }}
              />
              <motion.img 
                src="/writing.png" 
                alt="Jozef Markt Writing" 
                className="h-8 sm:h-12 w-auto object-contain drop-shadow-sm hidden sm:block"
                style={{ opacity: writingOpacity }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.8
                }}
              />
            </Link>

          {/* Split Navigation - Left Side (when logo is big) */}
          <motion.nav 
            className={`absolute ${leftSplitPosition} top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-8 z-20`}
            style={{ opacity: splitNavOpacity, pointerEvents: splitNavPE }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              mass: 0.8
            }}
          >
            {leftSplitItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="nav-link text-lg font-semibold text-gray-800"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          </motion.nav>

          {/* Split Navigation - Right Side (when logo is big) */}
          <motion.nav 
            className={`absolute ${rightSplitPosition} top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-8 z-20`}
            style={{ 
              opacity: splitNavOpacity, 
              pointerEvents: splitNavPE
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              mass: 0.8
            }}
          >
            {rightSplitItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="nav-link text-lg font-semibold text-gray-800"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          </motion.nav>

          {/* Normal Navigation (when logo is small) */}
          <motion.nav 
            className={`hidden md:flex items-center justify-center gap-8 text-base lg:text-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            style={{ opacity: navOpacity, pointerEvents: mainNavPE }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              mass: 0.8
            }}
          >
            {smallNavItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="nav-link font-semibold text-gray-800"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          </motion.nav>

          {/* Right side components */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-4 md:gap-5"
            style={{ 
              opacity: rightComponentsOpacity,
              pointerEvents: rightComponentsPE
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              mass: 0.8
            }}
          >
            {/* WhatsApp button - icon only on mobile */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-lion-500 text-white px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-lion-600 transition-all duration-300 hover:scale-105 font-semibold shadow-md"
              aria-label="Chat on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 sm:w-5 sm:h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="hidden sm:inline">{t('whatsapp.button')}</span>
            </button>

            {/* Cart button */}
            <button
              onClick={toggle}
              className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} className="text-gray-700 group-hover:text-lion-500 transition-colors duration-300 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-lion-500 text-white text-xs sm:text-sm rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Language switcher - compact on mobile */}
            <button 
              onClick={handleLanguageChange}
              className="flex items-center gap-1 sm:gap-2 rounded-lg border-2 border-gray-200 px-2 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-50 hover:border-lion-300 transition-all duration-300 hover:scale-105 font-semibold text-gray-700 hover:text-lion-500"
            >
              <span className="hidden xs:inline">{i18n.language === 'ar' ? 'العربية' : i18n.language === 'nl' ? 'NL' : 'EN'}</span>
              <span className="xs:hidden">{i18n.language === 'ar' ? 'عربي' : i18n.language === 'nl' ? 'NL' : 'EN'}</span>
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180 sm:w-4 sm:h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Mobile Navigation Menu - Elegant slide down */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-3">
                {smallNavItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="nav-link text-lg font-semibold text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </header>

    </>
  );
};

export default Header; 