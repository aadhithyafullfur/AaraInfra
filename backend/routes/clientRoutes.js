const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Ensure the following lines are correct
router.post("/create", verifyToken, isAdmin, clientController.createClient);
router.get("/", verifyToken, isAdmin, clientController.getClients);
router.get("/:gstin", verifyToken, isAdmin, clientController.getClientByGSTIN);
router.put("/:gstin", verifyToken, isAdmin, clientController.updateClient);
router.delete("/:gstin", verifyToken, isAdmin, clientController.deleteClient);

module.exports = router;  // Ensure you're exporting the router correctly
