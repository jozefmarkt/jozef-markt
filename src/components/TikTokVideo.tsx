import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokVideo = () => {
  const { t } = useTranslation('common');
  const [videoId, setVideoId] = useState('7532444305118498080');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device for UI text
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileViewport = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileViewport);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load current video ID from admin settings
    const savedSettings = localStorage.getItem('tiktok-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setVideoId(settings.videoId);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);



  const getVideoUrl = (id: string) => {
    return `https://www.tiktok.com/@jozef.market/video/${id}`;
  };

  const handlePlayVideo = () => {
    // Open TikTok video in new tab
    window.open(getVideoUrl(videoId), '_blank');
  };

  return (
    <div className="flex justify-center">
      <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] w-80 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        {/* TikTok Video Preview */}
        <div className="absolute inset-0 bg-black">
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center cursor-pointer group"
            onClick={handlePlayVideo}
          >
            {/* Preview Image/Placeholder */}
            <div className="text-center text-white p-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">@jozef.market</h3>
              <p className="text-sm opacity-80">{isMobile ? 'Tap to watch on TikTok' : 'Click to watch on TikTok'}</p>
            </div>
          </div>
        </div>
        
        {/* Overlay with TikTok branding */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 bg-black bg-opacity-80 rounded-full">
              <svg className="w-4 h-4 text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="text-white text-xs font-bold">TikTok</span>
            </div>
            <span className="text-white text-sm font-medium">@jozef.market</span>
          </div>
          <div className="text-white text-xs opacity-75">
            Click to Watch
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-8 left-4 w-1 h-1 bg-white rounded-full opacity-40"></div>
        <div className="absolute bottom-20 left-4 w-3 h-3 bg-white rounded-full opacity-30"></div>
        
        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm leading-tight">
            {t('about.tiktok.description')}
          </p>
        </div>
        

        
        {/* TikTok branding overlay - non-clickable */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="text-white text-xs opacity-75 text-center">
            TikTok Video • @jozef.market
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;

