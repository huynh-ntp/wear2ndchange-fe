import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  Alert,
  Avatar,
  Badge,
} from "@mui/material";
import { Visibility, VisibilityOff, CameraAlt } from "@mui/icons-material";
import { useAuthContext } from "../../contexts/AuthContext";
import { authService, userService } from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";
const UserProfilePage = () => {
  const { user } = useAuthContext();

  const isValidImageFormat = (file) => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    return file && validImageTypes.includes(file.type);
  };

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    address: "",
    avatarUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user?.id) {
          throw new Error("User ID not found");
        }

        console.log("Fetching profile for user ID:", user.id); // Debug log
        const response = await userService.getProfile(user.id);
        console.log("Profile response:", response); // Debug log

        if (response.data) {
          setFormData((prev) => ({
            ...response.data,
            avatarUrl: response.data.avatarUrl, // Use avatarUrl from API response
          }));
        } else {
          throw new Error("No profile data received");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        // Reset form data on error
        setFormData({
          id: "",
          username: "",
          fullName: "",
          email: "",
          phoneNumber: "",
          role: "",
          address: "",
          avatarUrl: "",
        });
      } finally {
        setLoading(false);
      }
    };

    // Always call fetchProfile - it will handle the case when user.id is undefined
    fetchProfile();
  }, [user?.id]); // Add user.id as dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };
  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await userService.updateProfile({
        phoneNumber: formData.phoneNumber || "",
        address: formData.address || "",
        avatarUrl: formData.avatarUrl || "",
        fullName: formData.fullName || "",
        id: user.userId,
        email: formData.email || "",
      });

      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
        setSuccess("Cập nhật thông tin thành công!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Không thể cập nhật thông tin. Vui lòng thử lại sau.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường mật khẩu trống
    if (!passwordData.currentPassword.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (!passwordData.newPassword.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (!passwordData.confirmPassword.trim()) {
      setPasswordError("Vui lòng xác nhận mật khẩu mới");
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu mới không khớp với xác nhận mật khẩu");
      return;
    }

    try {
      setLoading(true);
      setPasswordError("");
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(response.data?.message || "Đổi mật khẩu thành công!");
      // Chờ một chút để người dùng thấy message thành công trước khi đóng modal
      setTimeout(() => {
        handlePasswordDialogClose();
      }, 1500);
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại sau.";
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Auto-hide success and error messages after 3 seconds
  useEffect(() => {
    let timeoutId;
    if (success || error || passwordError || passwordSuccess) {
      timeoutId = setTimeout(() => {
        setSuccess("");
        setError("");
        setPasswordError("");
        setPasswordSuccess("");
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [success, error, passwordError, passwordSuccess]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        py: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: "white",
            flex: 1,
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <label htmlFor="avatar-input">
                  <input
                    accept="image/*"
                    id="avatar-input"
                    type="file"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (!isValidImageFormat(file)) {
                          setError(
                            "Chỉ chấp nhận file ảnh có định dạng: JPG, JPEG, PNG hoặc GIF"
                          );
                          return;
                        }

                        try {
                          setLoading(true);
                          // Create object URL for immediate preview
                          const previewUrl = URL.createObjectURL(file);
                          setFormData((prev) => ({
                            ...prev,
                            avatar: previewUrl,
                            avatarUrl: getImageUrl(previewUrl),
                          }));

                          // Upload avatar
                          const response = await userService.updateAvatar(file);
                          if (response.data?.avatarUrl) {
                            setFormData((prev) => ({
                              ...prev,
                              avatar: response.data.avatarUrl,
                              avatarUrl: getImageUrl(response.data.avatarUrl),
                            }));
                            setSuccess("Cập nhật ảnh đại diện thành công!");
                          }
                        } catch (err) {
                          const errorMessage =
                            err.response?.data?.message ||
                            "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.";
                          setError(errorMessage);
                          console.error("Avatar upload error:", err);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  />
                  <IconButton component="span">
                    <CameraAlt />
                  </IconButton>
                </label>
              }
            >
              <Avatar
                src={formData.avatarUrl}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
            </Badge>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Thông Tin Cá Nhân
            </Typography>
          </Box>
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
          <Box
            component="form"
            noValidate
            onSubmit={handleUpdateProfile}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              disabled
              label="Tên tài khoản"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleInputChange}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Cập nhật thông tin"}
              </Button>
              <Button
                variant="outlined"
                onClick={handlePasswordDialogOpen}
                disabled={loading}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </Box>
          {/* Password Change Dialog */}
          <Dialog
            open={openPasswordDialog}
            onClose={handlePasswordDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogContent>
              {" "}
              <Box
                component="form"
                noValidate
                onSubmit={handleChangePassword}
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {passwordSuccess}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Hủy</Button>
              <Button
                onClick={handleChangePassword}
                variant="contained"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>{" "}
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfilePage;
