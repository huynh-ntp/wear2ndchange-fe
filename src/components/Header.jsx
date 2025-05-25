import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#4a3a2a",
          color: "#f0f0d6",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            mx: "auto",
            width: "100%",
            justifyContent: "space-between",
            px: { xs: 2, md: 6 },
            py: 1.5,
            fontSize: { xs: "0.875rem", md: "1rem" },
            flexDirection: { xs: "column", md: "row" }, // Thêm dòng này để responsive
            alignItems: { xs: "flex-start", md: "center" }, // Đảm bảo căn chỉnh tốt trên mobile
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              userSelect: "none",
              mb: { xs: 1, md: 0 }, // Thêm margin dưới cho mobile
            }}
          >
            Chào bạn xinh, sắm đồ xịn nhé!
          </Typography>

          <Box
            sx={{
              display: { xs: "flex", md: "flex" }, // Luôn hiển thị, đổi layout theo màn hình
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, md: 3 },
              fontFamily: "'Roboto Slab', serif",
              width: { xs: "100%", md: "auto" },
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            {[
              "Trang chủ",
              "Cửa hàng",
              "Đăng nhập/Đăng ký",
              "Kênh người bán",
            ].map((item, index) => (
              <MuiLink
                key={index}
                href="#"
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "pointer",
                  width: { xs: "100%", md: "auto" },
                  py: { xs: 0.5, md: 0 },
                }}
              >
                {item}
              </MuiLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
