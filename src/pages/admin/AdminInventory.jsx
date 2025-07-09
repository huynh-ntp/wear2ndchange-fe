import React, { useState, useEffect, useMemo } from "react";
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
  Card,
  CardMedia,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  TextField,
  Alert,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { productService } from "../../services/productService";
import { getImageUrl } from "../../utils/imageUtils";

const CATEGORIES = [
  { value: "ALL", label: "Tất cả" },
  { value: "JACKET", label: "Áo khoác" },
  { value: "SHIRT", label: "Áo" },
  { value: "TROUSERS", label: "Quần" },
  { value: "DRESS", label: "Váy" },
];

const STATUS_MAP = {
  ACTIVE: { label: "Đang đăng bán", color: "success" },
  SOLD_OUT: { label: "Đã bán hết", color: "error" },
};

const AdminInventory = () => {
  console.log("Component rendered"); // Debug log

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [category, setCategory] = useState({ value: "ALL", label: "Tất cả" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [success, setSuccess] = useState(null);

  const fetchProducts = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        size: rowsPerPage,
        sort: "createdDateTime,desc",
        ...(category?.value &&
          category.value !== "ALL" && { category: category.value }),
        ...(searchQuery && { name: searchQuery }),
      };

      const response = await productService.getProductList(params);

      if (response && response.data) {
        setProducts(response.data.content);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setError("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, category, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(0);
  };

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (product) => {
    if (!product || !product.id) {
      setError("Không tìm thấy thông tin sản phẩm");
      return;
    }
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (product) => {
    if (!product || !product.id) {
      setError("Không tìm thấy thông tin sản phẩm");
      return;
    }

    try {
      await productService.updateProductStatus(product.id, "SOLD_OUT");
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError("Không thể xóa sản phẩm");
      console.error("Error deleting product:", err);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct || !selectedProduct.id) {
      setError("Không tìm thấy thông tin sản phẩm");
      setDeleteDialogOpen(false);
      return;
    }
    handleDeleteConfirm(selectedProduct);
  };

  const handleReopenProduct = async (product) => {
    try {
      await productService.updateProductStatus(product.id, "ACTIVE");
      fetchProducts();
    } catch (err) {
      setError("Không thể mở bán sản phẩm");
      console.error("Error reopening product:", err);
    }
  };

  const handleViewDetail = (product) => {
    setSelectedProductDetail(product);
    setDetailDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditedProduct({ ...selectedProductDetail });
    setNewImages([]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedProduct(null);
    setNewImages([]);
    setIsEditing(false);
    setImageError("");
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setImageError("Vui lòng chỉ upload file ảnh");
        return;
      }

      const newImageFiles = [...newImages];
      newImageFiles[index] = file;
      setNewImages(newImageFiles);
      setImageError("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      if (newImages.length === 0 && editedProduct.images.length === 0) {
        setImageError("Vui lòng upload ít nhất 1 ảnh sản phẩm");
        return;
      }

      const productForm = {
        name: editedProduct.name,
        category: editedProduct.category,
        size: editedProduct.size,
        material: editedProduct.material,
        price: parseInt(editedProduct.price),
        percentage: editedProduct.percentage,
        status: editedProduct.status,
      };

      const formData = new FormData();
      formData.append("productId", editedProduct.id);
      formData.append("productForm", JSON.stringify(productForm));

      // Append new images
      newImages.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      await productService.updateProduct(editedProduct.id, formData);

      // Show success message
      setError(null);
      setSuccess("Cập nhật sản phẩm thành công");

      // Close the dialog and reset edit state
      setIsEditing(false);
      setDetailDialogOpen(false);

      // Reload the product list
      fetchProducts();
    } catch (err) {
      setError("Không thể cập nhật sản phẩm");
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      // Check if this is the last image
      if (editedProduct.images.length <= 1) {
        setImageError(
          "Không thể xóa hình ảnh cuối cùng. Sản phẩm phải có ít nhất 1 hình ảnh."
        );
        return;
      }

      await productService.deleteImage(imageId);
      // Update the edited product's images list
      setEditedProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
      setImageError(""); // Clear any previous error
    } catch (err) {
      setImageError("Không thể xóa hình ảnh");
      console.error("Error deleting image:", err);
    }
  };

  const getStatusColor = (status) => {
    return STATUS_MAP[status]?.color || "default";
  };

  const getStatusLabel = (status) => {
    return STATUS_MAP[status]?.label || status;
  };

  const getCategoryLabel = (categoryValue) => {
    return (
      CATEGORIES.find((cat) => cat.value === categoryValue)?.label ||
      categoryValue
    );
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
        Quản lý kho
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm sản phẩm"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Nhập tên sản phẩm..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            value={category}
            onChange={handleCategoryChange}
            options={CATEGORIES}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Danh mục" />}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            sx={{ width: "500px" }}
          />
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
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Chất liệu</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell>Độ mới</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Card sx={{ maxWidth: 100 }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={getImageUrl(product.images?.[0]?.url)}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "100px",
                          objectFit: "contain",
                          backgroundColor: "#f5f5f5",
                        }}
                      />
                    </Card>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{getCategoryLabel(product.category)}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>{product.material}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(product.status)}
                      color={getStatusColor(product.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.percentage}</TableCell>
                  <TableCell>
                    {product.price?.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      title="Xem chi tiết"
                      onClick={() => handleViewDetail(product)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {product.status === "ACTIVE" ? (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(product)}
                        title="Ngưng bán"
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleReopenProduct(product)}
                        title="Mở bán"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Không có sản phẩm nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {products.length > 0 && (
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
            onChange={(event, newPage) => setPage(newPage - 1)}
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
            {totalElements} sản phẩm)
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận ngưng bán</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn ngưng bán sản phẩm "{selectedProduct?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Ngưng bán
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          handleCancelEdit();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Chi tiết sản phẩm</Typography>
            {!isEditing && (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                variant="contained"
                color="primary"
              >
                Chỉnh sửa
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProductDetail && (
            <Grid container spacing={3}>
              {/* Product Images */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {isEditing ? (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Hình ảnh hiện tại
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              flexWrap: "wrap",
                              mb: 2,
                            }}
                          >
                            {editedProduct.images.map((image, index) => (
                              <Box key={image.id} sx={{ position: "relative" }}>
                                <CardMedia
                                  component="img"
                                  sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                  }}
                                  image={getImageUrl(image.url)}
                                  alt={`Product image ${index + 1}`}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    bgcolor: "error.main",
                                    color: "white",
                                    "&:hover": {
                                      bgcolor: "error.dark",
                                    },
                                  }}
                                  onClick={() => handleDeleteImage(image.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Thêm hình ảnh mới
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                          >
                            {[0, 1, 2, 3].map((index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: 100,
                                  height: 100,
                                  border: "1px dashed",
                                  borderColor: "divider",
                                  borderRadius: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  position: "relative",
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                  }}
                                  onChange={(e) => handleImageUpload(index, e)}
                                />
                                {newImages[index] ? (
                                  <CardMedia
                                    component="img"
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                    image={URL.createObjectURL(
                                      newImages[index]
                                    )}
                                    alt={`New image ${index + 1}`}
                                  />
                                ) : (
                                  <AddPhotoAlternateIcon
                                    sx={{
                                      color: "text.secondary",
                                      fontSize: 40,
                                    }}
                                  />
                                )}
                              </Box>
                            ))}
                          </Box>
                          {imageError && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 1 }}
                            >
                              {imageError}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    selectedProductDetail.images?.map((image, index) => (
                      <Card key={index} sx={{ width: "100%" }}>
                        <CardMedia
                          component="img"
                          height="300"
                          image={getImageUrl(image.url)}
                          alt={`${selectedProductDetail.name} - ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "300px",
                            objectFit: "contain",
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                      </Card>
                    ))
                  )}
                </Box>
              </Grid>

              {/* Product Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {isEditing ? (
                    // Edit mode - Form fields
                    <>
                      <TextField
                        fullWidth
                        label="Tên sản phẩm"
                        name="name"
                        value={editedProduct.name}
                        onChange={handleInputChange}
                        required
                      />

                      <FormControl fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                          name="category"
                          value={editedProduct.category}
                          onChange={handleInputChange}
                          label="Danh mục"
                        >
                          {CATEGORIES.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Kích thước"
                        name="size"
                        value={editedProduct.size}
                        onChange={handleInputChange}
                      />

                      <TextField
                        fullWidth
                        label="Chất liệu"
                        name="material"
                        value={editedProduct.material}
                        onChange={handleInputChange}
                      />

                      <FormControl component="fieldset">
                        <Typography variant="subtitle1" color="text.secondary">
                          Độ mới
                        </Typography>
                        <RadioGroup
                          name="percentage"
                          value={editedProduct.percentage}
                          onChange={handleInputChange}
                          row
                        >
                          <FormControlLabel
                            value="95-98%"
                            control={<Radio />}
                            label="95-98%"
                          />
                          <FormControlLabel
                            value="80-90%"
                            control={<Radio />}
                            label="80-90%"
                          />
                          <FormControlLabel
                            value="60-80%"
                            control={<Radio />}
                            label="60-80%"
                          />
                          <FormControlLabel
                            value="Dưới 60%"
                            control={<Radio />}
                            label="Dưới 60%"
                          />
                        </RadioGroup>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Giá bán"
                        name="price"
                        type="number"
                        value={editedProduct.price}
                        onChange={handleInputChange}
                        required
                        InputProps={{
                          endAdornment: <Typography>đ</Typography>,
                        }}
                      />

                      <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          name="status"
                          value={editedProduct.status}
                          onChange={handleInputChange}
                          label="Trạng thái"
                        >
                          <MenuItem value="ACTIVE">Đang đăng bán</MenuItem>
                          <MenuItem value="SOLD_OUT">Đã bán hết</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    // View mode - Display fields
                    <>
                      <Typography variant="h5" gutterBottom>
                        {selectedProductDetail.name}
                      </Typography>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Danh mục
                        </Typography>
                        <Typography variant="body1">
                          {getCategoryLabel(selectedProductDetail.category)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Kích thước
                        </Typography>
                        <Typography variant="body1">
                          {selectedProductDetail.size || "Chưa cập nhật"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Chất liệu
                        </Typography>
                        <Typography variant="body1">
                          {selectedProductDetail.material || "Chưa cập nhật"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Độ mới
                        </Typography>
                        <Typography variant="body1">
                          {selectedProductDetail.percentage || "Chưa cập nhật"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Giá bán
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {selectedProductDetail.price?.toLocaleString("vi-VN")}
                          đ
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                          Trạng thái
                        </Typography>
                        <Chip
                          label={getStatusLabel(selectedProductDetail.status)}
                          color={getStatusColor(selectedProductDetail.status)}
                          size="small"
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleCancelEdit}>Hủy</Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
              >
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInventory;
