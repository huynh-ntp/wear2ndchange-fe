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
      // Always clear local storage and state first
      localStorage.removeItem("token");
      setUser(null);
      // Then try to call the logout API
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
      // Error from the API doesn't matter as we've already cleared local state
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
        return false;
      }

      const response = await authService.checkAuth();
      const { username, role } = response.data;
      setUser({ username, role });
      return true;
    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("token");
      setUser(null);
      return false;
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
