import React from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertTriangle = getIcon('AlertTriangle');
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle size={64} className="text-orange-500 mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-xl text-surface-600 dark:text-surface-400 max-w-lg mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;