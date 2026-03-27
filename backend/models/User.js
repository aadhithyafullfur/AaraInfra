const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client"
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }
});

// Method to generate JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // 1 hour expiry for the JWT token
  });
  return token;
};

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
