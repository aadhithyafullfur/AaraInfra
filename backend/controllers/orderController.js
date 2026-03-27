const Order = require("../models/Order");
const Product = require("../models/Product");
const Client = require("../models/Client");
const User = require("../models/User");
const { getIO } = require("../socket");
const { appendClientHistory } = require("../utils/clientHistory");

const generateOrderId = () => {
  const now = Date.now();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${now}-${rand}`;
};

// Place a new Order
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid order: items are required." });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "Client user not found." });
    }

    const client = user.clientId ? await Client.findById(user.clientId).lean() : null;
    const normalizedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (!item?.product) {
        return res.status(400).json({ success: false, message: "Invalid order: product is required for each item." });
      }

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid order: quantity must be greater than zero." });
      }

      const dbProduct = await Product.findById(item.product).lean();
      if (!dbProduct) {
        return res.status(400).json({ success: false, message: `Invalid order: product ${item.product} does not exist.` });
      }

      const productPrice = Number(item.price ?? dbProduct.pricePerSqFt ?? 0);
      if (!Number.isFinite(productPrice) || productPrice <= 0) {
        return res.status(400).json({ success: false, message: "Invalid order: price must be greater than zero." });
      }

      normalizedItems.push({
        product: dbProduct._id,
        name: item.name || dbProduct.name,
        quantity,
        price: productPrice,
      });

      calculatedTotal += quantity * productPrice;
    }

    const orderId = generateOrderId();
    const clientName = client?.name || user.name;

    const order = new Order({
      orderId,
      user: req.user.id,
      clientId: client?._id || null,
      client: client?._id || req.user.clientId || null,
      clientName,
      items: normalizedItems,
      totalAmount: calculatedTotal,
      totalPrice: calculatedTotal,
      status: "Pending"
    });

    const createdOrder = await order.save();
    const populatedOrder = await createdOrder.populate("user", "name email");

    if (createdOrder.client) {
      await appendClientHistory(
        createdOrder.client,
        "order_placed",
        `Order ${orderId} placed`,
        {
          orderId,
          amount: calculatedTotal,
          status: "Pending",
        }
      );
    }

    // Socket: Emit event to admin room and client
    try {
      const io = getIO();
      io.to("admin").emit("newOrder", populatedOrder);
      io.to("admin").emit("orderReceived", populatedOrder);
      io.to("admin").emit("adminNotification", {
        type: "order",
        title: "New Order Received",
        message: `Order ${orderId} placed by ${clientName}`,
        createdAt: new Date().toISOString(),
        payload: {
          orderId,
          clientName,
          totalPrice: calculatedTotal,
        },
      });

      // Notify the client who placed it
      io.to(req.user.id.toString()).emit("clientNotification", {
        id: `cnotif-${Date.now()}`,
        type: "order_placed",
        title: "Order Placed",
        message: `Your order #${orderId.substring(orderId.length - 8).toUpperCase()} has been submitted.`,
        createdAt: new Date().toISOString()
      });
    } catch (socketError) {
      console.error("Socket error on placeOrder:", socketError);
    }
    
    res.status(201).json({ success: true, order: populatedOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: "Server error while placing order." });
  }
};

// Get Single Order By ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId || !orderId.match(/^[0-9a-fA-F]{24}$/)) {
       return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId).populate("user", "name email").populate("items.product", "name image price");
    
    if (!order) {
       return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Role check: Only admin or the owner can view
    const isOwner = order.user && (
      order.user._id?.toString() === req.user.id || 
      order.user.toString() === req.user.id
    );

    if (req.user.role !== 'admin' && !isOwner) {
       return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error fetching single order:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order details", error: err.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const requestedStatus = String(status || "").trim();
    const statusMap = {
      pending: "Pending",
      confirmed: "Accepted",
      accept: "Accepted",
      accepted: "Accepted",
      processing: "Accepted",
      shipped: "Accepted",
      delivered: "Accepted",
      reject: "Rejected",
      rejected: "Rejected",
    };
    const normalizedStatus = statusMap[requestedStatus.toLowerCase()];
    
    if (!normalizedStatus) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Use findByIdAndUpdate to bypass validation errors on legacy documents missing required fields
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status: normalizedStatus }, 
      { new: true }
    );

    if (updatedOrder?.client) {
      await appendClientHistory(
        updatedOrder.client,
        "order_status_updated",
        `Order ${updatedOrder.orderId || updatedOrder._id} marked as ${normalizedStatus}`,
        {
          orderId: updatedOrder.orderId || String(updatedOrder._id),
          status: normalizedStatus,
        }
      );
    }

    // Socket: Notify the user who placed this order
    try {
      const io = getIO();
      
      if (updatedOrder.user) {
        io.to(updatedOrder.user.toString()).emit("orderStatusUpdate", {
          orderId: updatedOrder._id,
          status: normalizedStatus
        });
        
        io.to(updatedOrder.user.toString()).emit("clientNotification", {
          id: `cnotif-${Date.now()}`,
          type: "order_status",
          title: "Order Status Updated",
          message: `Your order #${updatedOrder._id.toString().substring(updatedOrder._id.toString().length - 8).toUpperCase()} is now ${normalizedStatus}.`,
          createdAt: new Date().toISOString()
        });
      }

      io.to("admin").emit("orderUpdated", {
        orderId: updatedOrder._id,
        status: normalizedStatus,
      });
    } catch (socketError) {
        console.error("Socket error on updateOrderStatus:", socketError);
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// Get all orders (Admin only)
exports.getAdminOrders = async (req, res) => {
  try {
    // Sort by most recent
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error getting admin orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get client's own orders
exports.getClientOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error getting client orders:", err);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};
