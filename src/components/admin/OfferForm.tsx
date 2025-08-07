import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X, Tag } from 'lucide-react';
import { offerService } from '../../services/supabase';
import { cloudinaryService } from '../../services/cloudinary';
import type { Offer } from '../../services/supabase';
import LanguageSwitcher from './LanguageSwitcher';

interface OfferFormData {
  title: string;
  description: string;
  discount_percentage: number;
  discount_amount?: number;
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
    description: '',
    discount_percentage: 0,
    discount_amount: 0,
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
        description: existingOffer.description,
        discount_percentage: existingOffer.discount_percentage,
        discount_amount: existingOffer.discount_amount,
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

            {/* Offer Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                {t('offerForm.fields.title.label')}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('offerForm.fields.title.placeholder')}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('offerForm.fields.description.label')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('offerForm.fields.description.placeholder')}
              />
            </div>

            {/* Discount Settings */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.discount_percentage.label')}
                </label>
                <input
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('offerForm.fields.discount_percentage.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="discount_amount" className="block text-sm font-medium text-gray-700">
                  {t('offerForm.fields.discount_amount.label')}
                </label>
                <input
                  type="number"
                  id="discount_amount"
                  name="discount_amount"
                  value={formData.discount_amount || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('offerForm.fields.discount_amount.placeholder')}
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