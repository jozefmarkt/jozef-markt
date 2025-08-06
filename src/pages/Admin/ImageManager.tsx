import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinary';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';

interface UploadedImage {
  id: string;
  url: string;
  publicId?: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

const ImageManager: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation('admin');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await cloudinaryService.uploadImage(file);
        
        const newImage: UploadedImage = {
          id: Date.now().toString() + i,
          url,
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
        };

        setUploadedImages(prev => [newImage, ...prev]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: UploadedImage) => {
    try {
      if (image.publicId) {
        await cloudinaryService.deleteImage(image.publicId);
      }
      setUploadedImages(prev => prev.filter(img => img.id !== image.id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
                <h1 className="text-3xl font-bold text-gray-900">{t('imageManager.title')}</h1>
                <p className="text-gray-600">{t('imageManager.subtitle')}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('imageManager.upload.title')}</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? t('imageManager.upload.uploading') : t('imageManager.upload.selectImages')}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {t('imageManager.upload.fileTypes')}
                </p>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('imageManager.gallery.title', { count: uploadedImages.length })}
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {uploadedImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">{t('imageManager.gallery.empty.title')}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('imageManager.gallery.empty.message')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(image.url)}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                            title={t('imageManager.actions.copyUrl')}
                          >
                            {copiedUrl === image.url ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image)}
                            className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600"
                            title={t('imageManager.actions.delete')}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)} • {image.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageManager; 