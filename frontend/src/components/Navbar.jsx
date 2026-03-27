import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    History,
    Package,
    Users,
    Plus,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
    CreditCard,
    HelpCircle
} from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from './ErrorBoundary';

const NavbarContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            console.error("Local storage error in Navbar:", error);
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
            console.error("Local storage error in Navbar:", error);
        }
    };

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window?.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tokenExpiry");
            navigate?.("/");
        } catch (error) {
            console.error("Local storage error in Navbar:", error);
        }
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Create Invoice', path: '/create-invoice', icon: FileText },
        { name: 'History', path: '/invoice-history', icon: History },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Clients', path: '/clients', icon: Users },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Support', path: '/support', icon: HelpCircle },
    ] || [];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
                    ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-white/50 dark:border-gray-800/50 shadow-soft py-3'
                    : 'bg-transparent border-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate?.('/dashboard')}>
                            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-500/30">
                                <CreditCard className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                                Aara<span className="text-primary-600 dark:text-primary-400">Infraa</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            {navLinks?.map((link, index) => {
                                const isActive = location?.pathname === link?.path;
                                const Icon = link?.icon;
                                
                                if (!link?.name || !link?.path) return null;

                                return (
                                    <NavLink
                                        key={link?.name || `nav-link-${index}`}
                                        to={link?.path || '#'}
                                        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                            ${isActive
                                                ? 'text-primary-700 dark:text-primary-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-full shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {Icon && <Icon className="w-4 h-4" />}
                                            {link?.name}
                                        </span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                            </button>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            <button
                                className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-white/20"
                                onClick={() => navigate?.('/create-invoice')}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full rounded-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <Plus className="w-4 h-4 relative z-10" />
                                <span className="font-semibold tracking-wide relative z-10 text-sm">New Invoice</span>
                            </button>

                            <div className="relative group">
                                <button className="flex items-center gap-2 pl-2">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <span className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-tr from-primary-500 to-accent-500">AI</span>
                                        </div>
                                    </div>
                                </button>
                                {/* Dropdown could go here */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-600 dark:text-gray-300"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-[70px] z-40 p-4 md:hidden"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 space-y-2">
                            {navLinks?.map((link, index) => {
                                const Icon = link?.icon;
                                if (!link?.name || !link?.path) return null;
                                return (
                                <NavLink
                                    key={link?.name || `mobile-nav-link-${index}`}
                                    to={link?.path || '#'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                        ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                                    `}
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    <span className="font-medium">{link?.name}</span>
                                </NavLink>
                            )})}
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Navbar = () => (
    <ErrorBoundary>
        <NavbarContent />
    </ErrorBoundary>
);

export default Navbar;
