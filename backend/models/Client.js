const mongoose = require("mongoose");

const clientActivitySchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  gstin: {
    type: String,
    sparse: true,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  stateCode: {
    type: String,
    trim: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  activityHistory: {
    type: [clientActivitySchema],
    default: [],
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Client", clientSchema);
