import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { userService } from "../../services/api";
import { reviewService } from "../../services/reviewService";
import ReviewModal from "../../components/ReviewModal";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await userService.getOrderDetails(id);
        const orderData = response.data;
        setOrderDetails(orderData);
        
        // Check which products have been reviewed if order is received
        if (orderData.status === "RECEIVED" && orderData.items) {
          const reviewedProductIds = new Set();
          
          // Check each product for existing reviews
          for (const item of orderData.items) {
            try {
              const hasReviewed = await reviewService.checkUserHasReviewed(item.product.id);
              if (hasReviewed) {
                reviewedProductIds.add(item.product.id);
              }
            } catch (error) {
              console.error(`Error checking review for product ${item.product.id}:`, error);
            }
          }
          
          setReviewedProducts(reviewedProductIds);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "INIT":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "DELIVERING":
        return "primary";
      case "RECEIVED":
        return "success";
      case "CANCEL":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "INIT":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "DELIVERING":
        return "Đang giao hàng";
      case "RECEIVED":
        return "Đã nhận hàng";
      case "CANCEL":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderDetails) return;

    try {
      setCancellingOrder(true);
      await userService.cancelOrderByPut(orderDetails.id);
      // Refresh order details after successful cancellation
      const response = await userService.getOrderDetails(orderDetails.id);
      setOrderDetails(response.data);
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Không thể hủy đơn hàng");
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleReviewProduct = (product) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Add the reviewed product to the set
    if (selectedProduct) {
      setReviewedProducts(prev => new Set([...prev, selectedProduct.id]));
    }
    
    // Close the modal
    setReviewModalOpen(false);
    setSelectedProduct(null);
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

  if (!orderDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Không tìm thấy chi tiết đơn hàng.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600, color: "#4a3a2a" }}
      >
        Chi tiết đơn hàng #{orderDetails.id}
      </Typography>
      <Paper sx={{ p: 3, bgcolor: "#f8f9fa", mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Thông tin chung
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body1">
            <Typography component="span" variant="body2" color="text.secondary">
              Ngày đặt:
            </Typography>{" "}
            {formatDate(orderDetails.createdAt)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography component="span" variant="body2" color="text.secondary">
              Trạng thái:
            </Typography>
            <Chip
              label={getStatusText(orderDetails.status)}
              color={getStatusColor(orderDetails.status)}
              size="small"
            />
          </Box>
          <Typography variant="body1">
            <Typography component="span" variant="body2" color="text.secondary">
              Họ tên:
            </Typography>{" "}
            {orderDetails.receiver}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" variant="body2" color="text.secondary">
              Số điện thoại:
            </Typography>{" "}
            {orderDetails.phoneNumber}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" variant="body2" color="text.secondary">
              Địa chỉ:
            </Typography>{" "}
            {orderDetails.address}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" variant="body2" color="text.secondary">
              Email:
            </Typography>{" "}
            {orderDetails.email}
          </Typography>
          {orderDetails.note && (
            <Typography variant="body1">
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Ghi chú:
              </Typography>{" "}
              {orderDetails.note}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Tổng tiền: {formatPrice(orderDetails.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: "#f8f9fa" }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Sản phẩm
        </Typography>
        <Box>
          {orderDetails.items.map((item, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={item.product.images[0]?.url}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "#f5f5f5",
                    "& img": {
                      objectFit: "contain",
                    },
                  }}
                />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {item.product.size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chất liệu: {item.product.material}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Độ mới: {item.product.percentage}
                  </Typography>
                  <Typography variant="body2" color="error" fontWeight={600}>
                    {formatPrice(item.product.price)}
                  </Typography>
                </Box>
                {orderDetails.status === "RECEIVED" && !reviewedProducts.has(item.product.id) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleReviewProduct(item.product)}
                    sx={{ minWidth: "100px" }}
                  >
                    Đánh giá
                  </Button>
                )}
                {orderDetails.status === "RECEIVED" && reviewedProducts.has(item.product.id) && (
                  <Chip
                    label="Đã đánh giá"
                    color="success"
                    size="small"
                    sx={{ minWidth: "100px" }}
                  />
                )}
              </Box>
              {index < orderDetails.items.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Paper>
      {orderDetails.status === "INIT" && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelClick}
            disabled={cancellingOrder}
          >
            {cancellingOrder ? <CircularProgress size={24} /> : "Hủy đơn hàng"}
          </Button>
        </Box>
      )}

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy đơn hàng #{orderDetails?.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancellingOrder}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={cancellingOrder}
          >
            {cancellingOrder ? <CircularProgress size={24} /> : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </Container>
  );
};

export default OrderDetailPage;
