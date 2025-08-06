import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { productsApi } from '../../services/api';
import { cloudinaryService } from '../../services/cloudinary';
import { Product } from '../../types';
import LanguageSwitcher from './LanguageSwitcher';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  nutrition: string;
  inStock: boolean;
  image: string;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    nutrition: '',
    inStock: true,
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch product data if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id!),
    enabled: isEditing && Boolean(id),
  });

  // Load existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price,
        category: existingProduct.category,
        nutrition: existingProduct.nutrition,
        inStock: existingProduct.inStock,
        image: existingProduct.image,
      });
      setImagePreview(existingProduct.image);
    }
  }, [existingProduct]);

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    return cloudinaryService.uploadImage(file);
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return productsApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return productsApi.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      navigate('/admin/products');
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const submitData = {
        ...formData,
        image: imageUrl,
      };

      if (isEditing) {
        await updateProductMutation.mutateAsync(submitData);
      } else {
        await createProductMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  if (isLoadingProduct) {
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/products')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? t('productForm.editTitle') : t('productForm.addTitle')}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? t('productForm.editSubtitle') : t('productForm.addSubtitle')}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('productForm.image.label')}
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-32 w-32 rounded-lg object-cover border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {t('productForm.image.uploadText')}
                      </p>
                      <p className="text-xs text-gray-500">{t('productForm.image.fileTypes')}</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('productForm.fields.name.label')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('productForm.fields.name.placeholder')}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('productForm.fields.description.label')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('productForm.fields.description.placeholder')}
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  {t('productForm.fields.price.label')}
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('productForm.fields.price.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  {t('productForm.fields.category.label')}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">{t('productForm.fields.category.placeholder')}</option>
                  <option value="Vegetables">{t('productForm.categories.vegetables')}</option>
                  <option value="Fruits">{t('productForm.categories.fruits')}</option>
                  <option value="Dairy">{t('productForm.categories.dairy')}</option>
                  <option value="Bakery">{t('productForm.categories.bakery')}</option>
                  <option value="Meat">{t('productForm.categories.meat')}</option>
                  <option value="Cheese">{t('productForm.categories.cheese')}</option>
                  <option value="Beverages">{t('productForm.categories.beverages')}</option>
                  <option value="Snacks">{t('productForm.categories.snacks')}</option>
                  <option value="Pantry">{t('productForm.categories.pantry')}</option>
                </select>
              </div>
            </div>

            {/* Nutrition Information */}
            <div>
              <label htmlFor="nutrition" className="block text-sm font-medium text-gray-700">
                {t('productForm.fields.nutrition.label')}
              </label>
              <textarea
                id="nutrition"
                name="nutrition"
                value={formData.nutrition}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('productForm.fields.nutrition.placeholder')}
              />
            </div>

            {/* Stock Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                {t('productForm.fields.inStock.label')}
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                              <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('productForm.buttons.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isUploading || createProductMutation.isPending || updateProductMutation.isPending}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading || createProductMutation.isPending || updateProductMutation.isPending
                    ? t('productForm.buttons.saving')
                    : isEditing
                    ? t('productForm.buttons.update')
                    : t('productForm.buttons.create')}
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductForm; 