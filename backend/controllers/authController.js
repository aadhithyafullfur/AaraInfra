const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../models/User");
const Client = require("../models/Client");

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const TOKEN_EXPIRY = "1h";

// Generate token
const generateAuthToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role || 'client', clientId: user.clientId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
};

// Unified Login Logic
const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Admin Login Rule (Hardcoded)
    if (email === "aadhithyaa120@gmail.com" && password === "1234567890") {
      const token = jwt.sign({ id: "admin_hardcoded", role: "admin" }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY
      });
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: "admin_hardcoded",
          name: "Admin",
          email: email,
          role: "admin"
        }
      });
    }

    // Client Login Rule
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (typeof user.password !== "string" || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Secure password comparison
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
       isMatch = await user.matchPassword(password);
    } else {
       isMatch = (user.password === password);
    }
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const userRole = user.role || "client";

    let clientRecord = null;
    if (userRole === "client") {
      try {
        const matchConditions = [{ email: user.email }];
        if (user.clientId && mongoose.Types.ObjectId.isValid(String(user.clientId))) {
          matchConditions.unshift({ _id: user.clientId });
        }
        const existingClient = await Client.findOne({ $or: matchConditions });

        const canCreateClient = Boolean(user.name && user.email && user.phone);
        const clientData = {
          name: user.name,
          email: user.email,
          phone: existingClient?.phone || user.phone,
          address: existingClient?.address || "Address not provided",
          lastLogin: new Date(),
        };

        if (existingClient) {
          existingClient.name = clientData.name;
          existingClient.email = clientData.email;
          existingClient.phone = clientData.phone;
          existingClient.address = clientData.address;
          existingClient.lastLogin = clientData.lastLogin;
          clientRecord = await existingClient.save();
        } else if (canCreateClient) {
          clientRecord = await Client.create(clientData);
        }

        if (clientRecord && (!user.clientId || String(user.clientId) !== String(clientRecord._id))) {
          user.clientId = clientRecord._id;
          await user.save();
        }

        if (clientRecord) {
          try {
            const { getIO } = require("../socket");
            const io = getIO();
            io.to("admin").emit("clientLoggedIn", clientRecord);
            io.to("admin").emit("adminNotification", {
              type: "client",
              title: "New Client Activity",
              message: `${clientRecord.name} logged in`,
              createdAt: new Date().toISOString(),
              payload: {
                clientId: clientRecord._id,
                name: clientRecord.name,
              },
            });
          } catch (socketError) {
            console.error("Socket error on client login:", socketError);
          }
        }
      } catch (clientSyncError) {
        // Do not block authentication if client profile sync fails for legacy/bad records.
        console.error("Client sync error on login:", clientSyncError);
      }
    }

    const token = jwt.sign({ id: user._id, role: userRole, clientId: user.clientId }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        clientId: user.clientId
      },
      client: clientRecord
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.adminLogin = unifiedLogin;
exports.clientLogin = unifiedLogin;
exports.loginUser = unifiedLogin;

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // Check if user exists by email or phone
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ success: false, message: "Phone number already exists" });
      }
    }

    // Create new client record in Clients Collection
    const newClient = new Client({
      name,
      email,
      phone,
      address,
      state: "",
      stateCode: "",
      gstin: ""
    });
    await newClient.save();

    // Create new user with plain text password (INSECURE - As per previous setup, but should be hashed if possible)
    const newUser = new User({
      name,
      email,
      phone,
      password, // Stored in plain text based on pre-existing logic
      clientId: newClient._id
    });

    await newUser.save();

    const token = generateAuthToken(newUser);

    // Emit Real-Time Socket Event to Admin Room
    try {
        const { getIO } = require("../socket");
        const io = getIO();
        io.to("admin").emit("newClient", newClient);
    } catch (socketError) {
        console.error("Socket error on client registration:", socketError);
    }

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role || 'client',
        clientId: newClient._id
      }
    });

  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: "Duplicate entry found (Email or Phone)" });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `OTP sent to ${email}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset Password (Plain text storage)
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = newPassword; // Save as plain text
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
