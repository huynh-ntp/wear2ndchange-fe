import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  CircularProgress,
  Badge,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useCartContext } from "../contexts/CartContext";
import { userService } from "../services/api";
import { getImageUrl } from "../utils/imageUtils";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { cartCount } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const response = await userService.getProfile(user.id);
          if (response.data) {
            setUserProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
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
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: "100%",
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
            "Chào bạn xinh, sắm đồ xịn nhé!"
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
            {" "}
            {[
              { label: "Trang chủ", path: "/" },
              { label: "Cửa hàng", path: "/shop" },
              { label: "Đánh giá", path: "/reviews" },
              { label: "Sứ mệnh", path: "/mission" },
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
            ))}{" "}
            {/* Shopping Cart Badge - Only show for logged in users */}
            {user && (
              <IconButton
                color="inherit"
                onClick={() => handleNavigation("/cart")}
                sx={{ ml: { xs: 0, md: 1 } }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            {user ? (
              <Box sx={{ flexGrow: 0, ml: { xs: 0, md: 1 } }}>
                <Tooltip title="Tài khoản">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.username}
                      src={getImageUrl(userProfile?.avatarUrl)}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#f5cc9b",
                        color: "#4a3a2a",
                        fontSize: "1rem",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    <Typography textAlign="center">
                      Tài khoản của tôi
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/orders")}>
                    <Typography textAlign="center">Đơn hàng của tôi</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/purchased-products")}>
                    <Typography textAlign="center">Sản phẩm đã mua</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleAuthAction} disabled={isLoading}>
                    {isLoading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Typography textAlign="center">Đăng xuất</Typography>
                    )}
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <MuiLink
                onClick={handleAuthAction}
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "pointer",
                  width: { xs: "100%", md: "auto" },
                  py: { xs: 0.5, md: 0 },
                  ml: { xs: 0, md: 1 },
                }}
              >
                Đăng nhập/Đăng ký
              </MuiLink>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
