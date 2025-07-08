import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { privateApi } from "../../services/api";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await privateApi.get("/order", {
        params: {
          page: 0,
          size: 5,
          sort: "createdAt,desc",
        },
      });

      if (response && response.data) {
        setOrders(response.data.content);
      } else {
        setError("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching recent orders:", err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "INIT":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "DELIVERING":
        return "info";
      case "RECEIVED":
        return "success";
      case "CANCEL":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
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

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Đơn gần đây
        </Typography>
        <Typography>Đang tải...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Đơn gần đây
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Đơn gần đây
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      alt={order.receiver || "User"}
                      src={order.user?.avatar}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography>{order.receiver || "Khách hàng"}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>
                  {order.totalAmount?.toLocaleString("vi-VN")}đ
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentOrders;
