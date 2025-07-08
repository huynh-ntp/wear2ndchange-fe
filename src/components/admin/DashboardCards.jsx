import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { privateApi } from "../../services/api";

const DashboardCards = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveringOrders, setDeliveringOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotalRevenue = async () => {
    try {
      const response = await privateApi.get("/stats/total-amount-orders");
      setTotalRevenue(response.data.totalAmount);
    } catch (err) {
      console.error("Error fetching total revenue:", err);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await privateApi.get("/stats/total-order");
      setTotalOrders(response.data.totalOrder);
    } catch (err) {
      console.error("Error fetching total orders:", err);
    }
  };

  const fetchDeliveringOrders = async () => {
    try {
      const response = await privateApi.get("/stats/total-orders-delivering");
      setDeliveringOrders(response.data["total-order"]);
    } catch (err) {
      console.error("Error fetching delivering orders:", err);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await privateApi.get("/stats/total-user");
      setTotalUsers(response.data.totalUser);
    } catch (err) {
      console.error("Error fetching total users:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchTotalRevenue(),
          fetchTotalOrders(),
          fetchDeliveringOrders(),
          fetchTotalUsers(),
        ]);
      } catch (err) {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Tổng doanh thu</Typography>
          <Typography variant="h6" fontWeight="bold">
            {loading
              ? "Đang tải..."
              : error
              ? error
              : `${totalRevenue.toLocaleString("vi-VN")}đ`}
          </Typography>
          {/* <Typography color="green">↑12% so với tháng trước</Typography> */}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Tổng đơn hàng</Typography>
          <Typography variant="h6" fontWeight="bold">
            {loading
              ? "Đang tải..."
              : error
              ? error
              : totalOrders.toLocaleString("vi-VN")}
          </Typography>
          {/* <Typography color="green">↑8% so với tháng trước</Typography> */}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Đơn đang giao</Typography>
          <Typography variant="h6" fontWeight="bold">
            {loading
              ? "Đang tải..."
              : error
              ? error
              : deliveringOrders.toLocaleString("vi-VN")}
          </Typography>
          {/* <Typography color="green">432 đơn</Typography> */}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Tổng khách hàng</Typography>
          <Typography variant="h6" fontWeight="bold">
            {loading
              ? "Đang tải..."
              : error
              ? error
              : totalUsers.toLocaleString("vi-VN")}
          </Typography>
        </Paper>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Đánh giá</Typography>
          <Typography variant="h6" fontWeight="bold">
            4.8/5.0
          </Typography>
          <Typography>Tổng: 2.4k reviews</Typography>
        </Paper>
      </Grid> */}
    </Grid>
  );
};

export default DashboardCards;
