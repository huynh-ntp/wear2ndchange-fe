import axios from "axios";
import { updateOrderStatus } from "./orderService";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api"
    : process.env.REACT_APP_API_BASE_URL || "http://45.119.82.37:8080/api";

// Create axios instance for non-authenticated requests
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Create axios instance for authenticated requests
const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for private API
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Add CORS headers for preflight requests
    config.headers["Access-Control-Allow-Origin"] = API_BASE_URL;
    config.headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, OPTIONS";
    config.headers["Access-Control-Allow-Headers"] =
      "Origin, Content-Type, Accept, Authorization";
    config.headers["Access-Control-Allow-Credentials"] = "true";

    // Log request in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("API Request Config:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for public API (no redirect on 401)
const publicResponseInterceptor = (error) => {
  // Check for network errors and mixed content
  if (error.message === "Network Error") {
    console.error("Network Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      protocol: window.location.protocol,
      host: window.location.host,
    });

    if (
      window.location.protocol === "https:" &&
      API_BASE_URL.startsWith("http:")
    ) {
      console.error("Possible mixed content issue - attempting to use HTTPS");
      error.config.baseURL = API_BASE_URL.replace("http:", "https:");
      return publicApi(error.config);
    }
  }

  // Add retry logic for certain errors
  if (error.response?.status === 0 || error.response?.status === 502) {
    const retryCount = error.config?.retryCount || 0;
    if (retryCount < 3) {
      error.config.retryCount = retryCount + 1;
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        return publicApi(error.config);
      });
    }
  }

  return Promise.reject(error);
};

// Response interceptor for private API (with redirect on 401)
const privateResponseInterceptor = (error) => {
  // Check for network errors and mixed content
  if (error.message === "Network Error") {
    console.error("Network Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      protocol: window.location.protocol,
      host: window.location.host,
    });

    if (
      window.location.protocol === "https:" &&
      API_BASE_URL.startsWith("http:")
    ) {
      console.error("Possible mixed content issue - attempting to use HTTPS");
      error.config.baseURL = API_BASE_URL.replace("http:", "https:");
      return privateApi(error.config);
    }
  }

  // Handle authentication errors
  if (
    error.response?.status === 401 &&
    !error.config.url.includes("/auth/login")
  ) {
    localStorage.removeItem("token");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  // Add retry logic for certain errors
  if (error.response?.status === 0 || error.response?.status === 502) {
    const retryCount = error.config?.retryCount || 0;
    if (retryCount < 3) {
      error.config.retryCount = retryCount + 1;
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        return privateApi(error.config);
      });
    }
  }

  return Promise.reject(error);
};

publicApi.interceptors.response.use(
  (response) => response,
  publicResponseInterceptor
);
privateApi.interceptors.response.use(
  (response) => response,
  privateResponseInterceptor
);

export const authService = {
  login: async (credentials) => {
    try {
      console.log("Sending login request:", {
        url: API_BASE_URL + "/auth/login",
        credentials: { ...credentials, password: "***" },
      });
      const response = await publicApi.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      console.log("Login response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });
      return response;
    } catch (error) {
      console.error("API Login Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      throw error;
    }
  },
  adminLogin: async (credentials) => {
    try {
      const response = await publicApi.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      return response;
    } catch (error) {
      console.error("Admin Login Error:", error);
      throw error;
    }
  },
  register: (userData) =>
    publicApi.post("/auth/register", {
      username: userData.username,
      password: userData.password,
      email: userData.email,
    }),
  logout: async () => {
    try {
      await privateApi.post("/auth/logout", {});
    } finally {
      localStorage.removeItem("token");
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await publicApi.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("API Forgot Password Error:", error);
      throw error;
    }
  },
  changePassword: async (data) => {
    try {
      const response = await privateApi.post("/account/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Change Password Error:", error);
      throw error;
    }
  },
};

export const userService = {
  getProfile: (userId) => privateApi.get(`/account/profile?userId=${userId}`),
  updateProfile: async (data) => {
    try {
      const response = await privateApi.patch("/account", {
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        avatarUrl: data.avatarUrl || "",
        fullName: data.fullName || "",
        id: data.id,
        email: data.email || "",
      });
      return response;
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    }
  },
  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await privateApi.post(
        "/account/avatar",
        formData,
        config
      );
      return response;
    } catch (error) {
      console.error("Update Avatar Error:", error);
      throw error;
    }
  },
  createOrder: (orderData) => privateApi.post("/order", orderData),
  createPaymentLink: async (orderId) => {
    try {
      const response = await privateApi.post(`/payment/create-payment-link/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Create Payment Link Error:", error);
      throw error;
    }
  },
  confirmPayment: async (orderCode) => {
    try {
      const response = await privateApi.post(`/payment/confirm?orderCode=${orderCode}`);
      return response.data;
    } catch (error) {
      console.error("Confirm Payment Error:", error);
      throw error;
    }
  },
  getOrders: (params) => privateApi.get("/order/my", { params }),
  getAllOrders: (params) => privateApi.get("/order", { params }),
  getOrderDetails: (orderId) => privateApi.get(`/order/${orderId}`),
  cancelOrder: (orderId) => privateApi.post(`/order/${orderId}/cancel`),
  confirmDelivery: (orderId) =>
    privateApi.post(`/order/${orderId}/confirm-delivery`),
  updateOrderStatus: (orderId, action) => {
    const formData = new FormData();
    formData.append("id", orderId);
    formData.append("action", action);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    return privateApi.put("/order", formData, config);
  },
  getUserList: (params) => privateApi.get("/account", { params }),
};

export const adminService = {
  getOrders: (params) => privateApi.get("/order", { params }),
  getOrderDetails: (orderId) => privateApi.get(`/order/${orderId}`),
  updateOrderStatus: (orderId, status) => {
    const formData = new FormData();
    formData.append("id", orderId);
    formData.append("action", status);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    return privateApi.put("/order", formData, config);
  },
};

export const productService = {
  deleteImage: (id) => {
    return axios.delete(`${API_BASE_URL}/productImage/${id}`);
  },
};

export { publicApi, privateApi };
