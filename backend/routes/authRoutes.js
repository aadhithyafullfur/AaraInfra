const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  loginUser,
  clientLogin,
  adminLogin,
  forgotPassword,
  registerUser,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

// Authentication Routes (Login, Register, etc.)
router.post("/login", loginUser);
router.post("/client-login", clientLogin);
router.post("/admin-login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/register", registerUser);

// Protected Route - Requires valid JWT token
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
    tokenInfo: {
      issuedAt: new Date(req.user.iat * 1000),
      expiresAt: req.user.exp ? new Date(req.user.exp * 1000) : 'No expiration',
    }
  });
});

module.exports = router;
