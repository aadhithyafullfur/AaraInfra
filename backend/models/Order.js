const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: null,
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Confirmed", "Processing", "Shipped", "Delivered"],
    default: "Pending"
  },
  invoiceId: {
    type: String, // String representation or Reference to Invoice model later
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
