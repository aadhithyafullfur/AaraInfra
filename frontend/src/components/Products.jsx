import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Tag, Percent, Image as ImageIcon, Trash2, Edit2, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || API_BASE_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Sliding",
    material: "uPVC",
    size: "",
    pricePerSqFt: "",
    gstRate: 18,
    hsnCode: "",
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append all form fields
    Object.keys(form).forEach(key => {
      if (key === 'image' && form[key] instanceof File) {
        formData.append('image', form[key]);
      } else if (key !== 'image') {
        formData.append(key, form[key]);
      }
    });

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/products/${editingId}`
        : `${API_BASE_URL}/api/products`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is set automatically for FormData
        },
        body: formData
      });

      if (res.ok) {
        setForm({
          name: "", category: "Sliding", material: "uPVC", size: "",
          pricePerSqFt: "", gstRate: 18, hsnCode: "", description: "", image: null
        });
        setImagePreview(null);
        setIsFormOpen(false);
        setEditingId(null);
        fetchProducts();
      } else {
        console.error("Failed to save product");
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      material: product.material,
      size: product.size,
      pricePerSqFt: product.pricePerSqFt,
      gstRate: product.gstRate,
      hsnCode: product.hsnCode,
      description: product.description,
      image: null // Create logic to keep existing image if not changed
    });
    // Set existing image preview URL from server if available
    if (product.image) {
      setImagePreview(product.image.startsWith('http') ? product.image : `${ASSETS_BASE_URL}/${product.image}`);
    } else {
      setImagePreview(null);
    }
    setEditingId(product._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Product Catalog</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage windows, materials, and pricing.</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setForm({
              name: "", category: "Sliding", material: "uPVC", size: "",
              pricePerSqFt: "", gstRate: 18, hsnCode: "", description: "", image: null
            });
            setImagePreview(null);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium ${isFormOpen ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30'}`}
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{isFormOpen ? 'Cancel' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-soft border border-gray-100 dark:border-gray-700 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-primary-500" /> : <Plus className="w-5 h-5 text-primary-500" />}
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Image Upload */}
            <div className="lg:col-span-1 row-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
              <div className="relative group w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* General Info */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sliding Window"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none"
                  >
                    <option>Sliding</option>
                    <option>Casement</option>
                    <option>Fixed</option>
                    <option>French</option>
                    <option>Tilt & Turn</option>
                    <option>Ventilator</option>
                  </select>
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material</label>
                <select
                  value={form.material}
                  onChange={e => setForm({ ...form, material: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option>uPVC</option>
                  <option>Aluminum</option>
                  <option>Wooden</option>
                  <option>Steel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 4ft x 4ft"
                  value={form.size}
                  onChange={e => setForm({ ...form, size: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HSN Code</label>
                <input
                  type="text"
                  placeholder="HSN"
                  value={form.hsnCode}
                  onChange={e => setForm({ ...form, hsnCode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price per Sq. Ft (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.pricePerSqFt}
                  onChange={e => setForm({ ...form, pricePerSqFt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  placeholder="18"
                  value={form.gstRate}
                  onChange={e => setForm({ ...form, gstRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Product description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="lg:col-span-3 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all font-medium"
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product?._id || Math.random().toString()} className="group bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800/50">
              {product?.image ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `${ASSETS_BASE_URL}/${product.image.replace(/\\/g, '/')}`}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={`https://picsum.photos/seed/${product?._id || 'adminfallback'}/400/300`}
                  alt={product?.name || "Product Default"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                {product?.material || "Standard"}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{product?.name || "Unnamed Product"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product?.category} • {product?.size || 'Custom Size'}</p>
                </div>
                <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 flex-shrink-0 rounded-lg text-[13px] font-bold">
                  ₹{product?.pricePerSqFt || product?.price || 0}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
                {product?.description || 'No description available.'}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <div className="flex gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> GST: {product.gstRate}%</span>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> HSN: {product.hsnCode}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !isFormOpen && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
          <Package className="w-16 h-16 opacity-20 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
          <p className="mb-6">Get started by adding your first product.</p>
          <button onClick={() => setIsFormOpen(true)} className="text-primary-600 font-medium hover:underline">Add First Product</button>
        </div>
      )}
    </div>
  );
}
