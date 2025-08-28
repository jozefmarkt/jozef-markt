import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Package, TrendingUp, Tag, Home, Video, Folder, LogOut, User } from 'lucide-react';
import { productService } from '../../services/supabase';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation('admin');
  const { user, logout } = useAuth();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const stats = {
    totalProducts: products?.length || 0,
    inStock: products?.filter(p => p.in_stock).length || 0,
    outOfStock: products?.filter(p => !p.in_stock).length || 0,
    totalValue: products?.reduce((sum, p) => sum + p.price, 0) || 0,
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-sm sm:text-base text-gray-600">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* User Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="truncate">{user?.username}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
              
              <LanguageSwitcher />
            </div>
          </div>
          
          {/* Admin Navigation */}
          <nav className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8 border-t border-gray-200 pt-4 overflow-x-auto">
            <Link
              to="/admin"
              className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              <span>{t('dashboard.title')}</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300 whitespace-nowrap"
            >
              <Package className="h-4 w-4" />
              <span>{t('products.title')}</span>
            </Link>
            <Link
              to="/admin/offers"
              className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300 whitespace-nowrap"
            >
              <Tag className="h-4 w-4" />
              <span>{t('offers.title')}</span>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300 whitespace-nowrap"
            >
              <Folder className="h-4 w-4" />
              <span>{t('categories.title')}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('dashboard.stats.totalProducts')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {stats.totalProducts}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('dashboard.stats.inStock')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {stats.inStock}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('dashboard.stats.outOfStock')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {stats.outOfStock}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('dashboard.stats.totalValue')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        €{stats.totalValue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
              {t('dashboard.quickActions')}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/admin/products"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:shadow-lg transition-shadow"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                    <Package className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {t('dashboard.actions.manageProducts')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {t('dashboard.actions.manageProductsDesc')}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H9v2h11V3zM4.707 18.707l-1-1 1.414-1.414 1 1-1.414 1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/admin/products/add"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:shadow-lg transition-shadow"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <Package className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {t('dashboard.actions.addProduct')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {t('dashboard.actions.addProductDesc')}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H9v2h11V3zM4.707 18.707l-1-1 1.414-1.414 1 1-1.414 1.414z" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/admin/offers"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:shadow-lg transition-shadow"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <Tag className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {t('offers.title')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {t('offers.subtitle')}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H9v2h11V3zM4.707 18.707l-1-1 1.414-1.414 1 1-1.414 1.414z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* TikTok Management */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
              <Video className="h-5 w-5 mr-2 text-purple-600" />
              TikTok Video Management
            </h3>
            {/* The TikTokManager component was removed, so this section is now empty */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 