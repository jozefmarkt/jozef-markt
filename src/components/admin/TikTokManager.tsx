import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TikTokSettings {
  videoId: string;
  lastUpdated: string;
}

const TikTokManager = () => {
  const { t } = useTranslation('common');
  const [settings, setSettings] = useState<TikTokSettings>({
    videoId: '7532444305118498080',
    lastUpdated: new Date().toISOString()
  });
  const [newVideoId, setNewVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current settings from localStorage (you can replace this with API call)
    const savedSettings = localStorage.getItem('tiktok-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleUpdateVideoId = async () => {
    if (!newVideoId.trim()) {
      setMessage('Please enter a valid video ID');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSettings = {
        videoId: newVideoId.trim(),
        lastUpdated: new Date().toISOString()
      };

      // Save to localStorage (replace with API call)
      localStorage.setItem('tiktok-settings', JSON.stringify(updatedSettings));
      
      setSettings(updatedSettings);
      setNewVideoId('');
      setMessage('TikTok video ID updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating video ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateVideoId = (id: string) => {
    // TikTok video IDs are typically 19 digits
    return /^\d{19}$/.test(id);
  };

  const getVideoUrl = (videoId: string) => {
    return `https://www.tiktok.com/@jozef.market/video/${videoId}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          TikTok Video Management
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Current Settings</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Current Video ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={settings.videoId}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                  <a
                    href={getVideoUrl(settings.videoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-700">
                  {new Date(settings.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Update Video ID</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Video ID
                </label>
                <input
                  type="text"
                  value={newVideoId}
                  onChange={(e) => setNewVideoId(e.target.value)}
                  placeholder="Enter new TikTok video ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lion-500 focus:border-lion-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Video ID should be 19 digits (e.g., 7532444305118498080)
                </p>
              </div>
              
              <button
                onClick={handleUpdateVideoId}
                disabled={isLoading || !newVideoId.trim() || !validateVideoId(newVideoId)}
                className="w-full px-4 py-2 bg-lion-500 text-white rounded-md hover:bg-lion-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Video ID'}
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Preview */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Current video will be displayed on the main page:
            </p>
            <div className="text-sm font-mono bg-white p-2 rounded border">
              {getVideoUrl(settings.videoId)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokManager;




