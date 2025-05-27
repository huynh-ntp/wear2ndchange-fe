import React, { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EditIcon from "@mui/icons-material/Edit";

// Mock data - sau này sẽ được thay thế bằng API call
const products = [
  {
    id: 1,
    name: "Áo khoác jean",
    size: "M",
    material: "Jean",
    condition: 80,
    price: "200.000",
    status: "active",
  },
  {
    id: 2,
    name: "Quần baggy",
    size: "L",
    material: "Kaki",
    condition: 90,
    price: "150.000",
    status: "paused",
  },
  {
    id: 3,
    name: "Áo thun form rộng",
    size: "XL",
    material: "Cotton",
    condition: 95,
    price: "100.000",
    status: "active",
  },
  {
    id: 4,
    name: "Váy hoa vintage",
    size: "S",
    material: "Lụa",
    condition: 85,
    price: "180.000",
    status: "active",
  },
];

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState(products);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const handleStatusChange = (productId) => {
    setInventory(
      inventory.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            status: product.status === "active" ? "paused" : "active",
          };
        }
        return product;
      })
    );
  };

  const filteredProducts = inventory.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditClick = (product) => {
    setEditProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditProduct(null);
  };

  const handleSaveEdit = () => {
    setInventory(
      inventory.map((product) =>
        product.id === editProduct.id ? editProduct : product
      )
    );
    handleCloseDialog();
  };

  const handleInputChange = (field) => (event) => {
    setEditProduct({
      ...editProduct,
      [field]: event.target.value,
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Quản lý kho hàng
        </Typography>
        <TextField
          size="small"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell align="center">Size</TableCell>
              <TableCell align="center">Chất liệu</TableCell>
              <TableCell align="center">Tình trạng</TableCell>
              <TableCell align="right">Giá bán</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow
                key={product.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell align="center">{product.size}</TableCell>
                <TableCell align="center">{product.material}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${product.condition}%`}
                    color={
                      product.condition >= 90
                        ? "success"
                        : product.condition >= 80
                        ? "info"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{product.price}đ</TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      product.status === "active" ? "Đang bán" : "Tạm ngưng"
                    }
                    color={product.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleStatusChange(product.id)}
                      color={
                        product.status === "active" ? "warning" : "success"
                      }
                      size="small"
                      title={
                        product.status === "active" ? "Tạm ngưng" : "Mở lại"
                      }
                    >
                      {product.status === "active" ? (
                        <PauseCircleIcon />
                      ) : (
                        <PlayCircleIcon />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditClick(product)}
                      color="primary"
                      size="small"
                      title="Chỉnh sửa"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                value={editProduct?.name || ""}
                onChange={handleInputChange("name")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={editProduct?.size || ""}
                  label="Size"
                  onChange={handleInputChange("size")}
                >
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Chất liệu"
                value={editProduct?.material || ""}
                onChange={handleInputChange("material")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tình trạng (%)"
                type="number"
                value={editProduct?.condition || ""}
                onChange={handleInputChange("condition")}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giá bán"
                value={editProduct?.price || ""}
                onChange={handleInputChange("price")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminInventory;
