import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { toWords } from "number-to-words";
import { X, ArrowLeft, Download } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function InvoicePreview({ invoiceData, onClose, backTo }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(!invoiceData); // Only load if no data passed
  const invoiceRef = useRef();
  const navigate = useNavigate();

  // Use passed data or fetched data
  const data = invoiceData || invoice;

  useEffect(() => {
    if (invoiceData) return; // Skip fetch if data is provided via props

    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/invoices/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoice(response.data);
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceData]);

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0,
      filename: `invoice-${data?.invoiceNumber || 'preview'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate('/create-invoice');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
      No invoice found.
    </div>
  );

  // Helper to ensure amount in words is available or generated
  const amountInWords = data.amountInWords || (data.totalAmountAfterTax ? (toWords(data.totalAmountAfterTax) + " Rupees Only").replace(/^\w/, c => c.toUpperCase()) : "");

  return (
    <div className={`${invoiceData ? 'fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm' : 'bg-gray-50 dark:bg-gray-900 min-h-screen'} flex flex-col`}>
      <nav className={`${invoiceData ? 'sticky top-0 rounded-t-2xl mt-4 mx-4 md:mx-auto max-w-[850px] w-full' : 'sticky top-0'} z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between transition-all shadow-sm`}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
        >
          {onClose ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span>{onClose ? 'Close' : 'Back'}</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">Invoice Preview</h1>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-primary-500/30 transition-all font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </nav>

      <div className={`${invoiceData ? 'mx-4 md:mx-auto max-w-[850px] w-full pb-8' : 'flex justify-center py-10'}`}>
        <div ref={invoiceRef} className="bg-white text-black text-sm shadow-xl p-8 border border-gray-200 mx-auto" style={{ width: "794px", minHeight: "1123px" }}>
          {/* Header with GST and contact info */}
          <div className="flex justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">GSTIN : <span className="font-mono text-black">{data.companyGSTIN || '29HOWPS4461A1ZA'}</span></p>
              <p className="font-semibold text-gray-700">State Code : <span className="font-mono text-black">{data.companyStateCode || '29'}</span></p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p className="font-semibold text-gray-700">Contact</p>
              <p>+91 99429 34940</p>
              <p>+91 96204 01974</p>
            </div>
          </div>

          {/* Company Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">TAX INVOICE</h1>
            <h2 className="text-xl font-bold text-primary-700">AARA INFRAA</h2>
            <p className="text-sm text-gray-600 mt-1"># 49/1, S.Medahalli, Sarjapura Road, Attibele, Bangalore-07</p>
            <p className="text-sm text-gray-600">Email : aarainfraa@gmail.com</p>
          </div>

          {/* Client Info Grid */}
          <div className="flex gap-4 mb-6">
            <div className="w-1/2 border border-black rounded-lg p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Billed To</p>
              <p className="font-bold text-lg">{data.clientName}</p>
              <p className="whitespace-pre-wrap">{data.clientAddress}</p>
              <p className="mt-2 text-sm"><span className="font-semibold">GSTIN:</span> {data.clientGSTIN}</p>
            </div>
            <div className="w-1/2 border border-black rounded-lg p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Details</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="font-semibold">Invoice No:</div>
                <div className="font-mono font-bold">{data.invoiceNumber}</div>

                <div className="font-semibold">Date:</div>
                <div>{data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</div>

                <div className="font-semibold">SP No:</div>
                <div>{data.supplierRef || '-'}</div>

                <div className="font-semibold">Order No:</div>
                <div>{data.buyerOrderNo || '-'}</div>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="mt-4">
            <div className="grid grid-cols-[50px_1fr_100px_80px_100px_120px] bg-gray-100 border border-black border-b-0 font-bold text-xs uppercase tracking-wider text-center">
              <div className="border-r border-black p-2 py-3">Sl No</div>
              <div className="border-r border-black p-2 py-3 text-left">Description</div>
              <div className="border-r border-black p-2 py-3">HSN</div>
              <div className="border-r border-black p-2 py-3">Qty</div>
              <div className="border-r border-black p-2 py-3">Rate</div>
              <div className="p-2 py-3">Amount</div>
            </div>

            {/* Table Rows */}
            <div className="border border-black border-t-0">
              {data.items.map((item, index) => (
                <div key={index} className="grid grid-cols-[50px_1fr_100px_80px_100px_120px] border-b border-black last:border-b-0 text-sm">
                  <div className="border-r border-black p-2 text-center">{index + 1}</div>
                  <div className="border-r border-black p-2 text-left">
                    <p className="font-bold">{item.description || item.name}</p> {/* Handle both prop formats */}
                  </div>
                  <div className="border-r border-black p-2 text-center">{item.hsnCode}</div>
                  <div className="border-r border-black p-2 text-center">{item.quantity}</div>
                  <div className="border-r border-black p-2 text-right">{(Number(item.rate) || 0).toFixed(2)}</div>
                  <div className="p-2 text-right font-semibold">{((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</div>
                </div>
              ))}

              {/* Empty rows filler if needed (optional) */}
              {data.items.length < 5 && Array(5 - data.items.length).fill(0).map((_, i) => (
                <div key={`empty-${i}`} className="grid grid-cols-[50px_1fr_100px_80px_100px_120px] border-b border-black last:border-b-0 h-10 text-sm">
                  <div className="border-r border-black"></div>
                  <div className="border-r border-black"></div>
                  <div className="border-r border-black"></div>
                  <div className="border-r border-black"></div>
                  <div className="border-r border-black"></div>
                  <div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Total */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border border-black rounded-lg p-3 text-sm">
              <p className="font-bold text-gray-500 uppercase text-xs mb-2">Delivery Address</p>
              <p className="font-medium">{data.deliveryAddress || data.clientAddress}</p>
              <p>{data.destination}</p>
            </div>
            <div className="border border-black rounded-lg p-0 overflow-hidden text-sm">
              <div className="grid grid-cols-2 gap-x-4 p-3 bg-gray-50 border-b border-black">
                <p className="text-gray-600">Total Before Tax:</p>
                <p className="text-right font-medium">₹{(Number(data.totalAmountBeforeTax) || 0).toFixed(2)}</p>
              </div>

              {/* Tax Breakup */}
              <div className="p-3 space-y-1">
                {data.cgstTotal > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
                    <p>CGST:</p>
                    <p className="text-right">₹{(Number(data.cgstTotal) || 0).toFixed(2)}</p>
                  </div>
                )}
                {data.sgstTotal > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
                    <p>SGST:</p>
                    <p className="text-right">₹{(Number(data.sgstTotal) || 0).toFixed(2)}</p>
                  </div>
                )}
                {data.igstTotal > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
                    <p>IGST:</p>
                    <p className="text-right">₹{(Number(data.igstTotal) || 0).toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 p-3 bg-primary-50 border-t border-black font-bold text-primary-900 border-b-0">
                <p>Grand Total:</p>
                <p className="text-right">₹{(Number(data.totalAmountAfterTax) || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <div className="mt-6 p-4 border border-black rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Amount in Words:</p>
            <p className="font-bold capitalize">{amountInWords}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Bank Info & Signature */}
            <div className="flex justify-between">
              <div className="text-xs space-y-1.5">
                <p className="font-bold text-sm underline mb-2">Bank Details</p>
                <p><span className="font-semibold text-gray-600">Bank Name :</span> KARUR VYSYA BANK</p>
                <p><span className="font-semibold text-gray-600">Branch :</span> Hosur Branch</p>
                <p><span className="font-semibold text-gray-600">Account Name :</span> AARA INFRAA</p>
                <p><span className="font-semibold text-gray-600">Account No :</span> 160714000000012</p>
                <p><span className="font-semibold text-gray-600">IFSC Code :</span> KVBL0001607</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold mb-16">For AARA INFRAA</p>
                <p className="text-xs text-gray-500 border-t border-gray-400 pt-2 px-6">Authorised Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}