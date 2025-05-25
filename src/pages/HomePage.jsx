import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="section"
        sx={{
          backgroundColor: "#f4e3b8",
          px: { xs: 2, sm: 4, md: 6, lg: 8 }, // Giảm padding ngang
          py: { xs: 3, sm: 4 }, // Giảm padding dọc
          flex: 1,
          display: "flex",
          alignItems: "center", // Căn giữa theo chiều dọc
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 8 }, // Giảm khoảng cách giữa các phần tử
              alignItems: "center",
            }}
          >
            {/* Left content */}
            <Box flex={1} color="#4a3c2f">
              <Typography
                variant="h1"
                sx={{
                  fontFamily: `"Playfair Display", serif`,
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "3.5rem" }, // Giảm kích thước font
                  lineHeight: 1.1,
                }}
              >
                WEAR.2ND <br />
                CHANCE
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 2, // Giảm margin top
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  maxWidth: 500,
                  lineHeight: 1.6, // Giảm line height
                  color: "#4a3c2f",
                }}
              >
                Mặc đẹp – Tiết kiệm – Bền vững! 🌿 ✨
                <br />
                Khám phá thế giới thời trang second-hand chất lượng cao tại
                Wear.2ndchance – nơi mỗi món đồ đều có một câu chuyện và một cơ
                hội thứ hai!
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 3, // Giảm margin top
                  backgroundColor: "#4a3c2f",
                  color: "#d9cba0",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#3a2f23",
                  },
                }}
              >
                Về chúng tôi
              </Button>
            </Box>

            {/* Right image */}
            <Box
              flex={1}
              sx={{
                width: "100%",
                maxWidth: 1000, // Tăng kích thước tối đa của ảnh
              }}
            >
              <Box
                component="img"
                src="https://thumuatonkho.com/wp-content/uploads/2023/12/do-second-hand-la-gi.jpg"
                alt="Hình ảnh các bộ quần áo second-hand"
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  objectFit: "cover",
                  height: { xs: "auto", md: "450px" }, // Cố định chiều cao trên desktop
                }}
                loading="lazy"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;
