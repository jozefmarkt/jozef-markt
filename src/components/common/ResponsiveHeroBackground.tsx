import React from 'react';

interface ResponsiveHeroBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const ResponsiveHeroBackground: React.FC<ResponsiveHeroBackgroundProps> = ({
  className = '',
  children
}) => {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-jet/60 z-10" />
      
      {/* Content */}
      {children}
    </section>
  );
};

export default ResponsiveHeroBackground;
