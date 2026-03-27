import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export default function ProductGrid({ products, loading, error, onAddToCart, onViewDetails }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load products</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 border-dashed text-center h-96">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
          <PackageOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No products available yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">We are currently updating our catalog. Check back soon for new premium products.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product?._id || Math.random().toString()} 
          product={{...product, price: product?.pricePerSqFt || product?.price}} 
          onAddToCart={onAddToCart} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
}
