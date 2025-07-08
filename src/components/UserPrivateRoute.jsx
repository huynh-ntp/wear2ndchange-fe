import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const UserPrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Wait while checking authentication
  if (loading) {
    return null; // or a loading spinner
  }

  if (!user) {
    // Save the current location user tried to access
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default UserPrivateRoute;
