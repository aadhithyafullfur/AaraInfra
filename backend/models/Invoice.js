const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  description: String,
  hsnCode: String,
  quantity: Number,
  rate: Number,
  per: String,
  amount: Number,
  cgstRate: Number,
  cgstAmount: Number,
  sgstRate: Number,
  sgstAmount: Number,
  igstRate: Number,
  igstAmount: Number,

  // New fields for window specs
  width: Number,
  height: Number,
  pricePerSqFt: Number,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  deliveryNote: String,
  modeOfPayment: String,
  supplierRef: String,
  buyerOrderNo: String,
  deliveryNoteDate: Date,
  despatchedThrough: String,
  destination: String,

  clientName: { type: String, required: true },
  clientAddress: String,
  clientGSTIN: String,
  clientState: String,
  clientStateCode: String,

  items: [ItemSchema],

  totalAmountBeforeTax: Number,
  cgstTotal: Number,
  sgstTotal: Number,
  igstTotal: Number,
  totalTaxAmount: Number,
  totalAmountAfterTax: Number,
  amountInWords: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
