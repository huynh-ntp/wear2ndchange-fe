import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// User Pages
import HomePage from "./pages/user/HomePage";
import ShopPage from "./pages/user/ShopPage";
import LoginPage from "./pages/user/LoginPage";
import SellerPage from "./pages/user/SellerPage";
import ProductDetail from "./pages/user/ProductDetail";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}{" "}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="create-product" element={<AdminCreateProduct />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            {/* User Routes */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/seller" element={<SellerPage />} />
              <Route path="/productDetail" element={<ProductDetail />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
