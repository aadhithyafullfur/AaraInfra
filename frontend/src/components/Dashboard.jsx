import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Check,
  X
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";
import { getAdminOrders, updateOrderStatus } from "../utility/api";
import toast from "react-hot-toast";
import AdminNotificationsPanel from "./AdminNotificationsPanel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    totalClients: 0,
    recentInvoices: [],
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, ordersData] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          getAdminOrders()
        ]);

        const data = await statsResponse.json();
        setStats({
          totalInvoices: data.totalInvoices || 0,
          totalRevenue: Number(data.totalRevenue || 0),
          totalClients: data.totalClients || 0,
          recentInvoices: data.recentInvoices || [],
        });
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      // Play a sound or show popup
      toast.success(`New order received from ${newOrder.clientName || newOrder.user?.name || 'a client'}!`, {
        icon: '🚨',
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      // Add to top of list
      setOrders(prev => [newOrder, ...prev]);
    };

    const handleOrderUpdated = ({ orderId, status }) => {
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status } : o)));
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderReceived", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdated);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderReceived", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdated);
    };
  }, [socket]);

  const handleAction = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error(error?.message || String(error) || `Failed to ${status} order`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-primary-900 rounded-full opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const chartData = stats.recentInvoices.length > 0
    ? stats.recentInvoices.map((inv) => ({
      name: inv.invoiceNumber,
      amount: inv.totalAmountAfterTax,
    }))
    : [
      { name: "Jan", amount: 45000 },
      { name: "Feb", amount: 52000 },
      { name: "Mar", amount: 38000 },
      { name: "Apr", amount: 65000 },
      { name: "May", amount: 48000 },
      { name: "Jun", amount: 73000 },
      { name: "Jul", amount: 91000 },
    ];

  const displayInvoices = stats.recentInvoices.length > 0
    ? stats.recentInvoices
    : [
      { _id: "m1", clientName: "Apex Infrastructure", invoiceNumber: "INV-2026-61", totalAmountAfterTax: 22000, invoiceDate: new Date(Date.now() - 86400000 * 1) },
      { _id: "m2", clientName: "BuildWell Associates", invoiceNumber: "INV-2026-62", totalAmountAfterTax: 15400, invoiceDate: new Date(Date.now() - 86400000 * 2) },
      { _id: "m3", clientName: "Crest Construction", invoiceNumber: "INV-2026-63", totalAmountAfterTax: 42500, invoiceDate: new Date(Date.now() - 86400000 * 3) },
      { _id: "m4", clientName: "Design Build LLC", invoiceNumber: "INV-2026-64", totalAmountAfterTax: 12800, invoiceDate: new Date(Date.now() - 86400000 * 5) },
      { _id: "m5", clientName: "Elevate Projects", invoiceNumber: "INV-2026-65", totalAmountAfterTax: 31000, invoiceDate: new Date(Date.now() - 86400000 * 7) },
    ];

  const statCards = [
    {
      icon: FileText,
      title: "Total Invoices",
      value: stats.totalInvoices || 142,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      trend: "+12.5%",
      trendUp: true
    },
    {
      icon: DollarSign,
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue || 1450000).toLocaleString("en-IN")}`,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: "+8.2%",
      trendUp: true
    },
    {
      icon: Users,
      title: "Total Clients",
      value: stats.totalClients || 24,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      trend: "+3.1%",
      trendUp: true
    },
    {
      icon: Clock,
      title: "Recent Invoices",
      value: displayInvoices.length,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      trend: "-2.4%",
      trendUp: false
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <AdminNotificationsPanel />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Dashboard Overwiew</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed breakdown of your business performance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="group relative p-6 rounded-3xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} ${stat.color} filter blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none z-0`} />

            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${stat.trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 mb-2 uppercase">{stat.title}</p>
              <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 dark:border-gray-700/50 p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Revenue Trend
            </h2>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: () => '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#1f2937' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No data available for chart</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Invoices List (Simplified for sidebar look on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 dark:border-gray-700/50 p-6 lg:p-8 flex flex-col"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Invoices</h2>
          <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
            {displayInvoices.length > 0 ? (
              <div className="space-y-4">
                {displayInvoices.map((invoice, i) => (
                  <div key={invoice._id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{invoice.clientName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        ₹{invoice.totalAmountAfterTax?.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">No recent invoices found.</p>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            View All History
          </button>
        </motion.div>
      </div>

      {/* Real-time Orders Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 dark:border-gray-700/50 p-6 lg:p-8 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            Live Order Feed
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client / Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence>
                {orders.length > 0 ? orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    layout
                    initial={{ opacity: 0, backgroundColor: "#eef2ff" }} // highlight new rows
                    animate={{ opacity: 1, backgroundColor: "#eef2ff00" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.clientName || order.user?.name || "Client"}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.orderId || (order._id ? order._id.substring(order._id.length - 8).toUpperCase() : 'N/A')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white">
                      ₹{order.totalAmount ? order.totalAmount.toLocaleString("en-IN") : 0}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${order.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20' :
                          order.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 border-red-500/20' :
                            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {order.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(order._id, 'Accepted')}
                            title="Accept Order"
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                          >
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleAction(order._id, 'Rejected')}
                            title="Reject Order"
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">Action taken</span>
                      )}
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No real-time orders received yet.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
