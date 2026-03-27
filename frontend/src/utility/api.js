import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const API_URL = `${API_BASE_URL}/api/auth`;

// Register API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "An error occurred during registration";
  }
};

// Login API call (Legacy)
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred during login";
  }
};

// Admin Login API call
export const adminLoginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/admin-login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred during admin login";
  }
};

// Client Login API call
export const clientLoginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/client-login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred during client login";
  }
};

// Submit Support Message API call
export const submitSupportMessage = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/support/contact`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred while submitting your message";
  }
};

const getAuthHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
};

// Orders APIs
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to place order";
  }
};

export const getClientOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/orders/client`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch orders";
  }
};

export const getAdminOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/orders/admin`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch admin orders";
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update order status";
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch order details";
  }
};

// Admin Support APIs
export const getAdminSupportMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/support`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch support messages";
  }
};

export const replySupportMessage = async (messageId, replyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/support/${messageId}/reply`, replyData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reply to support message";
  }
};
