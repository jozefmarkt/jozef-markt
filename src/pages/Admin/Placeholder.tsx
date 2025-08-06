import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, description, icon: Icon }) => {
  const location = useLocation();
  
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
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              {Icon ? (
                <Icon className="h-16 w-16 text-yellow-500" />
              ) : (
                <Construction className="h-16 w-16 text-yellow-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This feature is currently under development. We're working hard to bring you the best experience.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                <strong>Current URL:</strong> {location.pathname}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Placeholder; 