import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const ProductDetail = () => {
  // Mảng chứa các hình ảnh mẫu
  const productImages = [
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw83rcd6em6z78",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2qdqeoiz11i6c",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw83rcd64s7v8d",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2qdpcrogb7e62",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2t5u0ez7riea3",
  ];

  // State để lưu hình ảnh đang được chọn
  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  return (
    <>
      <Container sx={{ backgroundColor: "#f9f8f4", py: 4 }}>
        <Grid
          container
          spacing={4}
          sx={{ backgroundColor: "#fff", borderRadius: 2, p: 3, mb: 4 }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "600px",
                height: "600px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "500px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  src={selectedImage}
                  alt="Quần jean"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                Hình ảnh sản phẩm
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mt={2}>
                {productImages.map((image, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        selectedImage === image ? "2px solid #f50057" : "none",
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <CardMedia
                      component="img"
                      src={image}
                      alt={`Sản phẩm ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: "600px" }}>
            <Typography variant="h6">Mô tả sản phẩm</Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quần jean đen ống rộng suông
            </Typography>
            <ul>
              <li>Kích thước & Số đo: Size M - Dài 120cm, hông 90cm.</li>
              <li>Chất liệu: Jean</li>
              <li>Tình trạng sản phẩm: Mới 80%, đã mặc 1 lần.</li>
            </ul>
            <Box
              sx={{
                bgcolor: "#f5deb3",
                px: 2,
                py: 1,
                borderRadius: 1,
                display: "inline-block",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">Giá sản phẩm: 90.000đ</Typography>
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <Button variant="contained" color="error">
                🛒 Thêm vào giỏ hàng
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "#ffcc66" }}>
                Liên hệ người bán
              </Button>
            </Box>
            <Button variant="contained" color="error" fullWidth>
              MUA NGAY
            </Button>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          align="center"
          sx={{ bgcolor: "#eff5e1", py: 1, borderRadius: 1, mb: 3 }}
        >
          SẢN PHẨM TƯƠI NG TƯƠNG TỰ
        </Typography>

        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image=""
                  alt="Sản phẩm tương tự"
                  sx={{ height: 200 }}
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {index < 2 ? "Áo Sweater Dickies" : "Áo thun form rộng"}
                  </Typography>
                  <Typography variant="body2">
                    Giá: {index < 2 ? "120.000đ" : "100.000đ"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    Mua ngay
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ProductDetail;
