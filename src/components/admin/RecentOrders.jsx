import React from "react";
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

const orders = [
  {
    id: 235,
    name: "Bùi Thanh Bảo",
    product: "Áo Khoác cổ điển",
    price: "200.000 vnd",
    status: "Đã nhận",
    avatar: "",
  },
  {
    id: 267,
    name: "Lê Hoàng Trung",
    product: "Dây da",
    price: "300.000 vnd",
    status: "Đang giao",
    avatar: "",
  },
  {
    id: 742,
    name: "Trần Thị Lan",
    product: "Áo len",
    price: "150.000 vnd",
    status: "Đã giao",
    avatar: "",
  },
];

const RecentOrders = () => {
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
              <TableCell>Sản phẩm</TableCell>
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
                      alt={order.name}
                      src={order.avatar}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography>{order.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Đã nhận"
                        ? "success"
                        : order.status === "Đang giao"
                        ? "warning"
                        : "primary"
                    }
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
