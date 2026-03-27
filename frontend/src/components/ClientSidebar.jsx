import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, FileText, Settings, X, HeadphonesIcon, LogOut } from 'lucide-react';

export default function ClientSidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/client/orders', icon: ListOrdered },
    { name: 'Products Catalog', path: '/client/products', icon: ShoppingBag },
    { name: 'Invoices', path: '/client/invoices', icon: FileText },
  ];

  const secondaryNavItems = [
    { name: 'Profile & Settings', path: '/client/profile', icon: Settings },
    { name: 'Support', path: '/client/support', icon: HeadphonesIcon },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-transform duration-300 ease-in-out transform flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} hidden lg:flex flex-col h-screen`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 dark:border-gray-800/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Aara<span className="text-primary-600 dark:text-primary-400 font-medium">Client</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
          <div>
            <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Menu</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/client/dashboard'}
                  onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 w-5 h-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Preferences</p>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActive && item.path !== '#'
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 w-5 h-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* User Card at bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0">
               C
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Client User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Premium Member</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>
    </>
  );
}
