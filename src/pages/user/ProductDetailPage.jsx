import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Container,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { productService } from "../../services/productService";
import { useCartContext } from "../../contexts/CartContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import ReviewSection from "../../components/ReviewSection";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
      const mainImageIndex = response.data.images.findIndex(
        (img) => img.isMainImage
      );
      if (mainImageIndex !== -1) {
        setSelectedImage(mainImageIndex);
      }
      // Fetch similar products after getting product details
      if (response.data.category) {
        fetchSimilarProducts(response.data.category);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (category) => {
    try {
      setLoadingSimilar(true);
      const response = await productService.getProductList({
        category: category,
        size: 4,
        sort: "createdDateTime,desc",
      });
      // Filter out current product and get up to 4 similar products
      const filteredProducts = response.data.content
        .filter((p) => p.id !== parseInt(id))
        .slice(0, 4);
      setSimilarProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const success = await addToCart(productId);
      if (success) {
        setNotification({
          open: true,
          message: "Đã thêm sản phẩm vào giỏ hàng",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({
        open: true,
        message: "Không thể thêm sản phẩm vào giỏ hàng",
        severity: "error",
      });
    }
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 2, md: 3 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        <Grid container spacing={3}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "sticky",
                top: 20,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 1,
                }}
              >
                <Box
                  component="img"
                  src={getImageUrl(product.images[selectedImage]?.url)}
                  alt={product.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    p: 1,
                  }}
                />
              </Box>

              {product.images?.length > 1 && (
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
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? "2px solid #9e9e5a"
                            : "2px solid transparent",
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          p: 0.5,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "sticky",
                top: 20,
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    mb: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {product.name}
                </Typography>
                <Chip
                  label={getCategoryLabel(product.category)}
                  sx={{
                    bgcolor: "#f6f9d6",
                    color: "#4a4a3a",
                    fontSize: 14,
                    height: 28,
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                color="error"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {formatPrice(product.price)}
              </Typography>

              <Grid container spacing={2}>
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
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Tình trạng
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {product.percentage}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                {product.status === "ACTIVE" ? (
                  user ? (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(id)}
                      fullWidth
                      size="large"
                      sx={{
                        bgcolor: "#9e9e5a",
                        py: 1.5,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#7a7a45",
                        },
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => navigate("/login")}
                      fullWidth
                      size="large"
                      sx={{
                        bgcolor: "#9e9e5a",
                        py: 1.5,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#7a7a45",
                        },
                      }}
                    >
                      Đăng nhập để mua
                    </Button>
                  )
                ) : (
                  <Typography
                    sx={{
                      color: "error.main",
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      textAlign: "center",
                    }}
                  >
                    HẾT HÀNG
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Sản phẩm tương tự
          </Typography>
          <Grid container spacing={2}>
            {similarProducts.map((similarProduct) => (
              <Grid
                item
                key={similarProduct.id}
                xs={6}
                sm={4}
                md={2.4}
                sx={{
                  width: { xs: "50%", sm: "33.33%", md: "20%" },
                  flexBasis: { xs: "50%", sm: "33.33%", md: "20%" },
                  maxWidth: { xs: "50%", sm: "33.33%", md: "20%" },
                  px: 1,
                  flexGrow: 0,
                  flexShrink: 0,
                  flex: { md: "0 0 20%" },
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f5f5f5",
                    }}
                    onClick={() => navigate(`/products/${similarProduct.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(similarProduct.images[0]?.url)}
                      alt={similarProduct.name}
                      sx={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                    {similarProduct.status !== "ACTIVE" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          HẾT HÀNG
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      flex: "1 1 auto",
                      display: "flex",
                      flexDirection: "column",
                      p: 1.5,
                      height: "calc(100% - 200px)",
                      minHeight: 200,
                      overflow: "hidden",
                      width: "100%",
                      gap: 0.5,
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      sx={{
                        flex: "0 0 auto",
                        mb: 0.5,
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          height: "2.5em",
                          lineHeight: 1.25,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/products/${similarProduct.id}`)
                        }
                      >
                        {similarProduct.name}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: "0 0 auto", mb: 0.5, width: "100%" }}>
                      <Chip
                        label={`${similarProduct.percentage}%`}
                        size="small"
                        sx={{
                          bgcolor: "#f6f9d6",
                          color: "#4a4a3a",
                          fontSize: 12,
                          height: 24,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {formatPrice(similarProduct.price)}
                    </Typography>

                    {similarProduct.status === "ACTIVE" && user && (
                      <Box sx={{ width: "100%", mt: "auto" }}>
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(similarProduct.id);
                          }}
                          fullWidth
                          size="small"
                          sx={{
                            bgcolor: "#9e9e5a",
                            flex: "0 0 auto",
                            minWidth: 0,
                            width: "100%",
                            "&:hover": {
                              bgcolor: "#7a7a45",
                            },
                          }}
                        >
                          Thêm vào giỏ
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Review Section */}
      <ReviewSection productId={id} />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailPage;
