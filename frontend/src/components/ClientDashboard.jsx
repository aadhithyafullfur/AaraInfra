import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import ClientSidebar from './ClientSidebar';
import ClientNavbar from './ClientNavbar';
import CartDrawer from './CartDrawer';
import ClientChatbot from './ClientChatbot';
import ErrorBoundary from './ErrorBoundary';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function ClientDashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex bg-gray-50/50 dark:bg-gray-950 font-sans min-h-screen relative overflow-hidden transition-colors duration-300">
      <ClientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <ClientNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 custom-scrollbar relative bg-gray-50/50 dark:bg-gray-950/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full max-w-7xl mx-auto pb-12"
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CartDrawer />
      <ClientChatbot />
    </div>
  );
}
