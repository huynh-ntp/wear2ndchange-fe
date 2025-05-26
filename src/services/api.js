import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ensure we don't redirect on login page failures
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
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
