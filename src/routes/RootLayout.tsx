import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../contexts/CartContext";
import { CartDrawer } from "../components/cart/CartDrawer";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import Home from "../pages/Home";
import ProductsPage from "../pages/Products";
import ProductDetails from "../pages/Products/Details";
import Contact from "../pages/Contact";
import OffersPage from "../pages/Offers";
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProducts from "../pages/Admin/Products";
import AdminOffers from "../pages/Admin/Offers";
import ProductForm from "../components/admin/ProductForm";
import OfferForm from "../components/admin/OfferForm";
import Placeholder from "../pages/Admin/Placeholder";
import { 
  Package, 
  Plus, 
  Settings, 
  Users, 
  BarChart3
} from 'lucide-react';

const RootLayout: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/add" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/edit/:id" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/offers" 
              element={
                <ProtectedRoute>
                  <AdminOffers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/offers/add" 
              element={
                <ProtectedRoute>
                  <OfferForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/offers/edit/:id" 
              element={
                <ProtectedRoute>
                  <OfferForm />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute>
                  <Placeholder 
                    title="Analytics" 
                    description="View sales and performance data"
                    icon={BarChart3}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <Placeholder 
                    title="Users" 
                    description="Manage customer accounts"
                    icon={Users}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <Placeholder 
                    title="Settings" 
                    description="Configure store settings"
                    icon={Settings}
                  />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default RootLayout; 