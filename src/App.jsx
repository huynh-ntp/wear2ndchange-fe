import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import SellerPage from "./pages/SellerPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          {" "}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/seller" element={<SellerPage />} />
            <Route path="/productDetail" element={<ProductDetail />} />
            <Route path="/admin" element={<AdminLoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
