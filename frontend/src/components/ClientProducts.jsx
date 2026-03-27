import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductGrid from './ProductGrid';
import { AnimatePresence, motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function ClientProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not load the products catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (search.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`Added ${product.name} to cart`);
  };

  const handleViewDetails = (product) => {
    navigate(`/client/products/${product._id}`, { state: { product } });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="space-y-6 lg:space-y-8 relative pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Product Marketplace</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">Browse and add premium uPVC and Aluminum fixtures directly to your cart. Request custom quotations right through the dashboard.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[160px]">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-3 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-gray-200 text-gray-700 font-medium"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button className="hidden sm:flex bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl p-3 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-primary-500">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ProductGrid
        products={filteredProducts}
        loading={loading}
        error={error}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-gray-900 text-white min-w-[300px] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-800"
          >
            <span className="font-medium text-sm">{toastMessage}</span>
            <button className="text-primary-400 font-bold text-xs uppercase hover:text-primary-300 ml-4" onClick={() => window.location.href = '/client/orders'}>View Cart</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
