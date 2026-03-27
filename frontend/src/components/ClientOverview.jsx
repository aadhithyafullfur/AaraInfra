import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Building2, HardHat, PackageSearch, Briefcase, Receipt,
  ArrowRight, CheckCircle2, ShoppingBag, Users, FileText,
  ChevronRight, Star, Mail, Phone, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientOverview() {
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

  const services = [
    { title: "Infrastructure Development", icon: Building2, desc: "End-to-end infrastructure solutions tailored for modern businesses." },
    { title: "Consultancy Services", icon: Briefcase, desc: "Expert guidance on project execution, resource management, and compliance." },
    { title: "Product Supply", icon: PackageSearch, desc: "Premium materials including uPVC and Aluminum fixtures." },
    { title: "Project Management", icon: HardHat, desc: "Streamlined processes ensuring timely and cost-effective delivery." },
    { title: "Billing & Invoice Management", icon: Receipt, desc: "Automated GST invoicing and transparent billing workflows." }
  ];

  const features = [
    "Product/Service browsing",
    "Easy ordering",
    "Invoice generation",
    "Order tracking",
    "Secure payment workflow"
  ];

  const stats = [
    { label: "Total Products", value: "250+", icon: ShoppingBag },
    { label: "Active Clients", value: "120+", icon: Users },
    { label: "Completed Projects", value: "340+", icon: CheckCircle2 },
    { label: "Generated Invoices", value: "1.2k+", icon: FileText }
  ];

  const testimonials = [
    { name: "Rahul Sharma", company: "BuildCorp Pvt Ltd", text: "AARA INFRA transformed our procurement process. The dashboard makes managing orders and invoices effortless." },
    { name: "Priya Patel", company: "DesignSpace Architecture", text: "The quality of products and the streamlined billing workflow have saved us countless hours. Highly recommended." }
  ];

  return (
    <div className="space-y-16 pb-12 font-sans">
      {/* 1. Hero Section */}
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10 lg:p-16 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Welcome to AARA INFRA
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Smart Infrastructure Management & Billing Platform
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Your centralized command center for browsing premium products, managing infrastructure services, and handling seamless GST invoicing with complete transparency.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/client/products" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-sm gap-2">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/client/orders" className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white border border-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all text-sm gap-2">
              Track Orders
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 2. About Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">About AARA INFRA</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Empowering your infrastructure needs from concept to completion.
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            At AARA INFRA, we integrate high-end product supply with comprehensive project management and consultancy. Our platform is designed to give you complete operational visibility.
          </p>
          <ul className="space-y-3">
            {["Infrastructure services", "Client management", "Product/service billing", "GST invoicing", "Project tracking"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-square md:aspect-video lg:aspect-square bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center p-8">
            <Building2 className="w-1/2 h-1/2 text-gray-300 dark:text-gray-700 opacity-50" />
            {/* Note: An abstract decorative image or brand graphic goes here */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-900/80 to-transparent">
              <p className="text-white font-medium text-lg">Robust infrastructure, transparent workflows.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. Services Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">Our Capabilities</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Premium Services</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <svc.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{svc.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-gray-700/50 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 text-primary-500">
                <ChevronRight className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white text-sm">{feat}</span>
            </div>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">Platform Features</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Designed for Seamless Operations</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Experience an intuitive digital workspace. From browsing verified products to generating compliant GST invoices, our dashboard puts control directly in your hands. Track everything in real-time securely.
          </p>
        </div>
      </motion.section>

      {/* 5. Statistics Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform cursor-default"
          >
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* 6. Testimonials Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trusted by Industry Leaders</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
                  "{testimonial.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 7. Footer Section */}
      <footer className="bg-gray-900 text-gray-300 rounded-3xl p-10 lg:p-12 mt-16 shadow-xl border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">AARA INFRA</h4>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-6 text-sm">
              Delivering excellence in infrastructure management, product supply, and transparent billing solutions for modern enterprises.
            </p>
            <div className="flex items-center gap-4">
              {/* Decorative Social Links */}
              {['#fb', '#tw', '#in'].map((link, i) => (
                <a key={i} href={link} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors text-gray-400">
                  <span className="sr-only">Social Link {i}</span>
                  <div className="w-4 h-4 rounded-sm border-2 border-current"></div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Company</h5>
            <ul className="space-y-4 text-sm">
              <li><Link to="/client/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/client/orders" className="hover:text-white transition-colors">Orders</Link></li>
              <li><Link to="/client/invoices" className="hover:text-white transition-colors">Invoices</Link></li>
              <li><Link to="/client/profile" className="hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>123 Infrastructure Way, Business District, HQ 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href="mailto:support@aarainfra.com" className="hover:text-white transition-colors">support@aarainfra.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AARA INFRA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
