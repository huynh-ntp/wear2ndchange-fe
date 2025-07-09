import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Rating,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { reviewService } from "../../services/reviewService";
import { getImageUrl } from "../../utils/imageUtils";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page, searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviews({
        page,
        size: 10,
        sort: "createdAt,desc",
        search: searchTerm,
      });

      if (response.data) {
        setReviews(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;

    try {
      setDeletingReview(true);
      await reviewService.deleteReview(selectedReview.id);
      setDeleteDialogOpen(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Không thể xóa đánh giá");
    } finally {
      setDeletingReview(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý đánh giá sản phẩm
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên sản phẩm hoặc người dùng..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Người đánh giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nhận xét</TableCell>
              <TableCell>Ngày đánh giá</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component="img"
                      src={getImageUrl(review.product?.images?.[0]?.url)}
                      alt={review.product?.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review.product?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.product?.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#f5cc9b",
                        color: "#4a3a2a",
                        fontSize: "0.875rem",
                      }}
                    >
                      {review.user?.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="body2">
                      {review.user?.username || "Người dùng"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Chip
                      label={`${review.rating} sao`}
                      color={getRatingColor(review.rating)}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {review.comment || "Không có nhận xét"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(review.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleViewDetail(review)}
                      title="Xem chi tiết"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(review)}
                      title="Xóa đánh giá"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {reviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>Không có đánh giá nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            gap: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
          <Typography variant="body2" color="text.secondary">
            Trang {page + 1} / {totalPages} ({totalElements} đánh giá)
          </Typography>
        </Box>
      )}

      {/* Review Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chi tiết đánh giá
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    component="img"
                    src={getImageUrl(selectedReview.product?.images?.[0]?.url)}
                    alt={selectedReview.product?.name}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "contain",
                      bgcolor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    {selectedReview.product?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedReview.product?.category}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Rating value={selectedReview.rating} readOnly />
                    <Chip
                      label={`${selectedReview.rating} sao`}
                      color={getRatingColor(selectedReview.rating)}
                      size="small"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#f5cc9b",
                        color: "#4a3a2a",
                      }}
                    >
                      {selectedReview.user?.username?.charAt(0).toUpperCase() ||
                        "U"}
                    </Avatar>
                    <Typography variant="body2">
                      {selectedReview.user?.username || "Người dùng"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Đánh giá ngày: {formatDate(selectedReview.createdAt)}
                  </Typography>

                  {selectedReview.comment && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Nhận xét:
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {selectedReview.comment}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa đánh giá</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn
            tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deletingReview}
          >
            {deletingReview ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminReviews;
