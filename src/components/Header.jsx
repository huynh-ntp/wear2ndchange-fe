import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAuthAction = async () => {
    if (user) {
      try {
        setIsLoading(true);
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#4a3a2a",
          color: "#f0f0d6",
          boxShadow: "none",
          width: "100%",
        }}
      >
        {" "}
        <Toolbar
          sx={{
            maxWidth: "lg",
            mx: "auto",
            width: "100%",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: 1.5,
            fontSize: { xs: "0.875rem", md: "1rem" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            overflow: "hidden",
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
            {user
              ? `Xin chào, ${user.username}!`
              : "Chào bạn xinh, sắm đồ xịn nhé!"}
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
              { label: "Kênh người bán", path: "/seller" },
            ].map((item, index) => (
              <MuiLink
                key={index}
                onClick={() => handleNavigation(item.path)}
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

            <MuiLink
              onClick={handleAuthAction}
              underline="hover"
              color="inherit"
              sx={{
                cursor: "pointer",
                width: { xs: "100%", md: "auto" },
                py: { xs: 0.5, md: 0 },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : user ? (
                "Đăng xuất"
              ) : (
                "Đăng nhập/Đăng ký"
              )}
            </MuiLink>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
