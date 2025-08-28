import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../contexts/CartContext";
import { CartDrawer } from "../components/cart/CartDrawer";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

import Home from "../pages/Home";
import ProductsPage from "../pages/Products";
import ProductDetails from "../pages/Products/Details";
import Contact from "../pages/Contact";
import OffersPage from "../pages/Offers";
import About from "../pages/About";
import HelpPage from "../pages/Help";
import PrivacyPage from "../pages/Privacy";
import TermsPage from "../pages/Terms";
import CookiesPage from "../pages/Cookies";
import ShippingPage from "../pages/Shipping";
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProducts from "../pages/Admin/Products";
import AdminOffers from "../pages/Admin/Offers";
import AdminCategories from "../pages/Admin/Categories";
import ProductForm from "../components/admin/ProductForm";
import CategoryForm from "../components/admin/CategoryForm";
import OfferForm from "../components/admin/OfferForm";
import Placeholder from "../pages/Admin/Placeholder";
import { 
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
      <Routes>
        {/* Admin Routes - No Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Admin Dashboard" subtitle="Manage your store and products">
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Products" subtitle="Manage your products">
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/add" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Add Product" subtitle="Create a new product" showBackButton backTo="/admin/products">
                <ProductForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/edit/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Edit Product" subtitle="Update product information" showBackButton backTo="/admin/products">
                <ProductForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/offers" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Offers" subtitle="Manage your offers">
                <AdminOffers />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Categories" subtitle="Manage your product categories">
                <AdminCategories />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories/add" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Add Category" subtitle="Create a new category" showBackButton backTo="/admin/categories">
                <CategoryForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories/edit/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Edit Category" subtitle="Update category information" showBackButton backTo="/admin/categories">
                <CategoryForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/offers/add" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Add Offer" subtitle="Create a new offer" showBackButton backTo="/admin/offers">
                <OfferForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/offers/edit/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Edit Offer" subtitle="Update offer information" showBackButton backTo="/admin/offers">
                <OfferForm />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Analytics" subtitle="View sales and performance data">
                <Placeholder 
                  title="Analytics" 
                  description="View sales and performance data"
                  icon={BarChart3}
                />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Users" subtitle="Manage customer accounts">
                <Placeholder 
                  title="Users" 
                  description="Manage customer accounts"
                  icon={Users}
                />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <AdminLayout title="Settings" subtitle="Configure store settings">
                <Placeholder 
                  title="Settings" 
                  description="Configure store settings"
                  icon={Settings}
                />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        {/* Public Routes - With Header/Footer */}
        <Route path="/*" element={
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />
          </div>
        } />
      </Routes>
    </CartProvider>
  );
};

export default RootLayout; 