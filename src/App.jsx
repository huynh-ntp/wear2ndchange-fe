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
import CartProvider from "./contexts/CartContext";
import AdminPrivateRoute from "./components/PrivateRoute";
import UserPrivateRoute from "./components/UserPrivateRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// User Pages
import HomePage from "./pages/user/HomePage";
import ShopPage from "./pages/user/ShopPage";
import LoginPage from "./pages/user/LoginPage";
import MissionPage from "./pages/user/MissionPage";
import CartDisplay from "./pages/user/CartDisplay";
import CheckoutPage from "./pages/user/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import ThankYouPage from "./pages/user/ThankYouPage";
import OrderHistoryPage from "./pages/user/OrderHistoryPage";
import OrderDetailPage from "./pages/user/OrderDetailPage";
import PurchasedProductsPage from "./pages/user/PurchasedProductsPage";
import ReviewsPage from "./pages/user/ReviewsPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";
import AdminSettings from "./pages/admin/AdminSettings";
import UserProfilePage from "./pages/user/UserProfilePage";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/*"
                element={
                  <AdminPrivateRoute>
                    <AdminLayout />
                  </AdminPrivateRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:orderId" element={<AdminOrderDetail />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="create-product" element={<AdminCreateProduct />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
              {/* User Routes */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mission" element={<MissionPage />} />
                <Route
                  path="/products/:id"
                  element={<ProductDetailPage />}
                />{" "}
                <Route
                  path="/cart"
                  element={
                    <UserPrivateRoute>
                      <CartDisplay />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <UserPrivateRoute>
                      <CheckoutPage />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <UserPrivateRoute>
                      <UserProfilePage />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/thank-you"
                  element={
                    <UserPrivateRoute>
                      <ThankYouPage />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <UserPrivateRoute>
                      <OrderHistoryPage />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <UserPrivateRoute>
                      <OrderDetailPage />
                    </UserPrivateRoute>
                  }
                />
                <Route
                  path="/purchased-products"
                  element={
                    <UserPrivateRoute>
                      <PurchasedProductsPage />
                    </UserPrivateRoute>
                  }
                />
                <Route path="/reviews" element={<ReviewsPage />} />
              </Route>
              {/* 404 Page - This should be the last route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
