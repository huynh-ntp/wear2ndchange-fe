import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useAuthContext } from "../contexts/AuthContext";
import { reviewService } from "../services/reviewService";

const ReviewSection = ({ productId }) => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (productId) {
      fetchReviews();
      fetchReviewStats();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId, {
        page: 0,
        size: 10,
        sort: "createdAt,desc",
      });
      setReviews(response.content || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Không thể tải đánh giá sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await reviewService.getProductReviewStats(productId);
      setReviewStats(response);
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const handleReviewClick = () => {
    if (!user) {
      setNotification({
        open: true,
        message: "Vui lòng đăng nhập để đánh giá sản phẩm",
        severity: "warning",
      });
      return;
    }
    setRating(0);
    setComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setNotification({
        open: true,
        message: "Vui lòng chọn số sao đánh giá",
        severity: "error",
      });
      return;
    }

    try {
      setSubmittingReview(true);

      await reviewService.createReview({
        productId: productId,
        rating: rating,
        comment: comment,
        userId: user.id,
      });

      setNotification({
        open: true,
        message: "Đánh giá của bạn đã được gửi thành công!",
        severity: "success",
      });

      setReviewDialogOpen(false);

      // Refresh reviews and stats
      fetchReviews();
      fetchReviewStats();
    } catch (error) {
      console.error("Error submitting review:", error);
      setNotification({
        open: true,
        message: "Không thể gửi đánh giá. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setRating(0);
    setComment("");
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#4a3a2a" }}>
          Đánh giá sản phẩm
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<RateReviewIcon />}
            onClick={handleReviewClick}
            sx={{
              bgcolor: "#9e9e5a",
              "&:hover": {
                bgcolor: "#7a7a45",
              },
            }}
          >
            Viết đánh giá
          </Button>
        )}
      </Box>

      {reviewStats && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 600, color: "#4a3a2a" }}
                >
                  {reviewStats.averageRating?.toFixed(1) || "0.0"}
                </Typography>
                <Rating
                  value={reviewStats.averageRating || 0}
                  readOnly
                  size="large"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {reviewStats.totalReviews || 0} đánh giá
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats.ratingDistribution?.[star] || 0;
                  const percentage =
                    reviewStats.totalReviews > 0
                      ? (count / reviewStats.totalReviews) * 100
                      : 0;

                  return (
                    <Box
                      key={star}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {star} sao
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          height: 8,
                          bgcolor: "#e0e0e0",
                          borderRadius: 4,
                          mx: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            bgcolor: "#ffc107",
                            width: `${percentage}%`,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {reviews.length > 0 ? (
        <Box>
          {reviews.map((review, index) => (
            <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#f5cc9b",
                    color: "#4a3a2a",
                    mr: 2,
                  }}
                >
                  {review.user?.username?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mr: 2 }}
                    >
                      {review.user?.username || "Người dùng"}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                    <Chip
                      label={`${review.rating} sao`}
                      size="small"
                      sx={{ ml: 1, bgcolor: "#f6f9d6", color: "#4a4a3a" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {formatDate(review.createdAt)}
                  </Typography>
                  {review.comment && (
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có đánh giá nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user
              ? "Hãy là người đầu tiên đánh giá sản phẩm này"
              : "Hãy đăng nhập để đánh giá sản phẩm này"}
          </Typography>
        </Paper>
      )}

      {user && (
        <Dialog
          open={reviewDialogOpen}
          onClose={handleCloseReviewDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Viết đánh giá
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Chọn số sao đánh giá:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating > 0 && `${rating} sao`}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nhận xét của bạn (không bắt buộc)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseReviewDialog}
              disabled={submittingReview}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitReview}
              variant="contained"
              disabled={submittingReview || rating === 0}
              sx={{
                bgcolor: "#9e9e5a",
                "&:hover": {
                  bgcolor: "#7a7a45",
                },
              }}
            >
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Alert
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        severity={notification.severity}
        sx={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default ReviewSection;
