import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  onLoad,
  onError
}) => {
  // Extract base name and extension from src
  const getImagePath = (baseName: string, format: string, size: string) => {
    return `/optimized/${baseName}-${size}.${format}`;
  };

  // Get base name from src (remove path and extension)
  const getBaseName = (src: string) => {
    const fileName = src.split('/').pop()?.split('.')[0] || '';
    if (fileName === 'logo-symbol-text') return 'logo';
    if (fileName === 'hero banner') return 'hero-banner';
    return fileName;
  };

  const baseName = getBaseName(src);

  return (
    <picture>
      {/* AVIF format - best compression, modern browsers */}
      <source
        type="image/avif"
        srcSet={`
          ${getImagePath(baseName, 'avif', 'small')} 768w,
          ${getImagePath(baseName, 'avif', 'medium')} 1200w,
          ${getImagePath(baseName, 'avif', 'large')} 1920w
        `}
        sizes={sizes}
      />
      
      {/* WebP format - good compression, wide support */}
      <source
        type="image/webp"
        srcSet={`
          ${getImagePath(baseName, 'webp', 'small')} 768w,
          ${getImagePath(baseName, 'webp', 'medium')} 1200w,
          ${getImagePath(baseName, 'webp', 'large')} 1920w
        `}
        sizes={sizes}
      />
      
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        decoding="async"
      />
    </picture>
  );
};

export default ResponsiveImage;

