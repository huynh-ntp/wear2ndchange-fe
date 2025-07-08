import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MessageIcon from "@mui/icons-material/Message";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import RateReviewIcon from "@mui/icons-material/RateReview";

const menuItems = [
  { text: "Quản lý", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Đăng bán", icon: <AddCircleIcon />, path: "/admin/create-product" },
  { text: "Đơn hàng", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  { text: "Tin nhắn", icon: <MessageIcon />, path: "/admin/messages" },
  { text: "Khách hàng", icon: <PersonIcon />, path: "/admin/customers" },
  { text: "Kho hàng", icon: <StoreIcon />, path: "/admin/inventory" },
  { text: "Đánh giá", icon: <RateReviewIcon />, path: "/admin/reviews" },
  { text: "Cài đặt", icon: <SettingsIcon />, path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if at /admin
  React.useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          bgcolor: "#f8f9fb",
          p: 2,
          borderRight: "1px solid #e0e0e0",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <List>
          <ListItem>
            <Typography variant="h6" fontWeight="bold">
              Quản lý
            </Typography>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor:
                  location.pathname === item.path
                    ? "rgba(0, 0, 0, 0.04)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "inherit",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "250px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
