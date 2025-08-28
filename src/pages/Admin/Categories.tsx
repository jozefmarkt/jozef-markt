import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Folder,
  AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';
import { categoryService } from '../../services/supabase';
import type { Category } from '../../services/supabase';



const AdminCategories: React.FC = () => {
  const { t, i18n } = useTranslation('admin');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch categories from database
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // Helper function to get category name in current language
  const getCategoryName = (category: Category): string => {
    switch (i18n.language) {
      case 'nl':
        return category.name_nl || category.name;
      case 'ar':
        return category.name_ar || category.name;
      default:
        return category.name;
    }
  };



  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    }
  });

  const handleDelete = (categoryId: string) => {
    deleteMutation.mutate(categoryId);
  };

  const handleEdit = (category: Category) => {
    navigate(`/admin/categories/edit/${category.id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/categories/add');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 space-y-4 sm:space-y-0 admin-header-mobile">
            <div className="flex items-center">
              <Link
                to="/admin"
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('backToDashboard')}
              </Link>
              <div className="flex items-center">
                <Folder className="h-8 w-8 text-lion-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">{t('categories.title')}</h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto controls">
              <LanguageSwitcher />
              <button
                onClick={handleAddNew}
                className="bg-lion-500 text-white px-4 py-2 rounded-lg hover:bg-lion-600 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('categories.addCategory')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Folder className="h-8 w-8 text-lion-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">{t('categories.totalCategories')}</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">{t('categories.activeCategories')}</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">{t('categories.recentlyUpdated')}</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('categories.allCategories')}</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lion-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">{t('loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('error')}</h3>
                <p className="text-gray-600 mb-6">{error.message}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('categories.noCategories')}</h3>
                <p className="text-gray-600 mb-6">{t('categories.noCategoriesDescription')}</p>
                <button
                  onClick={handleAddNew}
                  className="bg-lion-500 text-white px-6 py-3 rounded-lg hover:bg-lion-600 transition-colors duration-200"
                >
                  {t('categories.addFirstCategory')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-3"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {category.icon}
                        </div>
                                                 <div>
                           <h3 className="font-semibold text-gray-900">{getCategoryName(category)}</h3>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('categories.lastUpdated')}: {new Date(category.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('categories.deleteModal.title')}</h3>
            <p className="text-gray-600 mb-6">{t('categories.deleteModal.message')}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {t('categories.deleteModal.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? t('deleting') : t('categories.deleteModal.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
