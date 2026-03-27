import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';
import InvoicePreview from './components/InvoicePreview';
import Products from './components/Products';
import Clients from './components/Clients';
import InvoiceHistory from './components/InvoiceHistory';
import InvoiceById from './components/InvoiceById';
import AdminOrders from './components/AdminOrders';
import SupportPage from './components/SupportPage';
import AdminSupportPage from './components/AdminSupportPage';
// Client Components
import ClientLogin from './components/ClientLogin';
import ClientDashboard from './components/ClientDashboard';
import ClientInvoices from './components/ClientInvoices';
import ClientProfile from './components/ClientProfile';
import ClientOverview from './components/ClientOverview';
import ClientProducts from './components/ClientProducts';
import ClientProductDetails from './components/ClientProductDetails';
import ClientOrders from './components/ClientOrders';
import OrderDetails from './components/OrderDetails';

function App() {
  const getIndexRedirect = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return <Navigate to="/admin" />;
    
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'client') return <Navigate to="/client/dashboard" />;
      return <Navigate to="/dashboard" />;
    } catch {
      return <Navigate to="/admin" />;
    }
  };

  return (
    <CartProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Index Redirection */}
          <Route path="/" element={getIndexRedirect()} />

          {/* Public Routes */}
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/client" element={<ClientLogin />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* --- Admin Protected Routes --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-invoice"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <CreateInvoice />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <InvoicePreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice-history"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <InvoiceHistory />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice-preview/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <InvoiceById />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <Products />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <Clients />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <AdminOrders />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <AdminSupportPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Client Protected Routes --- */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientOverview />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/products"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientProducts />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/products/:id"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientProductDetails />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientInvoices />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/orders"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientOrders />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <OrderDetails />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/profile"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <ClientProfile />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/support"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard>
                  <SupportPage />
                </ClientDashboard>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route to catch unrecognized paths and suppress Router warnings */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
