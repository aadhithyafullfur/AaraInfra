import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ShoppingCart, LogOut, Menu, Moon, Sun, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

export default function ClientNavbar({ onMenuClick }) {
  const { cartCount, toggleCart } = useCart();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/client');
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    try {
      if (localStorage?.theme === 'dark' || (!('theme' in localStorage) && window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches)) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    } catch (error) {
      console.error("Local storage error in ClientNavbar:", error);
    }
  }, []);

  const toggleTheme = () => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        setIsDarkMode(false);
      } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error("Local storage error in ClientNavbar:", error);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handleNotif = (data) => {
       setNotifications(prev => [data, ...prev].slice(0, 10)); // Keep last 10
       setUnreadCount(prev => prev + 1);
       toast.success(data.message, { 
           icon: data.type === 'order_status' ? '🔔' : '📦',
           duration: 4000
       });
    };
    socket.on("clientNotification", handleNotif);

    return () => {
      socket.off("clientNotification", handleNotif);
    };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen]);

  // eslint-disable-next-line no-unused-vars
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/60 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex items-center max-w-md w-full relative group">
            <Search className="w-5 h-5 absolute left-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products, orders, or invoices..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) setUnreadCount(0);
              }}
              className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                   transition={{ duration: 0.15 }}
                   className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    <CheckCircle className="w-4 h-4 text-emerald-500 cursor-pointer" title="Mark all as read" onClick={() => setUnreadCount(0)}/>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                         No recent notifications.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-3 mb-1 bg-gray-50/50 hover:bg-gray-100 dark:bg-gray-800/20 dark:hover:bg-gray-800/50 rounded-xl transition-colors cursor-default">
                           <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">{notif.title}</p>
                           <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{notif.message}</p>
                           <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleCart}
            className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                {cartCount}
              </span>
            )}
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block"></div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* Mobile Logout (Icon only) */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="sm:hidden p-2.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
