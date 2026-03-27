const Client = require("../models/Client");
const Order = require("../models/Order");
const SupportMessage = require("../models/SupportMessage");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientGSTIN,
      clientAddress,
      clientState,
      clientStateCode,
      lastLogin,
    } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !clientAddress) {
      return res.status(400).json({ message: "Name, email, phone and address are required" });
    }

    let existingClient = await Client.findOne({ $or: [{ email: clientEmail }, { phone: clientPhone }] });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this email or phone already exists" });
    }

    // Create a new client
    const newClient = new Client({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      gstin: clientGSTIN,
      address: clientAddress,
      state: clientState,
      stateCode: clientStateCode,
      lastLogin: lastLogin || null,
    });

    // Save the client to the database
    await newClient.save();
    res.status(201).json({ message: "Client created successfully", client: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create client", error: err.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ lastLogin: -1, createdAt: -1 }).lean();

    const clientIds = clients.map((client) => client._id);

    const [orderStats, supportStats] = await Promise.all([
      Order.aggregate([
        { $match: { client: { $in: clientIds } } },
        {
          $group: {
            _id: "$client",
            totalOrders: { $sum: 1 },
            lastOrderAt: { $max: "$createdAt" },
          },
        },
      ]),
      SupportMessage.aggregate([
        { $match: { client_id: { $in: clientIds } } },
        {
          $group: {
            _id: "$client_id",
            totalSupportMessages: { $sum: 1 },
            lastSupportAt: { $max: "$createdAt" },
          },
        },
      ]),
    ]);

    const orderStatsMap = new Map(orderStats.map((entry) => [String(entry._id), entry]));
    const supportStatsMap = new Map(supportStats.map((entry) => [String(entry._id), entry]));

    const clientsWithSummary = clients.map((client) => {
      const orderSummary = orderStatsMap.get(String(client._id));
      const supportSummary = supportStatsMap.get(String(client._id));
      const normalizedHistory = Array.isArray(client.activityHistory)
        ? [...client.activityHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      if (normalizedHistory.length === 0 && client.createdAt) {
        normalizedHistory.push({
          eventType: "registered",
          description: "Client registered",
          createdAt: client.createdAt,
          meta: {},
        });
      }

      return {
        ...client,
        totalOrders: orderSummary?.totalOrders || 0,
        lastOrderAt: orderSummary?.lastOrderAt || null,
        totalSupportMessages: supportSummary?.totalSupportMessages || 0,
        lastSupportAt: supportSummary?.lastSupportAt || null,
        activityHistory: normalizedHistory,
      };
    });

    res.status(200).json(clientsWithSummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve clients", error: err.message });
  }
};

// Get a client by GSTIN
exports.getClientByGSTIN = async (req, res) => {
  try {
    const client = await Client.findOne({ gstin: req.params.gstin });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve client", error: err.message });
  }
};

// Update client details
exports.updateClient = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientGSTIN,
      clientAddress,
      clientState,
      clientStateCode,
      lastLogin,
    } = req.body;

    // Find the client by GSTIN
    const updatedClient = await Client.findOneAndUpdate(
      { gstin: req.params.gstin },  // Find by GSTIN
      {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        gstin: clientGSTIN,
        address: clientAddress,
        state: clientState,
        stateCode: clientStateCode,
        ...(lastLogin ? { lastLogin } : {}),
      },
      { new: true }  // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully", client: updatedClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update client", error: err.message });
  }
};

// Delete a client by GSTIN
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ gstin: req.params.gstin });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete client", error: err.message });
  }
};
