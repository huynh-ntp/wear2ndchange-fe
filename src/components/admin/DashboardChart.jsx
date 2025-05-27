import React from "react";
import { Box, Typography, Select, MenuItem, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Hai", total: 3000 },
  { name: "Ba", total: 6000 },
  { name: "Tư", total: 2500 },
  { name: "Năm", total: 6500 },
  { name: "Sáu", total: 4000 },
  { name: "Bảy", total: 7000 },
  { name: "CN", total: 5500 },
];

const DashboardChart = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          Tổng doanh thu
        </Typography>
        <Select size="small" defaultValue="7 ngày">
          <MenuItem value="7 ngày">7 ngày</MenuItem>
          <MenuItem value="30 ngày">30 ngày</MenuItem>
        </Select>
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="total" fill="#90caf9" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DashboardChart;
