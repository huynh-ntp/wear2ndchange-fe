import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const DashboardCards = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Tổng doanh thu</Typography>
          <Typography variant="h6" fontWeight="bold">
            9.000.000 vnd
          </Typography>
          <Typography color="green">↑12% so với tháng trước</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Tổng đơn hàng</Typography>
          <Typography variant="h6" fontWeight="bold">
            1,240
          </Typography>
          <Typography color="green">↑8% so với tháng trước</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Đơn đang giao</Typography>
          <Typography variant="h6" fontWeight="bold">
            456
          </Typography>
          <Typography color="green">432 đơn</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Đánh giá</Typography>
          <Typography variant="h6" fontWeight="bold">
            4.8/5.0
          </Typography>
          <Typography>Tổng: 2.4k reviews</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCards;
