import { useEffect, useState } from "react";
import { Search, FileText, Eye, Filter, Calendar, ChevronDown, Download } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/client/invoices`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setInvoices(data);
            setFilteredInvoices(data);
        }
      } catch (err) {
        console.error("Error fetching client invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (search.trim() !== "") {
      filtered = filtered.filter((inv) =>
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate).getFullYear() === parseInt(year)
      );
    }

    if (month) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate).getMonth() === parseInt(month) - 1
      );
    }

    setFilteredInvoices(filtered);
  }, [search, year, month, invoices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">My Invoices</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your past invoices here.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Invoice #..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Year Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-700 dark:text-gray-300"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            {[...Array(5).keys()].map((i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <option key={yearOption} value={yearOption}>{yearOption}</option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Month Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-700 dark:text-gray-300"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((monthName, index) => (
              <option key={index + 1} value={index + 1}>{monthName}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-emerald-600 dark:text-emerald-400 font-medium">#{invoice.invoiceNumber?.split('-').pop() || invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {invoice.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      ₹{invoice.totalAmountAfterTax
                        ? invoice.totalAmountAfterTax.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })
                        : "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          window.open(`/invoice-preview/${invoice._id}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>No invoices found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
