import { Link } from "react-router-dom";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isArabic = i18n.language === 'ar';
  const { state, toggle } = useCart();

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
    i18n.changeLanguage(newLang);
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
        <motion.div 
          className="container mx-auto flex items-center justify-between px-6 py-3 relative"
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
          <Link to="/" className="flex items-center flex-shrink-0 gap-3">
            <motion.img 
              src="/logo-symbol-text.png" 
              alt="Jozef Supermarkt Logo" 
              className="h-16 w-auto object-contain drop-shadow-sm"
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
              className="h-12 w-auto object-contain drop-shadow-sm"
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
            className={`hidden md:flex items-center gap-8 text-base lg:text-lg`}
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
            className="flex items-center gap-4 md:gap-5"
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
            {/* Cart button */}
            <button
              onClick={toggle}
              className="relative p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-lion-500 transition-colors duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-lion-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Language switcher */}
            <button 
              onClick={handleLanguageChange}
              className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-base hover:bg-gray-50 hover:border-lion-300 transition-all duration-300 hover:scale-105 font-semibold text-gray-700 hover:text-lion-500"
            >
              {i18n.language === 'ar' ? 'العربية' : i18n.language === 'nl' ? 'NL' : 'EN'} 
              <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </motion.div>
        </motion.div>
      </header>

    </>
  );
};

export default Header; 