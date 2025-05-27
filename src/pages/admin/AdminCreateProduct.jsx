import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Button,
  Avatar,
  MenuItem,
  Select,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const AdminCreateProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [productType, setProductType] = useState("");

  const handleImageUpload = (index, e) => {
    const newImages = [...images];
    newImages[index] = URL.createObjectURL(e.target.files[0]);
    setImages(newImages);
  };

  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
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
        <Typography variant="h6" fontWeight="bold" mb={2}>
          1. Chụp ảnh sản phẩm
        </Typography>
        <Typography variant="body2" gutterBottom>
          • Cung cấp ít nhất 3-5 ảnh (trước, sau, bên trái/phải, chi tiết vải,
          nhãn mác nếu có)
          <br />
          • Hình ảnh nên có độ phân giải cao - Tránh ánh bị vỡ nét khi khách
          hàng phóng to để xem chi tiết.
          <br />• Chụp cận chất liệu, đường may – Giúp khách hàng đánh giá chất
          lượng sản phẩm tốt hơn.
        </Typography>
        <Grid container spacing={2} my={2}>
          {images.map((img, index) => (
            <Grid item xs={3} key={index}>
              <label htmlFor={`upload-${index}`}>
                <input
                  accept="image/*"
                  id={`upload-${index}`}
                  type="file"
                  hidden
                  onChange={(e) => handleImageUpload(index, e)}
                />
                <Box
                  sx={{
                    width: "100%",
                    height: 100,
                    bgcolor: "#fff",
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {img ? (
                    <Avatar
                      variant="rounded"
                      src={img}
                      sx={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <AddPhotoAlternateIcon fontSize="large" />
                  )}
                </Box>
              </label>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight="bold" mt={3}>
          2. Mô tả chi tiết sản phẩm
        </Typography>
        <TextField fullWidth label="Tên sản phẩm" required margin="normal" />

        <FormControl fullWidth margin="normal">
          <FormLabel>Loại sản phẩm</FormLabel>
          <Select
            value={productType}
            onChange={handleProductTypeChange}
            displayEmpty
            required
          >
            <MenuItem value="" disabled>
              Chọn loại sản phẩm
            </MenuItem>
            <MenuItem value="quan">Quần secondhand</MenuItem>
            <MenuItem value="ao">Áo secondhand</MenuItem>
            <MenuItem value="vay">Váy secondhand</MenuItem>
            <MenuItem value="ao-khoac">Áo khoác secondhand</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth label="Kích thước & Số đo" margin="normal" />
        <TextField fullWidth label="Chất liệu sản phẩm" margin="normal" />

        <Box mt={2}>
          <FormLabel component="legend">Tình trạng sản phẩm:</FormLabel>
          <RadioGroup row defaultValue="95-98%">
            <FormControlLabel
              value="95-98%"
              control={<Radio />}
              label="95-98%"
            />
            <FormControlLabel
              value="80-90%"
              control={<Radio />}
              label="80-90%"
            />
            <FormControlLabel
              value="60-80%"
              control={<Radio />}
              label="60-80%"
            />
            <FormControlLabel
              value="Dưới 60%"
              control={<Radio />}
              label="Dưới 60%"
            />
          </RadioGroup>
        </Box>

        <Typography variant="h6" fontWeight="bold" mt={3}>
          3. Giá bán
        </Typography>
        <TextField fullWidth label="Nhập giá bán..." margin="normal" />

        <Box mt={3} textAlign="right">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f5cc9b",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Đăng bán
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminCreateProduct;
