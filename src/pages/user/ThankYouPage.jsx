import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#4a3a2a", fontWeight: 600 }}
        >
          Cảm ơn bạn đã đặt hàng!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
          Nhân viên sẽ liên hệ sớm nhất để xác nhận đơn hàng của bạn.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/shop")}
            sx={{
              bgcolor: "#4a3a2a",
              "&:hover": { bgcolor: "#3a2a1a" },
            }}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
            sx={{
              borderColor: "#4a3a2a",
              color: "#4a3a2a",
              "&:hover": {
                borderColor: "#3a2a1a",
                bgcolor: "rgba(74, 58, 42, 0.04)",
              },
            }}
          >
            Xem đơn hàng của tôi
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ThankYouPage;
