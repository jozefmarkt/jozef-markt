import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">جاري التحميل...</p>
        <p className="text-gray-500 text-sm mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

