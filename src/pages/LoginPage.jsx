import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          position: "relative",
          width: "100vw",
          display: "flex",
          alignItems: "stretch",
          minHeight: 0,
          p: 0,
          mb: 0, // Đảm bảo không có margin/padding dưới
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "100%",
            zIndex: 0,
            mb: 0, // Đảm bảo không có margin/padding dưới
          }}
        >
          <img
            src="https://storage.googleapis.com/a1aa/image/55699b8e-5952-484d-6598-81ae757b7def.jpg"
            alt="Interior of a clothes store"
            style={{
              width: "100vw",
              height: "100%",
              objectFit: "cover",
              display: "block",
              marginBottom: 0,
            }}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 10 },
            width: "100vw",
            minHeight: 0,
            mb: 0,
          }}
        >
          <Box
            component="form"
            autoComplete="off"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              p: 4,
              width: "100%",
              maxWidth: 400,
              boxShadow: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: "Roboto Slab, serif",
                color: "#1a1a2e",
                mb: 3,
              }}
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              label="Số Điện Thoại"
              placeholder="(+84) xxxxxxxxx"
              margin="dense"
              sx={{ mb: 2 }}
              InputLabelProps={{
                style: { fontSize: "12px", color: "#4a4a4a" },
              }}
              inputProps={{
                style: { fontSize: "13px", color: "#4a4a4a" },
              }}
            />

            <TextField
              fullWidth
              type="password"
              variant="outlined"
              label="Mật Khẩu"
              placeholder="Nhập mật khẩu của bạn"
              margin="dense"
              sx={{ mb: isLogin ? 2 : 2 }}
              InputLabelProps={{
                style: { fontSize: "12px", color: "#4a4a4a" },
              }}
              inputProps={{
                style: { fontSize: "13px", color: "#9ca3af" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <VisibilityIcon
                        fontSize="small"
                        sx={{ color: "#9ca3af" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isLogin && (
              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Button
                  sx={{
                    color: "#0d6efd",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    fontSize: "12px",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Quên mật khẩu?
                </Button>
              </Box>
            )}

            {!isLogin && (
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                label="Nhập Lại Mật Khẩu"
                placeholder="Nhập lại mật khẩu của bạn"
                margin="dense"
                sx={{ mb: 3 }}
                InputLabelProps={{
                  style: { fontSize: "12px", color: "#4a4a4a" },
                }}
                inputProps={{
                  style: { fontSize: "13px", color: "#9ca3af" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <VisibilityIcon
                          fontSize="small"
                          sx={{ color: "#9ca3af" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#0d6efd",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: 1,
                py: 1.5,
                mb: 2,
                "&:hover": { bgcolor: "#0b5ed7" },
              }}
            >
              {isLogin ? "Đăng nhập" : "Tạo tài khoản ngay!"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              sx={{
                bgcolor: "#d0e7ff",
                color: "#0d6efd",
                fontSize: "13px",
                textTransform: "none",
                borderRadius: 1,
                py: 1.5,
                "&:hover": { bgcolor: "#b6d4ff" },
              }}
            >
              {isLogin ? "Đăng nhập với Google" : "Tiếp tục với Google"}
            </Button>

            <Typography
              align="center"
              sx={{
                fontSize: "12px",
                mt: 3,
                color: "#6b7280",
                fontFamily: "Roboto Slab, serif",
              }}
            >
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <Button
                onClick={toggleForm}
                sx={{
                  color: "#0d6efd",
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {isLogin ? "Đăng ký ngay!" : "Đăng nhập ngay!"}
              </Button>
            </Typography>
          </Box>

          {/* Phần text bên phải */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 400,
              color: "#f0f0d6",
              fontFamily: "Playfair Display, serif",
              ml: "auto", // Đẩy box sang bên phải
              mr: 8, // Tạo khoảng cách với mép phải
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              WEAR.2ND CHANCE
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Roboto Slab, serif",
                textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              Give your Clothes a Second Chance
            </Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage;
