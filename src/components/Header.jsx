import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#4a3a2a",
          color: "#f0f0d6",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            mx: "auto",
            width: "100%",
            justifyContent: "space-between",
            px: { xs: 2, md: 6 },
            py: 1.5,
            fontSize: { xs: "0.875rem", md: "1rem" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              userSelect: "none",
              mb: { xs: 1, md: 0 },
            }}
          >
            Chào bạn xinh, sắm đồ xịn nhé!
          </Typography>

          <Box
            sx={{
              display: { xs: "flex", md: "flex" },
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, md: 3 },
              fontFamily: "'Roboto Slab', serif",
              width: { xs: "100%", md: "auto" },
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            {[
              { label: "Trang chủ", path: "/" },
              { label: "Cửa hàng", path: "/shop" },
              { label: "Đăng nhập/Đăng ký", path: "/login" },
              { label: "Kênh người bán", path: "/seller" },
            ].map((item, index) => (
              <MuiLink
                key={index}
                onClick={() => handleNavigation(item.path)} // Handle click for navigation
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "pointer",
                  width: { xs: "100%", md: "auto" },
                  py: { xs: 0.5, md: 0 },
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
