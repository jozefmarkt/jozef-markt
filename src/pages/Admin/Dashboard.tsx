import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../services/api';
import { 
  Package, 
  Plus, 
  Settings, 
  LogOut, 
  Users, 
  BarChart3,
  Image as ImageIcon
} from 'lucide-react';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation('admin');
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const adminCards = [
    {
      title: t('dashboard.cards.products.title'),
      description: t('dashboard.cards.products.description'),
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.cards.addProduct.title'),
      description: t('dashboard.cards.addProduct.description'),
      icon: Plus,
      href: '/admin/products/add',
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.cards.imageUpload.title'),
      description: t('dashboard.cards.imageUpload.description'),
      icon: ImageIcon,
      href: '/admin/images',
      color: 'bg-purple-500',
    },
    {
      title: t('dashboard.cards.analytics.title'),
      description: t('dashboard.cards.analytics.description'),
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-orange-500',
    },
    {
      title: t('dashboard.cards.users.title'),
      description: t('dashboard.cards.users.description'),
      icon: Users,
      href: '/admin/users',
      color: 'bg-pink-500',
    },
    {
      title: t('dashboard.cards.settings.title'),
      description: t('dashboard.cards.settings.description'),
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('dashboard.welcome', { username: user?.username })}</p>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {adminCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="relative group bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-2.5 rounded-lg ${card.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.stats.totalProducts')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {products?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.stats.activeProducts')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {products?.filter(p => p.inStock).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.stats.totalCustomers')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.stats.imagesUploaded')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 