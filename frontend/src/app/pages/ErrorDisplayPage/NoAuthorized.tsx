import React from 'react';
import { Link } from 'react-router-dom';

export default function NoAuthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-xl text-gray-600 mb-8">You do not have permission to view this page.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
