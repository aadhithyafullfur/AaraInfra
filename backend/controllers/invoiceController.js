import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("User ID from JWT:", req.user); // Check if user is attached correctly

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID is missing or invalid." });
    }

    const invoiceCount = await Invoice.countDocuments({ createdBy: req.user.id });
    const invoiceNumber = `AARA-INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`;

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      createdBy: req.user.id,
    };

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json({ message: "Invoice created", invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    console.log("Fetching all invoices for Admin:", req.user.id);

    // Query the database for all invoices (Admin should see all)
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    // Return the invoices in the response
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching all invoices:", err); // Log the error for debugging
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};


export const getLatestInvoice = async (req, res) => {
  try {
    const latestInvoice = await Invoice.findOne()
      .sort({ createdAt: -1 });


    if (!latestInvoice) {
      return res.status(200).json(null);
    }

    res.status(200).json(latestInvoice);
  } catch (error) {
    console.error("Error fetching latest invoice:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    if (invoiceId === "all") {
      return getAllInvoices(req, res); // Fetch all invoices
    }

    if (invoiceId === "latest") {
      // Handle the "latest" case separately without querying by _id
      return getLatestInvoice(req, res); // Fetch the latest invoice
    }

    // For other cases, find invoice by ID
    // If the user isn't an admin, we might want to restrict this, but currently this route doesn't even
    // apply isAdmin. However, the error from the stack trace indicates that `createdBy` being set to "admin_hardcoded"
    // implies it's trying to cast that string to an ObjectId. We should remove this filter to allow the invoice to be viewed.
    const query = { _id: invoiceId };
    if (req.user && req.user.role !== 'admin') {
         query.createdBy = req.user.id;
    }
    const invoice = await Invoice.findOne(query);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateInvoice = async (req, res) => {
  try {
    console.log("Invoice ID from URL: ", req.params.id);
    console.log("User ID from JWT: ", req.user.id);

    const query = { _id: req.params.id };
    if (req.user && req.user.role !== 'admin') {
         query.createdBy = req.user.id;
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      query,
      req.body,                     // Fields to update
      { new: true }                 // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found or not authorized" });
    }

    res.status(200).json({ message: "Invoice updated", invoice: updatedInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update invoice", error: err.message });
  }
};
