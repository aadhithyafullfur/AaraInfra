import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { placeOrder } from '../utility/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsCheckingOut(true);

      const items = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        items,
        totalAmount: cartTotal
      };

      const res = await placeOrder(orderData);
      const orderId = res.order?._id || res.order?.id || res?.orderId;
      
      toast.success('Order placed successfully!', { duration: 4000 });
      clearCart();
      setIsCartOpen(false);
      
      if (orderId) {
        navigate(`/client/orders/${orderId}`);
      } else {
        navigate('/client/orders');
      }

    } catch (error) {
       toast.error(error?.message || String(error) || "Failed to place order");
    } finally {
       setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">Looks like you haven't added any products to your cart yet.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 flex-shrink-0">
                      <img
                        src={`${ASSETS_BASE_URL}/${item.image?.replace(/\\/g, '/')}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">₹{item.price?.toLocaleString("en-IN")}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-1 px-2 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="text-gray-500 hover:text-primary-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                     <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                  ) : (
                     <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
