import { useEffect, useState } from "react";
import { User, Mail, MapPin, Building, FileText, CheckCircle, Package, Receipt, LogOut, Settings } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account'); // 'account', 'settings'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/client/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
            setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching client profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (!profile) return <div className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/50 mt-8 max-w-lg mx-auto">Unable to load profile. Please contact administrator.</div>;

  return (
    <div className="font-sans pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Profile & Preferences</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl text-sm">Manage your company information, account preferences, and view your platform identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            <div className="h-32 bg-gradient-to-br from-indigo-600 via-primary-600 to-emerald-500 relative">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
            </div>
            <div className="px-6 pb-6 relative pt-12 text-center sm:text-left">
              <div className="absolute -top-12 left-6 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-gray-900">
                 <Building className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                {profile.client?.name || "Company Name Not Set"}
              </h3>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full mt-3 uppercase tracking-wider">
                 <CheckCircle className="w-3.5 h-3.5" />
                 Verified Client
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 leading-medium pb-2 border-b border-gray-100 dark:border-gray-800">
                 Member since {new Date(profile.user?.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
              
              <div className="pt-4 space-y-3">
                 <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                   <Mail className="w-4 h-4 text-gray-400" />
                   <span className="truncate">{profile.user?.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                   <FileText className="w-4 h-4 text-gray-400" />
                   <span className="font-mono">{profile.client?.gstin || "GSTIN Pending"}</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Activity Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Activity Highlights</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                 <div className="flex items-center gap-3">
                   <Package className="w-5 h-5 text-blue-500" />
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                 <div className="flex items-center gap-3">
                   <Receipt className="w-5 h-5 text-emerald-500" />
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoices Paid</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800">
             <button 
               onClick={() => setActiveTab('account')}
               className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'account' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
             >
               Account Details
               {activeTab === 'account' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
             </button>
             <button 
               onClick={() => setActiveTab('settings')}
               className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'settings' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
             >
               Preferences
               {activeTab === 'settings' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
             </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 p-8">
            {activeTab === 'account' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Person</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        {profile.user?.name}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {profile.user?.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Business Location</h4>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered Address</label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium text-gray-900 dark:text-white flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{profile.client?.address || "Address not provided"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {profile.client?.state} {profile.client?.stateCode ? `(${profile.client?.stateCode})` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Security</h4>
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white">Password</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Change your account password securely.</p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      Update Password
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    {['Order updates and tracking emails', 'Invoice generation alerts', 'Promotions and new products'].map((pref, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer border border-transparent dark:border-transparent transition-colors">
                        <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl font-semibold text-sm transition-colors border border-red-100 dark:border-red-900/30">
                     <LogOut className="w-4 h-4" /> Sign Out from all devices
                   </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
