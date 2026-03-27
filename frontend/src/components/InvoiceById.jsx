import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InvoicePreview from './InvoicePreview';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function InvoiceById() {
  const { id } = useParams(); // fetch id from URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (userStr) {
           const userData = JSON.parse(userStr);
           setUserRole(userData.role);
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoice(response.data);
      } catch (error) {
        console.error('Failed to fetch invoice by ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
      Invoice not found.
    </div>
  );

  return <InvoicePreview invoiceData={invoice} backTo={userRole === 'client' ? '/client/dashboard' : '/invoice-history'} />;
}
