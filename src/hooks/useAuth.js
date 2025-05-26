import { useState, useEffect, useCallback } from "react";
import { authService, userService } from "../services/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const { token, username, role } = response.data;
      localStorage.setItem("token", token);
      setUser({ username, role });
      return response.data;
    } catch (err) {
      console.error("Login error in useAuth:", err);
      // Always throw an error with a message
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.message) {
        throw new Error(err.message);
      } else {
        throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Even if the logout API fails, we should still clear the local state
      localStorage.removeItem("token");
      setUser(null);
      setError(err.response?.data?.message || "Logout failed");
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      // Get user profile to verify token and get user data
      const { data } = await userService.getProfile();
      if (data) {
        const { username, role } = data;
        setUser({ username, role });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      if (err.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        setUser(null);
      }
      setError(err.response?.data?.message || "Authentication check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };
};

export default useAuth;
