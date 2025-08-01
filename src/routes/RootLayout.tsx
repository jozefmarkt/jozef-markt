import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../contexts/CartContext";
import { CartDrawer } from "../components/cart/CartDrawer";
import Home from "../pages/Home";
import ProductsPage from "../pages/Products";
import ProductDetails from "../pages/Products/Details";

const RootLayout: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetails />} />
            </Routes>
          </main>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default RootLayout; 