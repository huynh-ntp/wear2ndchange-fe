import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  // Wait while checking authentication
  if (loading) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  // Check if user is admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminPrivateRoute;
