import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../utility/api';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, CheckCircle2, Copy, Eye, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasValidOrderId = Boolean(id && id !== 'undefined' && id !== 'null');

  useEffect(() => {
    if (!hasValidOrderId) {
      toast.error('Invalid order link.');
      setLoading(false);
      navigate('/client/orders', { replace: true });
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        } else {
          toast.error(res.message || "Failed to load order");
        }
      } catch (error) {
        toast.error(error?.message || String(error) || "Order could not be loaded");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [hasValidOrderId, id, navigate]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !order) return;

    const handleStatusUpdate = (data) => {
      if (data.orderId === order._id) {
        setOrder(prev => ({ ...prev, status: data.status }));
        toast.success(`Your order status is now ${data.status}!`, { icon: '🔔' });
      }
    };

    socket.on("orderStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("orderStatusUpdate", handleStatusUpdate);
    };
  }, [socket, order]);

  const copyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      toast.success("Order ID copied to clipboard", { duration: 2000 });
    }
  };

  const getStatusPhase = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Accepted': return 2;
      case 'Confirmed': return 2;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-primary-900/50 rounded-full opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
         <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
           <Package className="w-10 h-10 text-gray-400" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
         <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">We couldn't locate this order in our system. It may have been deleted or never existed.</p>
         <button onClick={() => navigate('/client/orders')} className="btn-primary flex items-center gap-2">
           <ArrowLeft className="w-4 h-4" /> Go Back to Orders
         </button>
      </div>
    );
  }

  const currentPhase = getStatusPhase(order.status);
  
  return (
    <div className="max-w-4xl mx-auto font-sans pb-10">
      {/* Upper Navigation and Success Message */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-400">
           <div className="p-3 bg-emerald-100 dark:bg-emerald-800/50 rounded-full text-emerald-600 dark:text-emerald-300">
             <CheckCircle2 className="w-8 h-8" />
           </div>
           <div>
             <h2 className="font-bold text-xl">Order Successfully Validated!</h2>
             <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm mt-0.5">Thank you for ordering with Aara Infraa. A confirmation email has been sent.</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/client/orders')} className="px-4 py-2 font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-emerald-200 dark:border-emerald-800 shadow-sm text-sm">
            My Orders
          </button>
          <button onClick={() => navigate('/client/products')} className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5 text-sm">
            Continue Shopping
          </button>
        </div>
      </motion.div>

      {/* Main Order Card */}
      <div className="bg-white dark:bg-gray-800 shadow-soft border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden">
        
        {/* Header Block */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Order Details</p>
             <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-white">#{order._id.substring(order._id.length - 8).toUpperCase()}</h1>
               <button onClick={copyOrderId} className="p-1.5 text-gray-400 hover:text-primary-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md transition-colors" title="Copy exact ID">
                 <Copy className="w-4 h-4" />
               </button>
               {order.status === 'Rejected' && <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">REJECTED</span>}
             </div>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-2">
               Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
             </p>
           </div>
           <div className="text-left md:text-right bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
             <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-1">₹{order.totalAmount.toLocaleString('en-IN')}</p>
           </div>
        </div>

        {/* Timeline Feature */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Tracking Status</h3>
          <div className="relative">
            {/* Background Line */}
            <div className={`absolute top-5 left-[30px] w-[calc(100%-60px)] h-1 bg-gray-100 dark:bg-gray-700 -z-10 rounded-full ${order.status === 'Rejected' ? 'hidden' : 'block'}`}></div>
            
            {/* Progress Line */}
            {order.status !== 'Rejected' && currentPhase > 1 && (
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${(currentPhase - 1) * 33}%` }} 
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-5 left-[30px] h-1 bg-primary-500 -z-10 rounded-full"
              ></motion.div>
            )}

            <div className="grid grid-cols-4 relative z-10">
              {[
                { title: 'Pending', icon: Package, phase: 1 },
                { title: 'Confirmed', icon: Eye, phase: 2 },
                { title: 'Shipped', icon: Truck, phase: 3 },
                { title: 'Delivered', icon: CheckCircle, phase: 4 }
              ].map((step, index) => {
                const isCompleted = currentPhase >= step.phase;
                const isCurrent = currentPhase === step.phase;
                const isRejected = order.status === 'Rejected';
                
                return (
                  <div key={step.phase} className={`flex flex-col items-center text-center ${isRejected ? 'opacity-30' : ''}`}>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-[3px] shadow-sm bg-white dark:bg-gray-800 transition-all duration-500
                      ${isCompleted ? 'border-primary-500 text-primary-500 scale-110' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5 text-primary-500" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-3 text-sm font-semibold transition-colors
                      ${isCurrent ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Items ({order.items?.length || 0})</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Unit Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                     <td className="px-6 py-5">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shrink-0 hidden sm:block">
                           <img 
                            src={item.product?.image ? `${ASSETS_BASE_URL}/${item.product.image.replace(/\\/g, '/')}` : 'https://placehold.co/100x100?text=Object'} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Err' }}
                           />
                         </div>
                         <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                       </div>
                     </td>
                     <td className="px-6 py-5 text-center text-gray-700 dark:text-gray-300 font-medium">x{item.quantity}</td>
                     <td className="px-6 py-5 text-right text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">₹{item.price?.toLocaleString()}</td>
                     <td className="px-6 py-5 text-right text-gray-900 dark:text-white font-bold whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
