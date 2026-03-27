import React, { useState } from "react";
import { Package, Search, Plus, Tag } from "lucide-react";

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function ProductQuickSelect({ products = [], onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search items..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredProducts.map((product) => (
          <button
            key={product._id}
            onClick={() => onSelect(product)}
            className="w-full group flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800/50 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-primary-500 group-hover:bg-white dark:group-hover:bg-gray-800 border border-gray-200 dark:border-gray-600 group-hover:border-primary-100 transition-all overflow-hidden">
              {product.image ? (
                <img src={product.image.startsWith('http') ? product.image : `${ASSETS_BASE_URL}/${product.image}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <Tag className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 truncate w-full text-left">
                {product.name}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-primary-600/70 font-mono flex items-center gap-1">
                {product.material} • ₹{product.pricePerSqFt}/sqft
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
