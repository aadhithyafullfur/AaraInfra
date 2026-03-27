const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const socketCorsOrigins = (process.env.SOCKET_CORS_ORIGIN || process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: socketCorsOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const user = socket.user;
    
    // Join appropriate rooms
    if (user.role === "admin") {
      socket.join("admin");
      console.log(`Admin joined room: admin`);
    } else {
      socket.join(user.id);
      console.log(`Client joined room: ${user.id}`);
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
