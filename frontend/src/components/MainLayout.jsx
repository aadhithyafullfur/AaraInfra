import React from 'react';
import Navbar from './Navbar';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-primary-500/30 transition-colors duration-300 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/10 dark:bg-primary-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-400/10 dark:bg-secondary-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-accent-400/5 dark:bg-accent-600/5 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full"
                    >
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </motion.div>
                </main>

                {/* Optional Footer spacing */}
                <div className="h-8"></div>
            </div>
        </div>
    );
};

export default MainLayout;
