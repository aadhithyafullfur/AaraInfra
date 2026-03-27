import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Zap, Tag, Layers, Ruler, BadgePercent } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || API_BASE_URL;

export default function ClientProductDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state?.product) return;

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(res.data);
      } catch {
        setError('Unable to load this product right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, state?.product]);

  const imageSrc = useMemo(() => {
    if (!product?.image) return 'https://via.placeholder.com/800x500?text=Window';
    return product.image.startsWith('http')
      ? product.image
      : `${ASSETS_BASE_URL}/${product.image.replace(/\\/g, '/')}`;
  }, [product]);

  const features = useMemo(() => {
    if (!product) return [];
    return [
      `Window type: ${product.category || 'General'}`,
      `Material: ${product.material || 'Standard'}`,
      `GST rate: ${product.gstRate ?? 18}%`,
      product.size ? `Standard size: ${product.size}` : 'Custom sizing available',
      product.hsnCode ? `HSN code: ${product.hsnCode}` : 'HSN available on request'
    ];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, price: product.pricePerSqFt || product.price || 0 });
  };

  const handleOrderNow = () => {
    handleAddToCart();
    navigate('/client/orders');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 flex items-center justify-center min-h-[420px]">
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 rounded-2xl p-8 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium">{error || 'Product not found.'}</p>
        <button
          onClick={() => navigate('/client/products')}
          className="mt-4 px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          Back To Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/client/products')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <ArrowLeft className="w-4 h-4" /> Back To Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-soft">
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 min-h-[320px]">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x500?text=No+Image';
            }}
          />
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold">Window Product</p>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              {product.description || 'Durable, premium-quality window system engineered for long-term performance and clean aesthetics.'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Price</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{Number(product.pricePerSqFt || product.price || 0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per sq. ft.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Features</h2>
            <ul className="mt-3 space-y-2">
              {features.map((item) => (
                <li key={item} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-primary-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"><Tag className="w-4 h-4" /> {product.category || 'General'}</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"><Layers className="w-4 h-4" /> {product.material || 'Standard'}</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"><Ruler className="w-4 h-4" /> {product.size || 'Custom'}</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"><BadgePercent className="w-4 h-4" /> GST {product.gstRate ?? 18}%</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ShoppingCart className="w-4 h-4" /> Add To Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30"
            >
              <Zap className="w-4 h-4" /> Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
