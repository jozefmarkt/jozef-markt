import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Calendar,
  Percent
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerService } from '../../services/supabase';
import type { Offer } from '../../services/supabase';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';

const AdminOffers: React.FC = () => {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: offerService.getAll,
  });

  const deleteOfferMutation = useMutation({
    mutationFn: offerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      setDeleteConfirm(null);
    },
  });

  const handleDelete = (offerId: string) => {
    deleteOfferMutation.mutate(offerId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (offer: Offer) => {
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);

    if (!offer.is_active) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
    }

    if (now < startDate) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Upcoming</span>;
    }

    if (now > endDate) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error loading offers</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                to="/admin"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('offers.title')}</h1>
                <p className="text-gray-600">{t('offers.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Link
                to="/admin/offers/add"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('offers.addOffer')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Tag className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('offers.stats.totalOffers')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {offers?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Tag className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('offers.stats.activeOffers')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {offers?.filter(o => o.is_active && new Date() >= new Date(o.start_date) && new Date() <= new Date(o.end_date)).length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('offers.stats.upcoming')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {offers?.filter(o => o.is_active && new Date() < new Date(o.start_date)).length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Percent className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('offers.stats.expired')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {offers?.filter(o => new Date() > new Date(o.end_date)).length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {offers?.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  {t('offers.empty')}
                </li>
              ) : (
                offers?.map((offer) => (
                  <li key={offer.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {offer.image ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={offer.image}
                              alt={offer.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{offer.title}</h3>
                            <div className="ml-2">
                              {getStatusBadge(offer)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{offer.description}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                            <span className="mx-2">•</span>
                            <Percent className="h-3 w-3 mr-1" />
                            {offer.discount_percentage}% off
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/offers/edit/${offer.id}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(offer.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900">{t('offers.deleteModal.title')}</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      {t('offers.deleteModal.message')}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      {t('offers.deleteModal.cancel')}
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {t('offers.deleteModal.delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOffers; 