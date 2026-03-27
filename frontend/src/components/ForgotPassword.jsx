import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
    setTimeout(() => setMessage(null), 4000);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        handleMessage("OTP sent to your email.");
        setStep(2);
      } else {
        handleMessage(data.message || "Failed to send OTP", true);
      }
    } catch {
      handleMessage("Error sending OTP", true);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        handleMessage("OTP verified successfully.");
        setStep(3);
      } else {
        handleMessage(data.message || "Invalid OTP", true);
      }
    } catch {
      handleMessage("Error verifying OTP", true);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }), // ✅ Correct: only send what's needed
      });
      
      const data = await res.json();
      if (res.ok) {
        handleMessage("Password reset successfully.");
        setTimeout(onClose, 1500);
      } else {
        handleMessage(data.message || "Failed to reset password", true);
      }
    } catch {
      handleMessage("Error resetting password", true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>

        {message && (
          <div
            className={`mb-4 text-sm p-2 rounded text-center ${
              isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
          title="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
