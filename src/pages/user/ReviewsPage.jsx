import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Rating,
  Divider,
  Pagination,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { reviewService } from "../../services/reviewService";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewService.getAllReviews({
          page,
          size: 10,
          sort: "createdAt,desc",
        });
        
        if (response.content) {
          setReviews(response.content);
          setFilteredReviews(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Không thể tải danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page]);

  // Filter reviews based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(review =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    }
  }, [searchTerm, reviews]);

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

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // Convert to 0-based index
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "success";
    if (rating >= 3.5) return "warning";
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#4a3a2a", mb: 4 }}
      >
        Đánh giá sản phẩm
      </Typography>
      
      {totalElements > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Tổng cộng {totalElements} đánh giá
            {searchTerm && ` (${filteredReviews.length} kết quả tìm kiếm)`}
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên sản phẩm, bình luận hoặc tên người đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      )}

      <Grid container spacing={3}>
        {filteredReviews.map((review) => (
          <Grid item xs={12} key={review.id}>
            <Card
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 3 }}>
                {/* Product Image */}
                <Avatar
                  variant="rounded"
                  src={review.productImageUrl}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#f5f5f5",
                    "& img": {
                      objectFit: "contain",
                    },
                  }}
                >
                  {!review.productImageUrl && "📦"}
                </Avatar>

                {/* Review Content */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {review.productName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Chip
                          label={`${review.rating}/5`}
                          color={getRatingColor(review.rating)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Bởi {review.accountName} • {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: "#333",
                      bgcolor: "#f8f9fa",
                      p: 2,
                      borderRadius: 1,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    "{review.comment}"
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredReviews.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? "Không tìm thấy đánh giá nào" : "Chưa có đánh giá nào"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? "Thử tìm kiếm với từ khóa khác"
              : "Các đánh giá sản phẩm sẽ được hiển thị tại đây"
            }
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
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
            size="large"
          />
          <Typography variant="body2" color="text.secondary">
            Trang {page + 1} / {totalPages}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ReviewsPage; 