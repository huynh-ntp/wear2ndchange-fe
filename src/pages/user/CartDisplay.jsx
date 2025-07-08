import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Grid,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  Button,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { cartService } from "../../services/cartService";
import { useCartContext } from "../../contexts/CartContext";
import { getImageUrl } from "../../utils/imageUtils";

const CartDisplay = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { fetchCartCount } = useCartContext();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      setDeletingItem(itemId);
      await cartService.removeFromCart(itemId);
      await fetchCartItems();
      await fetchCartCount();
      // Remove from selected items if it was selected
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeletingItem(null);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      // Chỉ chọn các sản phẩm còn hàng
      const availableItems = cartItems
        .filter((item) => item.product.status !== "SOLD_OUT")
        .map((item) => item.id);
      setSelectedItems(availableItems);
    }
    setSelectAll(!selectAll);
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.product.price, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      SHIRT: "Áo secondhand",
      TROUSERS: "Quần secondhand",
      DRESS: "Váy secondhand",
      JACKET: "Áo khoác secondhand",
    };
    return categoryMap[category] || category;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={2} height="100vh">
      <Paper
        sx={{
          backgroundColor: "#fcd79a",
          p: 1.5,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Giỏ hàng
        <i className="fas fa-shopping-cart" style={{ marginLeft: 8 }}></i> (
        {cartItems.length})
      </Paper>

      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {cartItems.map((item) => (
          <Paper
            key={item.id}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              "&:hover": {
                boxShadow: 2,
              },
            }}
            elevation={1}
          >
            <Checkbox
              size="small"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleSelectItem(item.id)}
              disabled={item.product.status === "SOLD_OUT"}
            />
            <Avatar
              variant="rounded"
              src={getImageUrl(item.product.images[0]?.url)}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#f5f5f5",
                "& img": {
                  objectFit: "contain",
                },
              }}
            />
            <Box flex={1} ml={1}>
              <Typography variant="body2" fontWeight={500}>
                {item.product.name}
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  {getCategoryLabel(item.product.category)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  Size: {item.product.size}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  {item.product.material}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  {item.product.percentage}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color={
                  item.product.status === "SOLD_OUT"
                    ? "text.secondary"
                    : "error"
                }
                fontWeight="600"
                sx={{ mt: 1 }}
              >
                {formatPrice(item.product.price)}
                {item.product.status === "SOLD_OUT" && " (Hết hàng)"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleDeleteItem(item.id)}
                disabled={deletingItem === item.id}
                sx={{
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "white",
                  },
                }}
              >
                {deletingItem === item.id ? (
                  <CircularProgress size={20} />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 1.5, mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          }
          label={
            <Typography variant="caption" fontWeight={600}>
              Chọn tất cả
            </Typography>
          }
        />
        <Typography variant="body2" fontWeight={700} mt={1}>
          Tổng thanh toán: {formatPrice(calculateTotal())}
        </Typography>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate("/checkout", { state: { selectedItems } })}
        disabled={selectedItems.length === 0}
        sx={{
          mt: 2,
          py: 1.5,
          background: "linear-gradient(to bottom, #d94a4a, #b93a3a)",
          color: "white",
          fontWeight: 600,
          fontFamily: "serif",
          fontSize: 18,
          borderRadius: 2,
          userSelect: "none",
          marginBottom: 10,
        }}
      >
        ĐẶT HÀNG
      </Button>
    </Box>
  );
};

export default CartDisplay;
