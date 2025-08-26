import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokVideo = () => {
  const { t } = useTranslation('common');
  const [videoId, setVideoId] = useState('7532444305118498080');
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Load current video ID from admin settings
    const savedSettings = localStorage.getItem('tiktok-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setVideoId(settings.videoId);
    }

    // Load TikTok embed script with error handling
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onload = () => setEmbedLoaded(true);
    script.onerror = () => setShowFallback(true);
    
    // Add script to head instead of body for better cleanup
    document.head.appendChild(script);

    // Set a timeout to show fallback if embed doesn't load
    const timeout = setTimeout(() => {
      if (!embedLoaded) {
        setShowFallback(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [embedLoaded]);

  const getVideoUrl = (id: string) => {
    return `https://www.tiktok.com/@jozef.market/video/${id}`;
  };

  // Show fallback if embed failed to load or user prefers it
  if (showFallback) {
    return (
      <div className="flex justify-center">
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] w-80 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm font-medium">
                @jozef.market
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Video ID: {videoId}
              </p>
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
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* TikTok Logo */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
            </svg>
          </div>
          
          {/* Clickable overlay */}
          <a
            href={getVideoUrl(videoId)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label={`View TikTok video ${videoId}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] w-80">
        {/* TikTok Video Embed */}
        <div className="w-full h-full bg-white">
          <blockquote 
            className="tiktok-embed" 
            cite={getVideoUrl(videoId)}
            data-unique-id={videoId}
            data-embed-type="video"
            data-embed-format="video"
            data-embed-width="320"
            data-embed-height="568"
          >
            <section></section>
          </blockquote>
        </div>
        
        {/* Loading indicator */}
        {!embedLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Loading TikTok video...</p>
            </div>
          </div>
        )}
        
        {/* Fallback button - always visible */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowFallback(true)}
            className="w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 text-xs"
            title="Show fallback preview"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;
