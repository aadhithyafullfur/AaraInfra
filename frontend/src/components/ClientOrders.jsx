import React, { useState, useEffect } from 'react';
import { Package, Download, Search, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { getClientOrders } from '../utility/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function ClientOrders() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("orderStatusUpdate", (data) => {
      setOrders(prev => prev.map(o => 
         o._id === data.orderId ? { ...o, status: data.status } : o
      ));
    });

    return () => {
      socket.off("orderStatusUpdate");
    }
  }, [socket]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getClientOrders();
      setOrders(data);
    } catch(err) {
      toast.error(err?.message || String(err) || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) => order._id?.toLowerCase().includes(search.toLowerCase()) || order.status?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'Accepted':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Orders</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Track your infrastructure product orders, view statuses, and download generated invoices.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Status..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-gray-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-sm">
          <Filter className="w-4 h-4" /> Filter By Date
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order._id ? order._id.substring(order._id.length - 8).toUpperCase() : 'N/A'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.items ? order.items.length : 0} Items included</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white">
                    ₹{order.totalAmount ? order.totalAmount.toLocaleString() : 0}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                         onClick={() => order._id && navigate(`/client/orders/${order._id}`)}
                         disabled={!order._id}
                         title="View Order"
                         className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-gray-50 hover:bg-primary-50 dark:bg-gray-900 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       {order.invoiceId && (
                         <button title="Download Invoice" className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800">
                           <Download className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                     {loading ? 'Loading orders...' : 'No orders found matching your search.'}
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
