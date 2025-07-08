import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Paper,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCartContext } from "../../contexts/CartContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { getImageUrl } from "../../utils/imageUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const { user } = useAuthContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductDetail(id);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotification({
          open: true,
          message: "Không thể tải thông tin sản phẩm",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id);
      setNotification({
        open: true,
        message: "Đã thêm sản phẩm vào giỏ hàng",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Không thể thêm sản phẩm vào giỏ hàng",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            bgcolor: "#f5f5f5",
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          <Grid container spacing={4}>
            {/* Left Column - Image Gallery */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                {/* Main Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: 500,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(product.images[selectedImage]?.url)}
                    alt={product.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      margin: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      p: 2,
                    }}
                  />
                </Box>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      overflowX: "auto",
                      pb: 1,
                      "&::-webkit-scrollbar": {
                        height: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#9e9e5a",
                        borderRadius: "3px",
                      },
                    }}
                  >
                    {product.images.map((image, index) => (
                      <Box
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: 100,
                          height: 100,
                          flexShrink: 0,
                          cursor: "pointer",
                          border:
                            selectedImage === index
                              ? "2px solid #9e9e5a"
                              : "2px solid transparent",
                          borderRadius: 1,
                          overflow: "hidden",
                          bgcolor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          "&:hover": {
                            borderColor: "#9e9e5a",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={getImageUrl(image.url)}
                          alt={`${product.name} - ${index + 1}`}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            margin: "auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            p: 1,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Column - Product Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "100%" }}>
                {/* Product Name */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "#333",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: "4.5em",
                  }}
                >
                  {product.name}
                </Typography>

                {/* Tags */}
                <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={`${product.percentage}`}
                    sx={{
                      bgcolor: "#f6f9d6",
                      color: "#4a4a3a",
                      fontSize: 14,
                      height: 28,
                    }}
                  />
                  <Chip
                    label={product.category}
                    sx={{
                      bgcolor: "#f6f9d6",
                      color: "#4a4a3a",
                      fontSize: 14,
                      height: 28,
                    }}
                  />
                </Box>

                {/* Price */}
                <Typography
                  variant="h4"
                  sx={{
                    color: "red",
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Product Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "#333",
                    }}
                  >
                    Thông tin sản phẩm
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Kích thước
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {product.size}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Chất liệu
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {product.material}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Add to Cart Button */}
                {product.status === "ACTIVE" ? (
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: "#9e9e5a",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#7a7a45",
                      },
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    disabled
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    Hết hàng
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;
