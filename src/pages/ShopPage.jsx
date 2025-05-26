import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ShopPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ flex: 1, maxWidth: "100%", px: 2, py: 3, bgcolor: "#fff" }}>
        <Box sx={{ maxWidth: "1000px", mx: "auto", mb: 4 }}>
          {/* Search section */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ minWidth: { md: "300px" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Playfair Display",
                  color: "#9e9e5a",
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                WEAR2ND CHANCE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9e9e5a",
                  fontFamily: "Playfair Display",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                buy your clothes & second chance
              </Typography>
            </Box>
            <TextField
              variant="outlined"
              placeholder="áo thun freesize..."
              size="small"
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", md: "500px" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* DANH MỤC SẢN PHẨM */}
          <Box sx={{ bgcolor: "#f6f9d6", textAlign: "center", py: 1, mb: 3 }}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "#4a4a3a" }}
            >
              DANH MỤC SẢN PHẨM
            </Typography>
          </Box>

          {/* Categories */}
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "QUẦN SECONDHAND",
                src: "https://storage.googleapis.com/a1aa/image/477ac688-a1c5-430e-3d58-e3a0ea8800da.jpg",
                bg: "#3a3a3a",
              },
              {
                title: "ÁO SECONDHAND",
                src: "https://storage.googleapis.com/a1aa/image/3808dc28-287a-4854-2c13-ac882e6624af.jpg",
                bg: "#d1d3db",
              },
              {
                title: "VÁY SECONDHAND",
                src: "https://storage.googleapis.com/a1aa/image/319ee3ed-1d7e-4bdb-38ef-b2b517ee823d.jpg",
                bg: "#f0f0f0",
              },
              {
                title: "ÁO KHOÁC SECONDHAND",
                src: "https://storage.googleapis.com/a1aa/image/ee4da14e-2ebe-4020-53ba-98935cec2a5e.jpg",
                bg: "#c4c0b9",
              },
            ].map((item, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={5}
                key={idx}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box sx={{ width: 320 }}>
                  <Box
                    sx={{
                      bgcolor: item.bg,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.src}
                      alt={item.title}
                      sx={{ width: "100%", height: 320, objectFit: "cover" }}
                    />
                  </Box>
                  <Box
                    sx={{ bgcolor: "#f6f9d6", mt: 1, borderRadius: 1, py: 0.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#4a4a3a",
                        textAlign: "center",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* KHÁM PHÁ SẢN PHẨM MỚI */}
          <Box
            sx={{
              bgcolor: "#f6f9d6",
              textAlign: "center",
              py: 1,
              mt: 6,
              mb: 3,
            }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "#4a4a3a" }}
            >
              KHÁM PHÁ SẢN PHẨM MỚI
            </Typography>
          </Box>

          {/* New products */}
          <Grid container spacing={12} justifyContent="center">
            {[
              {
                title: "Áo Sweater Dickies",
                src: "https://storage.googleapis.com/a1aa/image/5b36d9be-65fe-4998-0e4d-aef0d92a1cd8.jpg",
                price: "120.000đ",
              },
              {
                title: "Áo Sweater Dickies",
                src: "https://storage.googleapis.com/a1aa/image/5b36d9be-65fe-4998-0e4d-aef0d92a1cd8.jpg",
                price: "120.000đ",
              },
              {
                title: "Áo thun form rộng",
                src: "https://storage.googleapis.com/a1aa/image/76a8de5c-fab3-4cc5-a070-50e8c92a274a.jpg",
                price: "100.000đ",
              },
              {
                title: "Áo thun form rộng",
                src: "https://storage.googleapis.com/a1aa/image/76a8de5c-fab3-4cc5-a070-50e8c92a274a.jpg",
                price: "100.000đ",
              },
            ].map((item, idx) => (
              <Grid item key={idx}>
                <Card
                  sx={{
                    maxWidth: 140,
                    borderRadius: 2,
                    boxShadow: 2,
                    textAlign: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.src}
                    alt={item.title}
                    sx={{
                      height: 140,
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <CardContent sx={{ px: 1, py: 1 }}>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: "gray.800" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "gray.600" }}>
                      Giá: {item.price}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "red",
                        cursor: "pointer",
                        mt: 0.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      Mua ngay <ShoppingCartIcon sx={{ fontSize: 14 }} />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ShopPage;
