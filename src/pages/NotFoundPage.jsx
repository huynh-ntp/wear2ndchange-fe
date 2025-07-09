import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", md: "8rem" },
          fontWeight: 700,
          color: "#1a1a2e",
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontWeight: 500,
          color: "#4a4a4a",
          mb: 3,
        }}
      >
        Oops! Trang này không tồn tại
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "1rem", md: "1.1rem" },
          color: "#666",
          mb: 4,
          maxWidth: "600px",
          px: 2,
        }}
      >
        Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          bgcolor: "#0d6efd",
          color: "white",
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          "&:hover": {
            bgcolor: "#0b5ed7",
          },
        }}
      >
        Trở về trang chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
