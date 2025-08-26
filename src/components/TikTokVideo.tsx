import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokVideo = () => {
  const { t } = useTranslation('common');
  const [videoId, setVideoId] = useState('7532444305118498080');
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(true); // Show fallback by default
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect mobile device
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

    // Check if TikTok embed script already exists
    const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    
    if (!existingScript) {
      // Load TikTok embed script with error handling
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => {
        setEmbedLoaded(true);
        // Force TikTok to re-render embeds
        if (window.TikTok) {
          window.TikTok.reloadEmbeds();
        }
      };
      script.onerror = () => setShowFallback(true);
      
      // Add script to head
      document.head.appendChild(script);
    } else {
      setEmbedLoaded(true);
    }

    // Set a timeout to show fallback if embed doesn't load
    const timeout = setTimeout(() => {
      if (!embedLoaded) {
        setShowFallback(true);
      }
    }, 8000); // Increased timeout

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkMobile);
    };
  }, [embedLoaded]);

  // Intersection Observer for autoplay when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Try to control TikTok embed
        const iframe = document.getElementById('tiktok-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          try {
            // Send message to TikTok embed to play/pause
            iframe.contentWindow.postMessage({
              type: entry.isIntersecting ? 'play' : 'pause'
            }, 'https://www.tiktok.com');
          } catch (error) {
            console.log('TikTok embed control not available');
          }
        }
      },
      { threshold: 0.5 } // Trigger when 50% of video is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const getVideoUrl = (id: string) => {
    return `https://www.tiktok.com/@jozef.market/video/${id}`;
  };

  // Show fallback if embed failed to load or user prefers it
  if (showFallback) {
    return (
      <div className="flex justify-center">
        <div 
          ref={videoRef}
          className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] w-80 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          {/* TikTok Video Preview */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
            {/* TikTok branding overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
                  </svg>
                </div>
                <p className="text-white text-lg font-bold">@jozef.market</p>
                <p className="text-white text-sm opacity-90 mt-2">Latest TikTok Video</p>
              </div>
            </div>
          </div>
          
          {/* Overlay with TikTok branding */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
                </svg>
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
          
          {/* TikTok Logo */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.14 4.43 6.34 6.34 0 0 0 5.45-12.96z"/>
            </svg>
          </div>
          
          {/* Clickable link to TikTok */}
          <a
            href={getVideoUrl(videoId)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 flex items-center justify-center group"
            aria-label={`View TikTok video ${videoId}`}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100">
              <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </a>
          
          {/* TikTok branding overlay - non-clickable */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="text-white text-xs opacity-75 text-center">
              Click to watch on TikTok • @jozef.market
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div key={videoId} className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] w-80">
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
            data-embed-from="embed_page"
          >
            <section>
              <a target="_blank" href={getVideoUrl(videoId)}>
                @jozef.market on TikTok
              </a>
            </section>
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
            onClick={() => setShowFallback(!showFallback)}
            className="w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 text-xs"
            title={showFallback ? "Try TikTok embed" : "Show fallback preview"}
          >
            {showFallback ? "🎥" : "⚙️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;
