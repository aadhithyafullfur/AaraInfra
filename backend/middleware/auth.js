const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// authMiddleware.js
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({
      message: "Token verification failed",
      error: err.message
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

const isClient = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Client only." });
  }
};

module.exports = { verifyToken, isAdmin, isClient };
