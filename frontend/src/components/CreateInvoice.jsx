import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toWords } from "number-to-words";
import {
  Save,
  Eye,
  FileCheck,
  Package
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import ClientDetailsForm from "./ClientDetailsForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import GSTAndTotalSection from "./GSTAndTotalSection";
import ProductQuickSelect from "@/components/ProductQuickSelect";
import InvoicePreview from "@/components/InvoicePreview";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function CreateInvoice() {
  const [products, setProducts] = useState([]);
  const [gstPercent, setGstPercent] = useState(18);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: 101,
    date: new Date().toISOString().slice(0, 10),
    client: { name: "", gstin: "", address: "", state: "" },
    deliveryNote: "",
    buyerOrderNo: "",
    referenceNo: "",
    deliveryAddress: "",
    transport: "",
    gstType: "intra",
    handlingCharges: 0,
    roundOff: 0,
    items: [{ description: "", quantity: 1, rate: 0, hsnCode: "" }],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, {
        description: `${product.name} - ${product.material}`,
        quantity: 1,
        width: 1,
        height: 1,
        pricePerSqFt: product.pricePerSqFt ? product.pricePerSqFt : product.rate,
        rate: product.pricePerSqFt ? product.pricePerSqFt : product.rate, // Initial rate assuming 1x1
        hsnCode: product.hsnCode,
        productId: product._id,
        isWindow: !!product.pricePerSqFt
      }],
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoiceData((prev) => {
      const newItems = [...prev.items];
      const item = { ...newItems[index], [field]: value };

      if (field === "width" || field === "height" || field === "pricePerSqFt") {
        const w = parseFloat(item.width) || 0;
        const h = parseFloat(item.height) || 0;
        const p = parseFloat(item.pricePerSqFt) || 0;
        if (w > 0 && h > 0 && p > 0) {
          item.rate = w * h * p;
        }
      }

      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const number = ("00" + invoiceData.invoiceNo).slice(-3);
    return `AARA-INV-${year}-${number}`;
  };

  const _invoiceDataWithNumber = {
    ...invoiceData,
    invoiceNo: generateInvoiceNumber(),
  };

  const gstAmount =
    invoiceData.gstType === "intra"
      ? subtotal * (gstPercent / 200) * 2
      : subtotal * (gstPercent / 100);

  const total = subtotal + gstAmount + Number(invoiceData.roundOff);

  const toWordsCustom = (num) => {
    const words = toWords(num);
    return words.charAt(0).toUpperCase() + words.slice(1) + " Rupees Only";
  };

  const transformData = () => {
    const items = invoiceData.items.map((item) => ({
      description: item.description,
      hsnCode: item.hsnCode,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate,
      per: "nos",
      width: item.width || 0,
      height: item.height || 0,
      pricePerSqFt: item.pricePerSqFt || 0,
      productId: item.productId,
      cgstRate: invoiceData.gstType === "intra" ? gstPercent / 2 : 0,
      cgstAmount:
        invoiceData.gstType === "intra"
          ? item.quantity * item.rate * (gstPercent / 200)
          : 0,
      sgstRate: invoiceData.gstType === "intra" ? gstPercent / 2 : 0,
      sgstAmount:
        invoiceData.gstType === "intra"
          ? item.quantity * item.rate * (gstPercent / 200)
          : 0,
      igstRate: invoiceData.gstType === "inter" ? gstPercent : 0,
      igstAmount:
        invoiceData.gstType === "inter"
          ? item.quantity * item.rate * (gstPercent / 100)
          : 0,
    }));

    const totalAmountBeforeTax = subtotal;
    const gstAmount =
      invoiceData.gstType === "intra"
        ? subtotal * (gstPercent / 200) * 2
        : subtotal * (gstPercent / 100);
    const total = totalAmountBeforeTax + gstAmount + Number(invoiceData.roundOff);

    const amountInWords = toWordsCustom(total);
    const invoiceNumber = generateInvoiceNumber();

    return {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceData.date,
      deliveryNote: invoiceData.deliveryNote,
      buyerOrderNo: invoiceData.buyerOrderNo,
      supplierRef: invoiceData.referenceNo,
      despatchedThrough: invoiceData.transport,
      destination: invoiceData.deliveryAddress,
      clientName: invoiceData.client.name,
      clientAddress: invoiceData.client.address,
      clientGSTIN: invoiceData.client.gstin,
      clientState: invoiceData.client.state,
      items: items,
      totalAmountBeforeTax: totalAmountBeforeTax,
      cgstTotal: invoiceData.gstType === "intra" ? gstAmount / 2 : 0,
      sgstTotal: invoiceData.gstType === "intra" ? gstAmount / 2 : 0,
      igstTotal: invoiceData.gstType === "inter" ? gstAmount : 0,
      totalTaxAmount: gstAmount,
      totalAmountAfterTax: total,
      amountInWords: amountInWords,
    };
  };

  const saveInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = transformData();

      const response = await fetch(`${API_BASE_URL}/api/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Invoice saved:", data);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/invoice");
        }, 2000);
      } else {
        const error = await response.json();
        console.error("Save failed:", error);
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Invoice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to generate a new invoice.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span className="font-medium">Preview</span>
          </button>
          <button
            onClick={saveInvoice}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Save Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          <ClientDetailsForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <InvoiceDetailsForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            updateItem={updateItem}
            products={products}
            onProductSelect={handleProductSelect}
          />

          <GSTAndTotalSection
            gstPercent={gstPercent}
            setGstPercent={setGstPercent}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            subtotal={subtotal}
            gstAmount={gstAmount}
            total={total}
          />
        </div>

        {/* Sidebar / Quick Select */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Product Select Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <Package className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-lg">Quick Add Products</h3>
            </div>
            <ProductQuickSelect products={products} onSelect={handleProductSelect} />

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Invoice Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Items</span>
                  <span>{invoiceData.items.length}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Invoice Saved!</h4>
              <p className="text-green-50 text-sm">Redirecting to history...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      {showPreview && (
        <InvoicePreview
          invoiceData={transformData()} // Pass the transformed, calculated data
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

