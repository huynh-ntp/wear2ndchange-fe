import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { privateApi } from "../../services/api";

const ChartCard = ({ title, data, children }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        {children}
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip
            formatter={(value) => [
              `${value.toLocaleString("vi-VN")}đ`,
              "Doanh thu",
            ]}
          />
          <Bar dataKey="total" fill="#90caf9" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const DashboardChart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [weeklyData, setWeeklyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate years for selection (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const fetchWeeklyData = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await privateApi.get("/stats/order-periodic", {
        params: { date },
      });

      const formattedData = response.data.map((item) => ({
        name: new Date(item.key).toLocaleDateString("vi-VN", {
          weekday: "short",
        }),
        total: item.value,
      }));

      setWeeklyData(formattedData);
    } catch (err) {
      console.error("Error fetching weekly data:", err);
      setError("Không thể tải dữ liệu doanh thu theo ngày");
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyData = async (year) => {
    try {
      setLoading(true);
      setError(null);
      const response = await privateApi.get("/stats/order-periodic", {
        params: { year },
      });

      const formattedData = response.data.map((item) => ({
        name: `T${item.key}`,
        total: item.value,
      }));

      setYearlyData(formattedData);
    } catch (err) {
      console.error("Error fetching yearly data:", err);
      setError("Không thể tải dữ liệu doanh thu theo tháng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchYearlyData(selectedYear);
  }, [selectedYear]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <ChartCard title="Doanh thu 7 ngày gần nhất" data={weeklyData}>
        <TextField
          type="date"
          size="small"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ minWidth: 150 }}
        />
      </ChartCard>

      <ChartCard title="Doanh thu theo tháng" data={yearlyData}>
        <TextField
          select
          size="small"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              Năm {year}
            </MenuItem>
          ))}
        </TextField>
      </ChartCard>
    </Box>
  );
};

export default DashboardChart;
