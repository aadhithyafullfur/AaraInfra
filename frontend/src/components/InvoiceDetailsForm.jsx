import React from "react";
import { FileText, Truck, MapPin, Plus, Trash2, Tag, Box, DollarSign } from "lucide-react";

const InvoiceDetailsForm = ({
  invoiceData,
  setInvoiceData,
  updateItem,
  products = []
}) => {

  const handleRowProductChange = (index, productId) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      // Update the row with product details
      // We can't use updateItem for multiple fields at once if it only takes one field.
      // We need a way to batch update or just call updateItem multiple times (inefficient) or update functionality.
      // Since updateItem logic in parent is specific, let's just manually update items array here and setInvoiceData

      const newItems = [...invoiceData.items];
      newItems[index] = {
        ...newItems[index],
        description: `${product.name} - ${product.material}`,
        hsnCode: product.hsnCode || '',
        width: 1,
        height: 1,
        pricePerSqFt: product.pricePerSqFt || product.rate || 0,
        rate: (product.pricePerSqFt || product.rate || 0) * 1 * 1, // Default 1x1
        quantity: 1, // Reset qty or keep? Let's reset to 1
        productId: product._id
      };
      setInvoiceData({ ...invoiceData, items: newItems });
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 space-y-4 mb-6">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Invoice General Details
        </h2>
        {/* ... General Details Fields (Delivery, etc.) unchanged ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Note</label>
            <input
              type="text"
              placeholder="e.g. DN-1001"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              value={invoiceData.deliveryNote}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, deliveryNote: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Buyer's Order No</label>
            <input
              type="text"
              placeholder="e.g. PO-2023-001"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              value={invoiceData.buyerOrderNo}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, buyerOrderNo: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reference No</label>
            <input
              type="text"
              placeholder="e.g. REF-555"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              value={invoiceData.referenceNo}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, referenceNo: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transport</label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. VRL"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                value={invoiceData.transport}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, transport: e.target.value })
                }
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Address (if different)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows="2"
                placeholder="Enter full delivery address"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none"
                value={invoiceData.deliveryAddress}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, deliveryAddress: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Item Details</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 font-mono">
            {invoiceData.items.length} Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8 text-center">#</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">Description</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">HSN</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 text-center">Size (W x H)</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 text-right">Price/SqFt</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24 text-right">Unit Rate</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20 text-center">Qty</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28 text-right">Amount</th>
                <th className="px-4 py-4 w-10"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="group hover:bg-sky-50/30 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-center text-xs text-gray-400 font-mono">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {products.length > 0 && (
                        <select
                          className="w-full text-xs p-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mb-1"
                          onChange={(e) => handleRowProductChange(index, e.target.value)}
                          value={item.productId || ''}
                        >
                          <option value="">Select Product...</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.name} - {p.material} (₹{p.pricePerSqFt}/sqft)
                            </option>
                          ))}
                        </select>
                      )}
                      <input
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-lg outline-none transition-all text-sm"
                        value={item.description}
                        placeholder="Item Description"
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-lg outline-none transition-all text-sm font-mono text-center"
                      value={item.hsnCode || ''}
                      placeholder="HSN"
                      onChange={(e) => updateItem(index, "hsnCode", e.target.value)}
                    />
                  </td>

                  {/* Size (W x H) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-center"
                        placeholder="W"
                        value={item.width || ''}
                        onChange={(e) => updateItem(index, "width", e.target.value)}
                      />
                      <span className="text-gray-400">x</span>
                      <input
                        type="number"
                        className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-center"
                        placeholder="H"
                        value={item.height || ''}
                        onChange={(e) => updateItem(index, "height", e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Price/SqFt */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-right"
                      value={item.pricePerSqFt || ''}
                      placeholder="0.00"
                      onChange={(e) => updateItem(index, "pricePerSqFt", e.target.value)}
                    />
                  </td>

                  {/* Calculated Unit Rate */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-lg outline-none transition-all text-sm text-right font-mono"
                      value={item.rate}
                      placeholder="0.00"
                      onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-lg outline-none transition-all text-sm text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value) || 0)
                      }
                    />
                  </td>

                  {/* Amount (Rate * Qty) */}
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white text-sm">
                    ₹{(item.quantity * item.rate).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {invoiceData.items.length > 1 && (
                      <button
                        onClick={() => {
                          const newItems = invoiceData.items.filter(
                            (_, i) => i !== index
                          );
                          setInvoiceData({ ...invoiceData, items: newItems });
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Item Footer */}
        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setInvoiceData((prev) => ({
                ...prev,
                items: [
                  ...prev.items,
                  { description: "", quantity: 1, rate: 0, hsnCode: "", width: 1, height: 1, pricePerSqFt: 0 },
                ],
              }));
            }}
            className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Line Item
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailsForm;