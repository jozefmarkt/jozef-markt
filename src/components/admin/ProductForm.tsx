import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { productService } from '../../services/supabase';
import { cloudinaryService } from '../../services/cloudinary';
import LanguageSwitcher from './LanguageSwitcher';

interface ProductFormData {
  name: string;
  name_nl: string;
  name_ar: string;
  description: string;
  description_nl: string;
  description_ar: string;
  price: number;
  category: string;
  nutrition: string;
  nutrition_nl: string;
  nutrition_ar: string;
  in_stock: boolean;
  featured: boolean;
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
    name_nl: '',
    name_ar: '',
    description: '',
    description_nl: '',
    description_ar: '',
    price: 0,
    category: '',
    nutrition: '',
    nutrition_nl: '',
    nutrition_ar: '',
    in_stock: true,
    featured: false,
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch product data if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id!),
    enabled: isEditing && Boolean(id),
  });

  // Load existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        name_nl: existingProduct.name_nl || '',
        name_ar: existingProduct.name_ar || '',
        description: existingProduct.description || '',
        description_nl: existingProduct.description_nl || '',
        description_ar: existingProduct.description_ar || '',
        price: existingProduct.price,
        category: existingProduct.category,
        nutrition: existingProduct.nutrition || '',
        nutrition_nl: existingProduct.nutrition_nl || '',
        nutrition_ar: existingProduct.nutrition_ar || '',
        in_stock: existingProduct.in_stock,
        featured: existingProduct.featured,
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
      return productService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return productService.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image - Shared across all languages */}
            <div className="bg-white p-6 rounded-lg shadow">
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

            {/* Three Language Forms Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* English Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">EN</div>
                  <h3 className="text-lg font-semibold text-gray-900">English</h3>
                </div>
                
                {/* Product Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Nutrition Information */}
                <div className="mb-4">
                  <label htmlFor="nutrition" className="block text-sm font-medium text-gray-700 mb-1">
                    Nutrition Information
                  </label>
                  <textarea
                    id="nutrition"
                    name="nutrition"
                    value={formData.nutrition}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter nutrition information"
                  />
                </div>
              </div>

              {/* Dutch Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">NL</div>
                  <h3 className="text-lg font-semibold text-gray-900">Nederlands</h3>
                </div>
                
                {/* Product Name */}
                <div className="mb-4">
                  <label htmlFor="name_nl" className="block text-sm font-medium text-gray-700 mb-1">
                    Productnaam
                  </label>
                  <input
                    type="text"
                    id="name_nl"
                    name="name_nl"
                    value={formData.name_nl}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Voer productnaam in"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description_nl" className="block text-sm font-medium text-gray-700 mb-1">
                    Beschrijving
                  </label>
                  <textarea
                    id="description_nl"
                    name="description_nl"
                    value={formData.description_nl}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Voer productbeschrijving in"
                  />
                </div>

                {/* Nutrition Information */}
                <div className="mb-4">
                  <label htmlFor="nutrition_nl" className="block text-sm font-medium text-gray-700 mb-1">
                    Voedingsinformatie
                  </label>
                  <textarea
                    id="nutrition_nl"
                    name="nutrition_nl"
                    value={formData.nutrition_nl}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Voer voedingsinformatie in"
                  />
                </div>
              </div>

              {/* Arabic Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">ع</div>
                  <h3 className="text-lg font-semibold text-gray-900">العربية</h3>
                </div>
                
                {/* Product Name */}
                <div className="mb-4">
                  <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    id="name_ar"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    placeholder="أدخل اسم المنتج"
                    dir="rtl"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    placeholder="أدخل وصف المنتج"
                    dir="rtl"
                  />
                </div>

                {/* Nutrition Information */}
                <div className="mb-4">
                  <label htmlFor="nutrition_ar" className="block text-sm font-medium text-gray-700 mb-1">
                    معلومات التغذية
                  </label>
                  <textarea
                    id="nutrition_ar"
                    name="nutrition_ar"
                    value={formData.nutrition_ar}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    placeholder="أدخل معلومات التغذية"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Shared Fields */}
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              
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
                    <option value="Koffie">{t('productForm.categories.koffie')}</option>
                  </select>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in_stock"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-900">
                  {t('productForm.fields.inStock.label')}
                </label>
              </div>

              {/* Featured Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  {t('productForm.fields.featured.label')}
                </label>
              </div>
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