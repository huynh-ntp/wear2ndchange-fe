import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { productService } from "../../services/productService";
import { useCartContext } from "../../contexts/CartContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { getImageUrl } from "../../utils/imageUtils";

const CATEGORIES = [
  { value: "ALL", label: "Tất cả" },
  { value: "SHIRT", label: "Áo secondhand" },
  { value: "TROUSERS", label: "Quần secondhand" },
  { value: "DRESS", label: "Váy secondhand" },
  { value: "JACKET", label: "Áo khoác secondhand" },
];

const ITEMS_PER_PAGE = 20;

const ShopPage = () => {
  const { addToCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addingToCart, setAddingToCart] = useState(null);

  const fetchProducts = useCallback(
    async (
      category = selectedCategory,
      search = searchTerm,
      currentPage = page
    ) => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          size: ITEMS_PER_PAGE,
          sort: "createdDateTime,desc",
        };

        if (category !== "ALL") {
          params.category = category;
        }

        if (search) {
          params.name = search;
        }

        const response = await productService.getProductList(params);
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
        setNotification({
          open: true,
          message: "Không thể tải danh sách sản phẩm",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchTerm, page]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(0);
    }, 500),
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(productId);
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
    } finally {
      setAddingToCart(null);
    }
  };

  const handleViewDetail = (productId) => {
    navigate(`/products/${productId}`);
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, maxWidth: "100%", px: 2, py: 3, bgcolor: "#fff" }}>
        <Box sx={{ maxWidth: "1300px", mx: "auto", mb: 4 }}>
          {/* Search section */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ minWidth: { md: "300px" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Playfair Display",
                  color: "#9e9e5a",
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                WEAR2ND CHANCE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9e9e5a",
                  fontFamily: "Playfair Display",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                buy your clothes & second chance
              </Typography>
            </Box>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              size="small"
              onChange={handleSearchChange}
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", md: "500px" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Categories */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: 120,
                  fontSize: 14,
                },
              }}
            >
              {CATEGORIES.map((category) => (
                <Tab
                  key={category.value}
                  value={category.value}
                  label={category.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* Products Grid */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid
                container
                spacing={2}
                justifyContent="flex-start"
                sx={{
                  maxWidth: "100%",
                  mx: "auto",
                }}
              >
                {products.map((product) => (
                  <Grid
                    item
                    key={product.id}
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
                      onClick={() => handleViewDetail(product.id)}
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
                      >
                        <CardMedia
                          component="img"
                          image={getImageUrl(product.images[0]?.url)}
                          alt={product.name}
                          sx={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                        {product.status !== "ACTIVE" && (
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
                                fontSize: 18,
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
                          <Tooltip title={product.name} placement="top">
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                fontWeight: 600,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                height: "2.5em",
                                lineHeight: 1.25,
                                fontSize: "1rem",
                                cursor: "pointer",
                                width: "100%",
                                wordBreak: "break-word",
                              }}
                            >
                              {product.name}
                            </Typography>
                          </Tooltip>
                        </Box>

                        <Box sx={{ flex: "0 0 auto", mb: 0.5, width: "100%" }}>
                          <Chip
                            label={`${product.percentage}%`}
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
                          variant="h6"
                          sx={{
                            color: "red",
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: "1.1rem",
                            flex: "0 0 auto",
                            width: "100%",
                          }}
                        >
                          {formatPrice(product.price)}
                        </Typography>

                        {product.status === "ACTIVE" && (
                          <Box sx={{ width: "100%", mt: "auto" }}>
                            <Button
                              variant="contained"
                              startIcon={<ShoppingCartIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product.id);
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

              {/* Pagination */}
              {totalPages > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "1rem",
                        minWidth: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        "&.Mui-selected": {
                          backgroundColor: "#9e9e5a",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#7a7a45",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

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

export default ShopPage;
