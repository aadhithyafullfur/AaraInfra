import { useEffect, useState } from "react";
import { Search, FileText, Eye, Filter, Calendar, ChevronDown } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/invoices/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (search.trim() !== "") {
      filtered = filtered.filter((inv) =>
        inv.clientName.toLowerCase().includes(search.toLowerCase())
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

    if (priceRange) {
      switch (priceRange) {
        case "<5000":
          filtered = filtered.filter((inv) => inv.totalAmountAfterTax < 5000);
          break;
        case "5000-10000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 5000 && inv.totalAmountAfterTax <= 10000
          );
          break;
        case "10000-20000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 10000 && inv.totalAmountAfterTax <= 20000
          );
          break;
        case "20000-50000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 20000 && inv.totalAmountAfterTax <= 50000
          );
          break;
        case "50000-100000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 50000 && inv.totalAmountAfterTax <= 100000
          );
          break;
        case ">100000":
          filtered = filtered.filter((inv) => inv.totalAmountAfterTax > 100000);
          break;
        default:
          break;
      }
    }

    setFilteredInvoices(filtered);
  }, [search, year, month, priceRange, invoices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Invoice History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage past invoices.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Client..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Year Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-300"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            {[...Array(5).keys()].map((i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Month Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-300"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-gray-300"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="<5000">{"< 5000"}</option>
            <option value="5000-10000">{"5000 - 10000"}</option>
            <option value="10000-20000">{"10000 - 20000"}</option>
            <option value="20000-50000">{"20000 - 50000"}</option>
            <option value="50000-100000">{"50000 - 100000"}</option>
            <option value=">100000">{"> 100000"}</option>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-primary-600 dark:text-primary-400 font-medium">#{invoice.invoiceNumber?.split('-').pop() || invoice.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.clientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">GST: {invoice.clientGSTIN}</div>
                    </td>
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
                          window.location.href = `/invoice-preview/${invoice._id}`;
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
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
