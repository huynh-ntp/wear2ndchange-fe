import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Grid,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import { userService } from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        size: rowsPerPage,
        // sort: "createdDateTime,desc",
        ...(searchQuery && { name: searchQuery }),
      };

      const response = await userService.getUserList(params);

      if (response && response.data) {
        setCustomers(response.data.content);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setError("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setDetailDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Đang tải...</Typography>
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý khách hàng
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm khách hàng"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Nhập tên hoặc email khách hàng..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              width: "200px",
              height: "56px",
            }}
          >
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Avatar
                      src={
                        customer.avatarUrl
                          ? getImageUrl(customer.avatarUrl)
                          : null
                      }
                      alt={customer.fullName}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.username}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        customer.status === "ACTIVE" ? "Hoạt động" : "Khóa"
                      }
                      color={customer.status === "ACTIVE" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetail(customer)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Không có khách hàng nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {customers.length > 0 && (
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
            count={Math.ceil(totalElements / rowsPerPage)}
            page={page + 1}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
          />
          <Button
            variant="outlined"
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
          >
            Trang sau
          </Button>
          <Typography variant="body2" color="text.secondary">
            Trang {page + 1} / {Math.ceil(totalElements / rowsPerPage)} (
            {totalElements} khách hàng)
          </Typography>
        </Box>
      )}

      {/* Customer Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết khách hàng</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Avatar
                    src={
                      selectedCustomer.avatarUrl
                        ? getImageUrl(selectedCustomer.avatarUrl)
                        : null
                    }
                    alt={selectedCustomer.fullName || selectedCustomer.username}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {selectedCustomer.fullName || "Chưa cập nhật tên"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{selectedCustomer.username}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Thông tin cá nhân
                </Typography>
                <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.email}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.phoneNumber || "Chưa cập nhật"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.address || "Chưa cập nhật"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Vai trò
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.role === "USER"
                        ? "Khách hàng"
                        : selectedCustomer.role}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={
                        selectedCustomer.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Khóa"
                      }
                      color={
                        selectedCustomer.status === "ACTIVE"
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCustomers;
