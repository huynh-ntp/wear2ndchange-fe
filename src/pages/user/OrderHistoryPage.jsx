import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { userService } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { reviewService } from "../../services/reviewService";
import ReviewModal from "../../components/ReviewModal";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { refreshCartCount } = useCartContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState(new Set());

  // Debug effect to track modal state
  useEffect(() => {
    console.log("Review modal state changed:", {
      reviewModalOpen,
      selectedProduct: selectedProduct?.id,
      productName: selectedProduct?.name
    });
  }, [reviewModalOpen, selectedProduct]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await userService.getOrders({
          page,
          size: 10,
          sort: "createdAt,desc",
        });
        if (response.data) {
          const ordersData = response.data.content;
          setOrders(ordersData);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
          
          // Check which received orders have been reviewed
          const reviewedOrderIds = new Set();
          for (const order of ordersData) {
            if (order.status === "RECEIVED") {
              try {
                // Get order details to check products
                const orderDetailsResponse = await userService.getOrderDetails(order.id);
                const orderDetails = orderDetailsResponse.data;
                
                if (orderDetails.items && orderDetails.items.length > 0) {
                  // Check if the first product has been reviewed (simplified approach)
                  const hasReviewed = await reviewService.checkUserHasReviewed(orderDetails.items[0].product.id);
                  if (hasReviewed) {
                    reviewedOrderIds.add(order.id);
                  }
                }
              } catch (error) {
                console.error(`Error checking review for order ${order.id}:`, error);
              }
            }
          }
          
          setReviewedOrders(reviewedOrderIds);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user, page]);

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

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await userService.updateOrderStatus(selectedOrder.id, "CANCEL");
      // Refresh orders list
      const response = await userService.getOrders({
        page,
        size: 10,
        sort: "createdAt,desc",
      });
      if (response.data) {
        setOrders(response.data.content);
      }
      setCancelDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      setLoading(true);
      await userService.updateOrderStatus(orderId, "RECEIVED");
      // Refresh orders list
      const response = await userService.getOrders({
        page,
        size: 10,
        sort: "createdAt,desc",
      });
      if (response.data) {
        setOrders(response.data.content);
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      setError("Không thể xác nhận nhận hàng");
    } finally {
      setLoading(false);
    }
  };

  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // Convert to 0-based index
  };

  const handleReviewOrder = async (order) => {
    try {
      setLoadingReview(true);
      setError(""); // Clear any previous errors
      console.log("Fetching order details for review:", order.id);
      
      // Fetch detailed order information to get the products
      const response = await userService.getOrderDetails(order.id);
      const orderDetails = response.data;
      
      console.log("Order details response:", orderDetails);
      
      if (orderDetails.items && orderDetails.items.length > 0) {
        // For simplicity, we'll review the first product in the order
        // In a real scenario, you might want to show a product selection dialog
        console.log("Setting selected product:", orderDetails.items[0].product);
        const productWithOrderId = {
          ...orderDetails.items[0].product,
          orderId: order.id // Add order ID for tracking
        };
        setSelectedProduct(productWithOrderId);
        setReviewModalOpen(true);
      } else {
        console.warn("No items found in order:", orderDetails);
        setError("Không tìm thấy sản phẩm trong đơn hàng để đánh giá");
      }
    } catch (error) {
      console.error("Error fetching order details for review:", error);
      setError("Không thể tải chi tiết đơn hàng để đánh giá");
    } finally {
      setLoadingReview(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Add the current order to reviewed orders
    if (selectedProduct && selectedProduct.orderId) {
      setReviewedOrders(prev => new Set([...prev, selectedProduct.orderId]));
    }
    
    console.log("Review submitted successfully");
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

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: "100vh", overflow: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600, color: "#4a3a2a" }}
      >
        Đơn hàng của tôi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      Chi tiết
                    </Button>
                    {order.status === "INIT" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => openCancelDialog(order)}
                      >
                        Hủy đơn
                      </Button>
                    )}
                    {order.status === "DELIVERING" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleConfirmDelivery(order.id)}
                      >
                        Xác nhận nhận hàng
                      </Button>
                    )}
                    {order.status === "RECEIVED" && !reviewedOrders.has(order.id) && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleReviewOrder(order)}
                        disabled={loadingReview}
                      >
                        {loadingReview ? <CircularProgress size={16} /> : "Đánh giá"}
                      </Button>
                    )}
                    {order.status === "RECEIVED" && reviewedOrders.has(order.id) && (
                      <Chip
                        label="Đã đánh giá"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Bạn chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {orders.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Trang trước
          </Button>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
          <Button
            variant="outlined"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
          >
            Trang sau
          </Button>
          <Typography variant="body2" color="text.secondary">
            Trang {page + 1} / {totalPages} ({totalElements} đơn hàng)
          </Typography>
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
            Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrder?.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => {
          console.log("Closing review modal");
          setReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        onReviewSubmitted={handleReviewSubmitted}
        product={selectedProduct}
      />
    </Container>
  );
};

export default OrderHistoryPage;
