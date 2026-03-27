import React from 'react';
import { ShoppingCart, ExternalLink, Plus } from 'lucide-react';

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const placeholderImage = "https://via.placeholder.com/400?text=Window";
  const brokenImageFallback = "https://via.placeholder.com/400?text=No+Image";

  // If no product is passed, render a skeleton
  if (!product) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse h-full flex flex-col">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
        <div className="mt-auto flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4 flex-shrink-0 cursor-pointer" onClick={() => onViewDetails && onViewDetails(product)}>
        <img
          src={product?.image ? (product.image.startsWith('http') ? product.image : `${ASSETS_BASE_URL}/${product.image.replace(/\\/g, '/')}`) : placeholderImage}
          alt={product?.name || "Product"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = brokenImageFallback;
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            {product?.category || "General"}
          </span>
        </div>
        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 text-base cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title={product?.name} onClick={() => onViewDetails(product)}>
            {product?.name || "Unnamed Product"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-10">
            {product?.description || `High-quality ${product?.material || 'material'} ${product?.category || 'product'}.`}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Price</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product?.pricePerSqFt?.toLocaleString("en-IN") || product?.price?.toLocaleString("en-IN") || '0'}
            </span>
          </div>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="flex items-center justify-center w-max bg-gray-50 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/20 text-gray-700 hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 rounded-lg px-3 py-1.5 transition-all outline-none gap-2 font-medium text-sm group/btn"
          >
            <ShoppingCart className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
