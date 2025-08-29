import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertTriangle,
  Star
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/supabase';
import type { Product } from '../../services/supabase';

const AdminProducts: React.FC = () => {
  const { t, i18n } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const currentLanguage = i18n.language;
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  // Helper function to get product name in current language
  const getProductName = (product: Product): string => {
    switch (currentLanguage) {
      case 'nl':
        return product.name_nl || product.name;
      case 'ar':
        return product.name_ar || product.name;
      default:
        return product.name;
    }
  };

  // Helper function to get product description in current language
  const getProductDescription = (product: Product): string => {
    switch (currentLanguage) {
      case 'nl':
        return product.description_nl || product.description;
      case 'ar':
        return product.description_ar || product.description;
      default:
        return product.description;
    }
  };

  // Helper function to get category name in current language
  const getCategoryName = (category: string): string => {
    const categoryKey = category.toLowerCase();
    return t(`categoryNames.${categoryKey}`) || category;
  };

  const deleteProductMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteConfirm(null);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => 
      productService.toggleFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleToggleFeatured = (productId: string, currentFeatured: boolean) => {
    toggleFeaturedMutation.mutate({ id: productId, featured: !currentFeatured });
  };

  const handleDelete = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{t('products.error')}</h2>
          <p className="text-gray-600">{t('products.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Add Product Button */}
      <div className="mb-6 flex justify-end">
        <Link
          to="/admin/products/add"
          className="flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('products.addProduct')}
        </Link>
      </div>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('products.stats.totalProducts')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {products?.length || 0}
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
                    <Package className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('products.stats.inStock')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {products?.filter(p => p.in_stock).length || 0}
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
                        {t('products.stats.outOfStock')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {products?.filter(p => !p.in_stock).length || 0}
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
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                        {t('products.stats.featuredProducts')}
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {products?.filter(p => p.featured).length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                {t('products.table.title')}
              </h3>
            </div>
            
            {/* Mobile Cards View */}
            <div className="block sm:hidden">
              {products?.map((product) => (
                <div key={product.id} className="border-b border-gray-200 p-4">
                  <div className={`flex items-center ${
                    currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : 'space-x-3'
                  }`}>
                    <img 
                      className="h-12 w-12 rounded-lg object-contain" 
                      src={product.image} 
                      alt={getProductName(product)}
                    />
                    <div className={`flex-1 min-w-0 ${
                      currentLanguage === 'ar' ? 'text-right' : 'text-left'
                    }`}>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {getProductName(product)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {getProductDescription(product).substring(0, 30)}...
                      </div>
                      <div className={`flex items-center mt-1 ${
                        currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'
                      }`}>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryName(product.category)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          €{product.price}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.in_stock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.in_stock ? t('products.table.inStock') : t('products.table.outOfStock')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        className={`p-1 rounded ${
                          product.featured 
                            ? 'text-yellow-600 bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      currentLanguage === 'ar' ? 'text-right' : 'text-left'
                    }`}>
                      {t('products.table.product')}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      currentLanguage === 'ar' ? 'text-right' : 'text-left'
                    }`}>
                      {t('products.table.category')}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      currentLanguage === 'ar' ? 'text-right' : 'text-left'
                    }`}>
                      {t('products.table.price')}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      currentLanguage === 'ar' ? 'text-right' : 'text-left'
                    }`}>
                      {t('products.table.stock')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('products.table.featured')}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      currentLanguage === 'ar' ? 'text-left' : 'text-right'
                    }`}>
                      {t('products.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products?.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className={`px-6 py-4 whitespace-nowrap product-cell ${
                        currentLanguage === 'ar' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`flex items-center product-layout ${
                          currentLanguage === 'ar' ? 'flex-row-reverse justify-end' : 'flex-row'
                        }`}>
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-lg object-contain" 
                              src={product.image} 
                              alt={getProductName(product)}
                            />
                          </div>
                          <div className={`${
                            currentLanguage === 'ar' ? 'mr-4 text-right w-full' : 'ml-4'
                          }`}>
                            <div className={`text-sm font-medium text-gray-900 ${
                              currentLanguage === 'ar' ? 'text-right' : ''
                            }`}>
                              {getProductName(product)}
                            </div>
                            <div className={`text-sm text-gray-500 ${
                              currentLanguage === 'ar' ? 'text-right' : ''
                            }`}>
                              {getProductDescription(product).substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        currentLanguage === 'ar' ? 'text-right' : 'text-left'
                      }`}>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        currentLanguage === 'ar' ? 'text-right' : 'text-left'
                      }`}>
                        €{product.price.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        currentLanguage === 'ar' ? 'text-right' : 'text-left'
                      }`}>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.in_stock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.in_stock ? t('products.table.inStock') : t('products.table.outOfStock')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.featured || false)}
                          disabled={toggleFeaturedMutation.isPending}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            product.featured 
                              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                              : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
                          }`}
                          title={product.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star className={`h-5 w-5 ${product.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        currentLanguage === 'ar' ? 'text-left' : 'text-right'
                      }`}>
                        <div className={`flex space-x-2 ${
                          currentLanguage === 'ar' ? 'justify-start' : 'justify-end'
                        }`}>
                                                      <Link
                              to={`/products/${product.id}`}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mt-4">{t('products.deleteModal.title')}</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      {t('products.deleteModal.message')}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-3 mt-4">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      {t('products.deleteModal.cancel')}
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {t('products.deleteModal.confirm')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  );
};

export default AdminProducts; 