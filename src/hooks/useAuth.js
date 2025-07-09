import { useState, useEffect, useCallback } from "react";
import { authService, userService } from "../services/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to restore auth state from localStorage
  const restoreAuthState = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        // Set user directly from localStorage without API call
        setUser(userData);
      }
    } catch (err) {
      console.error("Error restoring auth state:", err);
      // Clear potentially invalid auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore auth state when app loads
  useEffect(() => {
    restoreAuthState();
  }, [restoreAuthState]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const { token, username, role, userId } = response.data;

      // Save both token and user data
      localStorage.setItem("token", token);
      const userData = { username, role, id: userId };
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return response.data;
    } catch (err) {
      console.error("Login error in useAuth:", err);
      // Always throw an error with a message
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.message) {
        throw new Error(err.message);
      } else {
        throw new Error("Đã xảy ra lỗi khi đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    try {
      // Gọi API logout trước khi xóa token local
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local state, even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};

export default useAuth;
