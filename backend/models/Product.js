const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Sliding, Casement
  material: { type: String, required: true }, // e.g., uPVC, Aluminum
  size: { type: String }, // e.g., 4ft x 4ft
  pricePerSqFt: { type: Number, required: true },
  gstRate: { type: Number, default: 18 },
  hsnCode: { type: String },
  image: { type: String }, // URL or file path
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
