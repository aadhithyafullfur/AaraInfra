const express = require("express");
const router = express.Router();
const { placeOrder, updateOrderStatus, getAdminOrders, getClientOrders, getOrderById } = require("../controllers/orderController");
const { verifyToken, isAdmin, isClient } = require("../middleware/auth");

// Client placing an order
router.post("/", verifyToken, isClient, placeOrder);

// Client reading their own orders
router.get("/client", verifyToken, isClient, getClientOrders);

// Admin getting all orders
router.get("/admin", verifyToken, isAdmin, getAdminOrders);

// Admin updating order status
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

// Get single order (Admin or Client Owner)
router.get("/:id", verifyToken, getOrderById);

module.exports = router;
