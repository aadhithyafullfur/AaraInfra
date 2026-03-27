import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { submitSupportMessage } from '../utility/api';
import {
  Mail, Phone, MapPin, Clock, MessageSquare, AlertCircle,
  CheckCircle2, Send, ChevronRight, HelpCircle
} from 'lucide-react';

export default function SupportPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState('success');

  const onSubmit = async (data) => {
    setStatusMessage(null);
    try {
      const result = await submitSupportMessage(data);
      setStatusType('success');
      setStatusMessage(result.message || 'Your message has been sent successfully.');
      reset();
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error || 'Failed to send your message. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'support@aarainfraa.com', link: 'mailto:support@aarainfraa.com' },
    { icon: Phone, label: 'Call Us', value: '+91-9942934940', link: 'tel:+919942934940' },
    { icon: MapPin, label: 'Visit Us', value: '# 49/1, S.Medahalli, Sarjapura Road, Attibele, Bangalore-07', link: '#' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Sat, 9:00 AM - 6:00 PM', link: null },
  ];

  const faqs = [
    { question: "How do I track my orders?", answer: "You can track your orders through the 'Track Orders' section in your client dashboard." },
    { question: "How are invoices generated?", answer: "Invoices are automatically generated and linked to your GSTIN upon order completion." },
    { question: "Can I edit an order after placing it?", answer: "Once an order is confirmed, modifications might require reaching out to support directly." }
  ];

  return (
    <div className="space-y-10 pb-12 font-sans max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 to-indigo-900 text-white p-10 lg:p-14 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4 text-accent-300" />
            Support Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Contact Support
          </h1>
          <p className="text-lg lg:text-xl text-primary-100 max-w-xl leading-relaxed">
            We're here to help you with your queries, product issues, or general assistance regarding Aara Infraa services.
          </p>
        </div>
      </motion.div>

      {/* 2. Main Content (Split Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 lg:p-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Fill out the form below and our team will get back to you shortly.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
                  })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              {/* Subject Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject <span className="text-red-500">*</span></label>
                <select
                  {...register("subject", { required: "Please select a subject" })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Issue">Product Issue</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Billing / Invoice">Billing / Invoice</option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message <span className="text-red-500">*</span></label>
              <textarea
                {...register("message", { required: "Message cannot be empty", minLength: { value: 10, message: "Please provide more details" } })}
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white resize-none"
                placeholder="How can we help you?"
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            {/* Status Message */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-3 p-4 rounded-xl ${statusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}
                >
                  {statusType === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <p className="text-sm font-medium">{statusMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Right Side: Contact Details & FAQ */}
        <div className="space-y-8">
          {/* Company Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{info.label}</p>
                    {info.link ? (
                      <a href={info.link} className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Aara Infraa</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Premium infrastructure and billing solutions. Always here to assist your enterprise needs.
              </p>
            </div>
          </motion.div>

          {/* Quick FAQ Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Answers</h3>
            </div>
            <div className="space-y-4 text-sm">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{faq.question}</p>
                  <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
