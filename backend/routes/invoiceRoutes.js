const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const {
  createInvoice,
  getLatestInvoice,
  getInvoiceById,
  updateInvoice,
  getAllInvoices
} = require("../controllers/invoiceController");

router.post("/", verifyToken, isAdmin, createInvoice);
router.get("/latest", verifyToken, isAdmin, getLatestInvoice);
router.get("/all", verifyToken, isAdmin, getAllInvoices);
router.get("/:id", verifyToken, getInvoiceById);
router.put("/:id", verifyToken, isAdmin, updateInvoice);

module.exports = router;
