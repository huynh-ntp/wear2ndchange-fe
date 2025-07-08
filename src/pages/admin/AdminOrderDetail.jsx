import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

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

  const handleApproveOrder = async () => {
    try {
      setLoading(true);
      await adminService.updateOrderStatus(orderId, "DELIVERING");
      fetchOrderDetails();
    } catch (error) {
      console.error("Error approving order:", error);
      setError("Không thể xác nhận đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      await adminService.updateOrderStatus(orderId, "CANCEL");
      fetchOrderDetails();
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
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

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Không tìm thấy thông tin đơn hàng</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Chi tiết đơn hàng #{order.id}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/admin/orders")}>
            Quay lại
          </Button>
          {order.status === "INIT" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleApproveOrder}
              >
                Xác nhận đơn hàng
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
              >
                Hủy đơn hàng
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">Thông tin đơn hàng</Typography>
              <Chip
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin đơn hàng
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng
                  </Typography>
                  <Typography variant="body1">#{order.id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tiền
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Họ tên
                  </Typography>
                  <Typography variant="body1">{order.receiver}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{order.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1">{order.phoneNumber}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Địa chỉ
                  </Typography>
                  <Typography variant="body1">{order.address}</Typography>
                </Box>
                {order.note && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body1">{order.note}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm đã đặt
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {order.items.map((item) => (
                <Card key={item.product.id}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        position: "relative",
                        bgcolor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(item.product.images[0]?.url)}
                        alt={item.product.name}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "auto",
                          height: "auto",
                          maxWidth: "90%",
                          maxHeight: "90%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <CardContent
                      sx={{ flex: 1, display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Size: {item.product.size}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Chất liệu: {item.product.material}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tình trạng: {item.product.percentage}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          minWidth: "120px",
                          textAlign: "right",
                        }}
                      >
                        {formatPrice(item.product.price)}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy đơn hàng #{order.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrderDetail;
