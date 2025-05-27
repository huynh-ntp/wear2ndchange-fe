import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance with mixed content handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Prevent mixed content warnings and handle HTTP in production
  transformRequest: [
    (data, headers) => {
      // Log request details in development
      if (process.env.NODE_ENV === "development") {
        console.log("API Request:", { url: API_BASE_URL, headers, data });
      }
      return JSON.stringify(data);
    },
  ],
  // Additional security headers
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for network errors and mixed content
    if (error.message === "Network Error") {
      console.error("Network Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        protocol: window.location.protocol,
        host: window.location.host,
      });

      // Check if this might be a mixed content issue
      if (
        window.location.protocol === "https:" &&
        API_BASE_URL.startsWith("http:")
      ) {
        console.error("Possible mixed content issue - attempting to use HTTPS");
        // Retry the request with HTTPS
        error.config.baseURL = API_BASE_URL.replace("http:", "https:");
        return api(error.config);
      }

      // You might want to show a user-friendly message here
      // or handle the error in a specific way
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
        return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
          api(error.config)
        );
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      return response;
    } catch (error) {
      console.error("API Login Error:", error);
      throw error;
    }
  },
  adminLogin: async (credentials) => {
    try {
      const response = await api.post("/auth/admin/login", {
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
    api.post("/auth/register", {
      username: userData.username,
      password: userData.password,
      email: userData.email,
    }),
  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } finally {
      localStorage.removeItem("token");
    }
  },
};

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
};

export const productService = {
  getProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api;
