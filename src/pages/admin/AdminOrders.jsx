import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Box,
  Chip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/api";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrders({
        page,
        size: 10,
        sort: "createdAt,desc",
      });
      if (response.data) {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Không thể tải danh sách đơn hàng");
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

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleApproveOrder = async (orderId) => {
    try {
      setLoading(true);
      await adminService.updateOrderStatus(orderId, "DELIVERING");
      fetchOrders();
    } catch (error) {
      console.error("Error approving order:", error);
      setError("Không thể xác nhận đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await adminService.updateOrderStatus(selectedOrder.id, "CANCEL");
      fetchOrders();
      setCancelDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
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
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý đơn hàng
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
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
                <TableCell>{order.receiver}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
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
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleApproveOrder(order.id)}
                        >
                          Xác nhận
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => openCancelDialog(order)}
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có đơn hàng nào
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
    </Paper>
  );
};

export default AdminOrders;
