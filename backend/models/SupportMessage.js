const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  client_name: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  replies: [{
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admin_name: { type: String },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  // Old fields kept optional to sustain legacy /contact route if still active
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
