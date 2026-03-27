import React from "react";
import { Calculator, Percent, CreditCard, ArrowRight } from "lucide-react";

const GSTAndTotalSection = ({
  gstPercent,
  setGstPercent,
  invoiceData,
  setInvoiceData,
  subtotal,
  gstAmount,
  total,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary-500" />
        Tax & Totals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Controls */}
        <div className="space-y-5">
          {/* GST Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Rate (%)</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none text-gray-700 dark:text-gray-200"
              >
                {[0, 5, 12, 18, 28].map((val) => (
                  <option key={val} value={val}>
                    {val}% GST
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* GST Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${invoiceData.gstType === 'intra' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-transparent'}`}>
                  {invoiceData.gstType === 'intra' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                </div>
                <input
                  type="radio"
                  name="gstType"
                  value="intra"
                  checked={invoiceData.gstType === "intra"}
                  onChange={() => setInvoiceData({ ...invoiceData, gstType: "intra" })}
                  className="hidden"
                />
                <span className={`text-sm font-medium transition-colors ${invoiceData.gstType === 'intra' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Intra-State (CGST + SGST)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${invoiceData.gstType === 'inter' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-transparent'}`}>
                  {invoiceData.gstType === 'inter' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                </div>
                <input
                  type="radio"
                  name="gstType"
                  value="inter"
                  checked={invoiceData.gstType === "inter"}
                  onChange={() => setInvoiceData({ ...invoiceData, gstType: "inter" })}
                  className="hidden"
                />
                <span className={`text-sm font-medium transition-colors ${invoiceData.gstType === 'inter' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Inter-State (IGST)</span>
              </label>
            </div>
          </div>

          {/* Round Off */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Round Off</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">+/-</span>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                value={invoiceData.roundOff}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, roundOff: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                GST ({gstPercent}%)
                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  {invoiceData.gstType === "intra" ? "CGST+SGST" : "IGST"}
                </span>
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {Number(invoiceData.roundOff) !== 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Round Off</span>
                <span className={`font-semibold ${Number(invoiceData.roundOff) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {Number(invoiceData.roundOff) > 0 ? '+' : ''}{Number(invoiceData.roundOff).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-1">Total Amount</span>
                <span className="text-xs text-gray-400">Including all taxes</span>
              </div>
              <span className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
                ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTAndTotalSection;