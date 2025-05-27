import React from "react";
import { Container, Typography } from "@mui/material";
import DashboardCards from "./DashboardCards";
import DashboardChart from "./DashboardChart";
import RecentOrders from "./RecentOrders";

const DashboardContent = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quản lý
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Xin chào, Kiệt!
      </Typography>

      <DashboardCards />
      <DashboardChart />
      <RecentOrders />
    </Container>
  );
};

export default DashboardContent;
