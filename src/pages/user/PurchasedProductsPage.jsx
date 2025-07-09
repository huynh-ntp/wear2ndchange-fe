import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Paper,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useAuthContext } from "../../contexts/AuthContext";
import { userService } from "../../services/api";
import { reviewService } from "../../services/reviewService";
import { getImageUrl } from "../../utils/imageUtils";

const PurchasedProductsPage = () => {
  const { user } = useAuthContext();
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user?.id) {
      fetchPurchasedProducts();
    }
  }, [user, page]);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      // Lấy danh sách đơn hàng đã nhận (RECEIVED)
      const response = await userService.getOrders({
        page,
        size: 10,
        sort: "createdAt,desc",
      });

      if (response.data) {
        // Lọc ra các đơn hàng đã nhận và trích xuất sản phẩm
        const receivedOrders = response.data.content.filter(
          (order) => order.status === "RECEIVED"
        );

        // Trích xuất tất cả sản phẩm từ các đơn hàng đã nhận
        const products = [];
        for (const order of receivedOrders) {
          for (const item of order.items) {
            // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
            let hasReviewed = false;
            try {
              const reviewCheck = await reviewService.checkUserHasReviewed(
                item.product.id,
                order.id
              );
              hasReviewed = reviewCheck.hasReviewed || false;
            } catch (error) {
              console.error("Error checking review status:", error);
              hasReviewed = false;
            }

            products.push({
              ...item.product,
              orderId: order.id,
              orderDate: order.createdAt,
              purchaseDate: order.updatedAt || order.createdAt,
              hasReviewed: hasReviewed,
            });
          }
        }

        setPurchasedProducts(products);
        setTotalPages(response.data.totalPages);
        setTotalElements(products.length);
      }
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setError("Không thể tải danh sách sản phẩm đã mua");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || rating === 0) {
      setNotification({
        open: true,
        message: "Vui lòng chọn số sao đánh giá",
        severity: "error",
      });
      return;
    }

    try {
      setSubmittingReview(true);

      // Gọi API để gửi đánh giá
      await reviewService.createReview({
        productId: selectedProduct.id,
        orderId: selectedProduct.orderId,
        rating: rating,
        comment: comment,
        userId: user.id,
      });

      setNotification({
        open: true,
        message: "Đánh giá của bạn đã được gửi thành công!",
        severity: "success",
      });

      setReviewDialogOpen(false);
      setSelectedProduct(null);

      // Refresh danh sách sản phẩm
      fetchPurchasedProducts();
    } catch (error) {
      console.error("Error submitting review:", error);
      setNotification({
        open: true,
        message: "Không thể gửi đánh giá. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedProduct(null);
    setRating(0);
    setComment("");
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "";
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "#4a3a2a",
          mb: 3,
          textAlign: "center",
        }}
      >
        Sản phẩm đã mua
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 4,
          textAlign: "center",
        }}
      >
        Đánh giá sản phẩm để giúp chúng tôi cải thiện dịch vụ
      </Typography>

      {purchasedProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bạn chưa có sản phẩm nào để đánh giá
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy mua sản phẩm và nhận hàng để có thể đánh giá
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {purchasedProducts.map((product, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${product.id}-${product.orderId}`}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(product.images[0]?.url)}
                      alt={product.name}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        p: 1,
                      }}
                    />
                    {product.hasReviewed && (
                      <Chip
                        label="Đã đánh giá"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: "1rem",
                        lineHeight: 1.3,
                        height: "2.6em",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Chip
                      label={getCategoryLabel(product.category)}
                      size="small"
                      sx={{
                        bgcolor: "#f6f9d6",
                        color: "#4a4a3a",
                        mb: 1,
                        alignSelf: "flex-start",
                      }}
                    />

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Size: {product.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chất liệu: {product.material}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tình trạng: {product.percentage}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      color="error"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {formatPrice(product.price)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Mua ngày: {formatDate(product.purchaseDate)}
                    </Typography>

                    <Box sx={{ mt: "auto" }}>
                      {product.hasReviewed ? (
                        <Button
                          variant="outlined"
                          color="success"
                          fullWidth
                          disabled
                          startIcon={<StarIcon />}
                        >
                          Đã đánh giá
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<RateReviewIcon />}
                          onClick={() => handleReviewClick(product)}
                          sx={{
                            bgcolor: "#9e9e5a",
                            "&:hover": {
                              bgcolor: "#7a7a45",
                            },
                          }}
                        >
                          Đánh giá sản phẩm
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
                gap: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                Trang {page + 1} / {totalPages} ({totalElements} sản phẩm)
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Đánh giá sản phẩm
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={getImageUrl(selectedProduct.images[0]?.url)}
                  alt={selectedProduct.name}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedProduct.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryLabel(selectedProduct.category)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Chọn số sao đánh giá:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating > 0 && `${rating} sao`}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nhận xét của bạn (không bắt buộc)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseReviewDialog} disabled={submittingReview}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={submittingReview || rating === 0}
            sx={{
              bgcolor: "#9e9e5a",
              "&:hover": {
                bgcolor: "#7a7a45",
              },
            }}
          >
            {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
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
    </Container>
  );
};

export default PurchasedProductsPage;
