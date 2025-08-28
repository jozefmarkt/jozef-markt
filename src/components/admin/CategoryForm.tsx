import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Category } from '../../services/supabase';
import { categoryService } from '../../services/supabase';

interface CategoryFormData {
  name: string;
  name_nl: string;
  name_ar: string;
  color: string;
  icon: string;
}

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    name_nl: '',
    name_ar: '',
    color: '#4ade80',
    icon: '📦'
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  // Fetch existing category data if editing
  const { data: existingCategory } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id!),
    enabled: isEditing && !!id,
  });

  // Load existing category data
  useEffect(() => {
    if (existingCategory) {
      setFormData({
        name: existingCategory.name || '',
        name_nl: existingCategory.name_nl || '',
        name_ar: existingCategory.name_ar || '',
        color: existingCategory.color,
        icon: existingCategory.icon
      });
    }
  }, [existingCategory]);

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('categories.validation.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update category mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => 
      categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      navigate('/admin/categories');
    },
    onError: (error) => {
      console.error('Error updating category:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && id) {
        updateMutation.mutate({ id, data: formData });
      } else {
        createMutation.mutate(formData);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  const colorOptions = [
    { value: '#4ade80', label: 'Green' },
    { value: '#fbbf24', label: 'Yellow' },
    { value: '#60a5fa', label: 'Blue' },
    { value: '#f87171', label: 'Red' },
    { value: '#a78bfa', label: 'Purple' },
    { value: '#fb7185', label: 'Pink' },
    { value: '#34d399', label: 'Emerald' },
    { value: '#f59e0b', label: 'Amber' }
  ];

  const iconOptions = [
    '🥬', '🍎', '🥛', '🍞', '🥩', '🧀', '🥤', '🍪', '📦', '☕', '🌶️', '🥑', '🍇', '🥕', '🥔', '🧅'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('backToCategories')}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? t('categories.editCategory') : t('categories.addCategory')}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('categories.basicInfo')}</h3>
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('categories.name')} (EN) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lion-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('categories.namePlaceholder')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('categories.name')} (NL)
                  </label>
                  <input
                    type="text"
                    value={formData.name_nl}
                    onChange={(e) => handleInputChange('name_nl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lion-500 focus:border-transparent"
                    placeholder={t('categories.namePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('categories.name')} (AR)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => handleInputChange('name_ar', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lion-500 focus:border-transparent"
                    placeholder={t('categories.namePlaceholder')}
                    dir="rtl"
                  />
                </div>
              </div>

              
            </div>

            {/* Visual Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('categories.visualSettings')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('categories.color')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleInputChange('color', color.value)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                          formData.color === color.value 
                            ? 'border-gray-900 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('categories.icon')}
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleInputChange('icon', icon)}
                        className={`w-10 h-10 rounded-lg border-2 text-lg transition-all duration-200 ${
                          formData.icon === icon 
                            ? 'border-gray-900 bg-gray-100 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t('categories.preview')}</h4>
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-3"
                    style={{ backgroundColor: formData.color + '20' }}
                  >
                    {formData.icon}
                  </div>
                                     <div>
                     <h3 className="font-semibold text-gray-900">{formData.name || t('categories.previewName')}</h3>
                   </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-lion-500 text-white px-6 py-2 rounded-lg hover:bg-lion-600 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending 
                  ? t('saving') 
                  : (isEditing ? t('update') : t('create'))
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CategoryForm;
