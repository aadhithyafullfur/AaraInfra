import React from "react";
import { User, MapPin, Building2, Map, CreditCard } from "lucide-react";

const ClientDetailsForm = ({ invoiceData, setInvoiceData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-4">
      <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <User className="w-5 h-5 text-primary-500" />
        Client Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search or enter client name"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              value={invoiceData.client.name}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  client: { ...invoiceData.client, name: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GSTIN</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter 15-digit GSTIN"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 font-mono uppercase"
              value={invoiceData.client.gstin}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  client: { ...invoiceData.client, gstin: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              rows="2"
              placeholder="Full billing address"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none"
              value={invoiceData.client.address}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  client: { ...invoiceData.client, address: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
          <div className="relative">
            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Karnataka"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              value={invoiceData.client.state}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  client: { ...invoiceData.client, state: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsForm;