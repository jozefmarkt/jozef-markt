import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X, Tag } from 'lucide-react';
import { offerService } from '../../services/supabase';
import { cloudinaryService } from '../../services/cloudinary';

import LanguageSwitcher from './LanguageSwitcher';

interface OfferFormData {
  title: string;
  title_nl?: string;
  title_ar?: string;
  description: string;
  description_nl?: string;
  description_ar?: string;
  price: number;
  price_before?: number;
  price_after?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product_ids?: string[];
  category_ids?: string[];
  image?: string;
}

const OfferForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    title_nl: '',
    title_ar: '',
    description: '',
    description_nl: '',
    description_ar: '',
    price: 0,
    price_before: 0,
    price_after: 0,
    start_date: '',
    end_date: '',
    is_active: true,
    product_ids: [],
    category_ids: [],
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch offer data if editing
  const { data: existingOffer, isLoading: isLoadingOffer } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offerService.getById(id!),
    enabled: isEditing && Boolean(id),
  });

  // Load existing offer data
  useEffect(() => {
    if (existingOffer) {
      setFormData({
        title: existingOffer.title,
        title_nl: existingOffer.title_nl || '',
        title_ar: existingOffer.title_ar || '',
        description: existingOffer.description,
        description_nl: existingOffer.description_nl || '',
        description_ar: existingOffer.description_ar || '',
        price: existingOffer.price || 0,
        price_before: existingOffer.price_before || 0,
        price_after: existingOffer.price_after || 0,
        start_date: existingOffer.start_date.split('T')[0], // Format for date input
        end_date: existingOffer.end_date.split('T')[0],
        is_active: existingOffer.is_active,
        product_ids: existingOffer.product_ids,
        category_ids: existingOffer.category_ids,
        image: existingOffer.image,
      });
      setImagePreview(existingOffer.image || '');
    }
  }, [existingOffer]);

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

  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (data: OfferFormData) => {
      return offerService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      navigate('/admin/offers');
    },
  });

  // Update offer mutation
  const updateOfferMutation = useMutation({
    mutationFn: async (data: OfferFormData) => {
      return offerService.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      navigate('/admin/offers');
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
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      if (isEditing) {
        await updateOfferMutation.mutateAsync(submitData);
      } else {
        await createOfferMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
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

  if (isLoadingOffer) {
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
                onClick={() => navigate('/admin/offers')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? t('offerForm.editTitle') : t('offerForm.addTitle')}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? t('offerForm.editSubtitle') : t('offerForm.addSubtitle')}
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
            {/* Offer Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('offerForm.image.label')}
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Offer preview"
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
                      <Tag className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {t('offerForm.image.uploadText')}
                      </p>
                      <p className="text-xs text-gray-500">{t('offerForm.image.fileTypes')}</p>
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
                
                {/* Offer Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter offer title"
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
                    placeholder="Enter offer description"
                  />
                </div>
              </div>

              {/* Dutch Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">NL</div>
                  <h3 className="text-lg font-semibold text-gray-900">Nederlands</h3>
                </div>
                
                {/* Offer Title */}
                <div className="mb-4">
                  <label htmlFor="title_nl" className="block text-sm font-medium text-gray-700 mb-1">
                    Aanbiedingstitel
                  </label>
                  <input
                    type="text"
                    id="title_nl"
                    name="title_nl"
                    value={formData.title_nl || ''}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Voer aanbiedingstitel in"
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
                    value={formData.description_nl || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Voer aanbiedingsbeschrijving in"
                  />
                </div>
              </div>

              {/* Arabic Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">ع</div>
                  <h3 className="text-lg font-semibold text-gray-900">العربية</h3>
                </div>
                
                {/* Offer Title */}
                <div className="mb-4">
                  <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان العرض
                  </label>
                  <input
                    type="text"
                    id="title_ar"
                    name="title_ar"
                    value={formData.title_ar || ''}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    placeholder="أدخل عنوان العرض"
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
                    value={formData.description_ar || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    placeholder="أدخل وصف العرض"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Shared Fields */}
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h3>
              
              {/* Price Settings */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.price.label')}
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
                  placeholder={t('offerForm.fields.price.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="price_before" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.price_before.label')}
                </label>
                <input
                  type="number"
                  id="price_before"
                  name="price_before"
                  value={formData.price_before || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('offerForm.fields.price_before.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="price_after" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.price_after.label')}
                </label>
                <input
                  type="number"
                  id="price_after"
                  name="price_after"
                  value={formData.price_after || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('offerForm.fields.price_after.placeholder')}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.start_date.label')}
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.end_date.label')}
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                {t('offerForm.fields.is_active.label')}
              </label>
            </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                              <button
                  type="button"
                  onClick={() => navigate('/admin/offers')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('offerForm.buttons.cancel')}
                </button>
              <button
                type="submit"
                disabled={isUploading || createOfferMutation.isPending || updateOfferMutation.isPending}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading || createOfferMutation.isPending || updateOfferMutation.isPending
                  ? t('offerForm.buttons.saving')
                  : isEditing
                  ? t('offerForm.buttons.update')
                  : t('offerForm.buttons.create')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OfferForm; 