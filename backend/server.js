const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/client", require("./routes/clientPortalRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log the error for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

const http = require("http");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
