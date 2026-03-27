const express = require('express');
const router = express.Router();
const { verifyToken, isClient } = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Client = require('../models/Client');

// GET /api/client/invoices
router.get('/invoices', verifyToken, isClient, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.clientId) {
        return res.json([]);
    }

    const client = await Client.findById(user.clientId);
    if (!client) {
        return res.json([]);
    }

    // Match invoices based on clientGSTIN (as Invoice models do not have clientId)
    const invoices = await Invoice.find({ clientGSTIN: client.gstin }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    res.status(500).json({ message: 'Server error retrieving invoices' });
  }
});

// GET /api/client/profile
router.get('/profile', verifyToken, isClient, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let clientData = null;
    if (user.clientId) {
      clientData = await Client.findById(user.clientId);
    }

    res.json({
        user: { name: user.name, email: user.email, role: user.role },
        client: clientData
    });
  } catch (error) {
    console.error("Error fetching client profile:", error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

module.exports = router;
