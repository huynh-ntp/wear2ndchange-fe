import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthContext } from "../../contexts/AuthContext";
import { authService } from "../../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Tên tài khoản là bắt buộc";
    }

    // Email validation (only for register)
    if (!isLogin && !formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation (only for register)
    if (!isLogin && !formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (error) setError("");
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleSubmit = async (e) => {
    // Luôn ngăn chặn event mặc định
    e?.preventDefault();

    // Reset form state
    setFormErrors({});
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password,
        });
        // Login successful - clear form and navigate
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/");
      } else {
        await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        // Registration successful
        setIsLogin(true);
        setFormData({
          username: formData.username, // Keep username for login
          email: "",
          password: "",
          confirmPassword: "",
        });
        setSuccess("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear all form state
    setError("");
    setSuccess("");
    setFormErrors({});
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    // Reset loading state just in case
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "none",
      }}
    >
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
          {" "}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
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
            <TextField
              fullWidth
              variant="outlined"
              name="username"
              label="Tên tài khoản"
              placeholder="Nhập tên tài khoản"
              value={formData.username}
              onChange={handleInputChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              margin="dense"
              sx={{ mb: 2 }}
              InputLabelProps={{
                style: { fontSize: "12px", color: "#4a4a4a" },
              }}
              inputProps={{
                style: { fontSize: "13px", color: "#4a4a4a" },
              }}
            />
            {!isLogin && (
              <TextField
                fullWidth
                type="email"
                name="email"
                variant="outlined"
                label="Email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                margin="dense"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  style: { fontSize: "12px", color: "#4a4a4a" },
                }}
                inputProps={{
                  style: { fontSize: "13px", color: "#4a4a4a" },
                }}
              />
            )}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              variant="outlined"
              label="Mật Khẩu"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon
                          fontSize="small"
                          sx={{ color: "#9ca3af" }}
                        />
                      ) : (
                        <VisibilityIcon
                          fontSize="small"
                          sx={{ color: "#9ca3af" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isLogin && (
              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Button
                  type="button"
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
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                variant="outlined"
                label="Nhập Lại Mật Khẩu"
                placeholder="Nhập lại mật khẩu của bạn"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
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
                      <IconButton
                        size="small"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon
                            fontSize="small"
                            sx={{ color: "#9ca3af" }}
                          />
                        ) : (
                          <VisibilityIcon
                            fontSize="small"
                            sx={{ color: "#9ca3af" }}
                          />
                        )}
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
              disabled={loading}
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
              {loading
                ? "Đang xử lý..."
                : isLogin
                ? "Đăng nhập"
                : "Tạo tài khoản ngay!"}
            </Button>
            <Button
              type="button"
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
                type="button"
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
    </Box>
  );
};

export default LoginPage;
