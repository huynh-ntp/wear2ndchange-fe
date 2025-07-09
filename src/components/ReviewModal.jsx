import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Popover,
  Grid,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { reviewService } from "../services/reviewService";

const ReviewModal = ({
  open,
  onClose,
  product,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

  // Common emojis for reviews
  const reviewEmojis = [
    "😍", "😊", "👍", "👌", "💖", "🔥", "✨", "🎉",
    "😀", "😃", "😄", "😁", "😆", "🥰", "😘", "🤩",
    "👏", "💯", "❤️", "💕", "💝", "🌟", "⭐", "🏆",
    "😎", "🤗", "😋", "😌", "🙌", "💪", "👑", "💎",
    "😢", "😞", "👎", "😒", "😤", "😠", "💔", "😭"
  ];

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Vui lòng nhập bình luận");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Vui lòng chọn đánh giá từ 1 đến 5 sao");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      await reviewService.createReview({
        productId: product.id,
        rating: rating,
        comment: comment.trim(),
      });

      setRating(5);
      setComment("");
      onClose();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(5);
      setComment("");
      setError("");
      setEmojiAnchorEl(null);
      onClose();
    }
  };

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (emoji) => {
    setComment(prev => prev + emoji);
    setEmojiAnchorEl(null);
  };

  const emojiOpen = Boolean(emojiAnchorEl);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Đánh giá sản phẩm
      </DialogTitle>
      <DialogContent>
        {product && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                variant="rounded"
                src={product.images?.[0]?.url}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#f5f5f5",
                  "& img": {
                    objectFit: "contain",
                  },
                }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {product.size} | Chất liệu: {product.material}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Đánh giá sao *
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
          />
        </Box>

        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét *"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này... 😊"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            inputProps={{ maxLength: 1000 }}
            helperText={`${comment.length}/1000 ký tự`}
          />
          <IconButton
            onClick={handleEmojiClick}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
            size="small"
          >
            <EmojiEmotionsIcon />
          </IconButton>
        </Box>

        {/* Emoji Picker Popover */}
        <Popover
          open={emojiOpen}
          anchorEl={emojiAnchorEl}
          onClose={handleEmojiClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Chọn emoji
            </Typography>
            <Grid container spacing={0.5}>
              {reviewEmojis.map((emoji, index) => (
                <Grid item key={index}>
                  <IconButton
                    onClick={() => handleEmojiSelect(emoji)}
                    sx={{
                      fontSize: "1.2rem",
                      width: 40,
                      height: 40,
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "scale(1.2)",
                      },
                      transition: "transform 0.1s ease-in-out",
                    }}
                  >
                    {emoji}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Popover>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !comment.trim()}
        >
          {submitting ? <CircularProgress size={24} /> : "Gửi đánh giá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal; 