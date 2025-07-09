import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";

const AdminSettings = () => {
  const { user, logout } = useAuthContext();
  const [avatar, setAvatar] = useState(null);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = () => {
    // TODO: Implement profile update logic
    console.log("Update profile:", profileData);
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    // TODO: Implement password update logic
    console.log("Update password:", passwordData);
    setOpenPasswordDialog(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always navigate to login page, even if logout fails
      navigate("/admin/login");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper
        sx={{
          maxWidth: "lg",
          mx: "auto",
          p: 4,
          backgroundColor: "#f0e0c1",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Cài đặt tài khoản
        </Typography>

        <Grid container spacing={4}>
          {/* Avatar Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <Avatar
                src={avatar}
                sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
              />
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                hidden
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    color: "black",
                    borderColor: "black",
                    "&:hover": {
                      borderColor: "black",
                      backgroundColor: "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  Thay đổi ảnh đại diện
                </Button>
              </label>
            </Box>
          </Grid>

          {/* Profile Info Section */}
          <Grid item xs={12} md={8}>
            <Box component="form" noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Tên đăng nhập"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Họ và tên"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  sx={{
                    backgroundColor: "#f5cc9b",
                    color: "black",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#e5bc8b" },
                  }}
                >
                  Cập nhật thông tin
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenPasswordDialog(true)}
                  sx={{
                    color: "black",
                    borderColor: "black",
                    "&:hover": {
                      borderColor: "black",
                      backgroundColor: "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#ff6b6b",
                    color: "white",
                    "&:hover": { backgroundColor: "#ff5252" },
                  }}
                >
                  Đăng xuất
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog
          open={openPasswordDialog}
          onClose={() => setOpenPasswordDialog(false)}
        >
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Hủy</Button>
            <Button onClick={handleUpdatePassword} variant="contained">
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
