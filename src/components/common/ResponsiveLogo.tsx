import React from 'react';

interface ResponsiveLogoProps {
  alt?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const ResponsiveLogo: React.FC<ResponsiveLogoProps> = ({
  alt = "Jozef Supermarkt Logo",
  className = '',
  size = 'medium',
  loading = 'lazy',
  onLoad,
  onError,
  style
}) => {
  const getLogoPath = (format: string, size: string) => {
    return `/optimized/logo-${size}.${format}`;
  };

  return (
    <picture>
      {/* AVIF format - best compression for all sizes */}
      <source
        type="image/avif"
        srcSet={getLogoPath('avif', size)}
      />
      
      {/* WebP format - good compression */}
      <source
        type="image/webp"
        srcSet={getLogoPath('webp', size)}
      />
      
      {/* Fallback to original PNG */}
      <img
        src="/logo-symbol-text.png"
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        decoding="async"
      />
    </picture>
  );
};

export default ResponsiveLogo;
