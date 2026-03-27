import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminSupportMessages, replySupportMessage } from '../utility/api';
import {
  MessageSquare, User, Clock, AlertCircle, CheckCircle2,
  XCircle, Reply, ChevronDown, Check, Send
} from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const AdminSupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal / Reply state
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('In Progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();

    // Socket.io real-time connection
    const token = localStorage.getItem('token');
    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('newSupportMessage', (newMsg) => {
      setMessages(prev => [newMsg, ...prev]);
    });

    socket.on('supportMessageReply', (updatedMsg) => {
      setMessages(prev => prev.map(msg => msg._id === updatedMsg._id ? updatedMsg : msg));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getAdminSupportMessages();
      setMessages(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyTarget) return;

    try {
      setIsSubmitting(true);
      const updatedMsg = await replySupportMessage(replyTarget._id, {
        message: replyText,
        status: replyStatus
      });
      // The Socket.io event will also catch this and update the list,
      // but we update it here for immediate feedback if desired.
      setMessages(prev => prev.map(m => m._id === updatedMsg.data._id ? updatedMsg.data : m));
      setReplyTarget(null);
      setReplyText('');
    } catch (err) {
      alert(err || 'Failed to submit reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-semibold border border-yellow-200 dark:border-yellow-800/50"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800/50"><AlertCircle className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300 text-xs font-semibold border border-gray-200 dark:border-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 p-6 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Client Support Messages
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and respond to client inquiries in real-time.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-800/50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-glow"></div>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Live Sync Active</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary-200 dark:border-slate-700 border-t-primary-600 dark:border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 flex items-center gap-3">
            <XCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">There are no support messages at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 border border-primary-100 dark:border-primary-800/50">
                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {msg.client_name || msg.name || 'Anonymous Client'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 dark:text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(msg.createdAt).toLocaleString()}</span>
                        {msg.subject && (
                          <>
                            <span className="hidden sm:inline">&bull;</span>
                            <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-xs font-medium border border-gray-200 dark:border-slate-700">
                              Topic: {msg.subject}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(msg.status)}</div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-700/50 text-gray-700 dark:text-slate-200 text-base leading-relaxed mb-6">
                  {msg.message}
                </div>

                {/* Replies Thread */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="ml-8 border-l-2 border-primary-100 dark:border-primary-900/40 pl-6 space-y-4 mb-6">
                    {msg.replies.map((reply, idx) => (
                      <div key={idx} className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800/30 relative">
                        <div className="absolute -left-[2.1rem] top-4 w-8 h-0.5 bg-primary-100 dark:bg-primary-900/40"></div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-primary-900 dark:text-primary-300 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                            {reply.admin_name || 'Admin Support'}
                          </span>
                          <span className="text-xs text-primary-600/70 dark:text-primary-400/70">{new Date(reply.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-primary-800 dark:text-primary-100/90 text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
                  <button
                    onClick={() => setReplyTarget(msg)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 dark:text-slate-200 transition-colors shadow-sm cursor-pointer group"
                  >
                    <Reply className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:text-slate-400 dark:group-hover:text-primary-400" />
                    Reply to Client
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reply Modal Overlay */}
        <AnimatePresence>
          {replyTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative border border-gray-100 dark:border-slate-700"
              >
                <button
                  onClick={() => setReplyTarget(null)}
                  className="absolute top-5 right-5 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 pr-8">
                  Reply to {replyTarget.client_name || replyTarget.name || 'Client'}
                </h2>
                
                <div className="text-sm text-gray-600 dark:text-slate-400 mb-6 border-l-4 border-primary-200 dark:border-primary-700/50 pl-4 py-3 bg-gray-50/50 dark:bg-slate-800/50 rounded-r-xl italic">
                  "{replyTarget.message.length > 100 ? replyTarget.message.substring(0, 100) + '...' : replyTarget.message}"
                </div>

                <form onSubmit={handleReplySubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Your Response</label>
                    <textarea
                      required
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-shadow shadow-sm"
                      placeholder="Type a polite and helpful response..."
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Ticket Status</label>
                    <div className="relative">
                      <select
                        value={replyStatus}
                        onChange={(e) => setReplyStatus(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow shadow-sm cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReplyTarget(null)}
                      className="px-6 py-3 font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !replyText.trim()}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSupportPage;

