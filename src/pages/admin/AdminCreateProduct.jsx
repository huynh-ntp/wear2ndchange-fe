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
  InputAdornment,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { productService } from "../../services/productService";

const AdminCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [images, setImages] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    size: "",
    material: "",
    price: "",
    percentage: "95-98%",
  });

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.match("image.*")) {
        setError("Vui lòng chỉ upload file ảnh");
        return;
      }

      const newImageFiles = [...imageFiles];
      newImageFiles[index] = file;
      setImageFiles(newImageFiles);

      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        price: value,
      }));
    }
  };
  // Map local category values to CategoryEnum values from backend
  const mapCategoryToEnum = (category) => {
    const categoryMap = {
      quan: "TROUSERS", // CategoryEnum.TROUSERS
      ao: "SHIRT", // CategoryEnum.SHIRT
      vay: "DRESS", // CategoryEnum.DRESS
      "ao-khoac": "JACKET", // CategoryEnum.JACKET
    };
    return categoryMap[category] || category;
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.category || !formData.price) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      } // Validate images
      const validImages = imageFiles.filter((file) => file !== null);
      if (validImages.length < 1) {
        setError("Vui lòng upload ít nhất 1 ảnh sản phẩm");
        return;
      }

      setLoading(true);
      setError("");

      const productDataToSend = {
        ...formData,
        category: mapCategoryToEnum(formData.category),
        price: parseInt(formData.price),
      };

      const response = await productService.createProduct(
        productDataToSend,
        validImages
      );

      setSuccess("Tạo sản phẩm thành công!");

      // Reset form
      setFormData({
        name: "",
        category: "",
        size: "",
        material: "",
        price: "",
        percentage: "95-98%",
      });
      setImages([null, null, null, null]);
      setImageFiles([null, null, null, null]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm";
      setError(errorMessage);
    } finally {
      setLoading(false);
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

        <Typography variant="h6" fontWeight="bold" mb={2}>
          1. Chụp ảnh sản phẩm
        </Typography>
        <Typography variant="body2" gutterBottom>
          {" "}
          • Cung cấp ít nhất 1 ảnh sản phẩm (Khuyến nghị: 3-5 ảnh để hiển thị
          đầy đủ các góc nhìn)
          <br />
          • Hình ảnh nên có độ phân giải cao - Tránh ảnh bị vỡ nét khi khách
          hàng phóng to để xem chi tiết.
          <br />• Chụp cận chất liệu, đường may – Giúp khách hàng đánh giá chất
          lượng sản phẩm tốt hơn.
        </Typography>

        {/* Image upload grid */}
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
        <TextField
          fullWidth
          label="Tên sản phẩm"
          required
          margin="normal"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal">
          <FormLabel>Loại sản phẩm</FormLabel>{" "}
          <Select
            value={formData.category}
            onChange={handleInputChange}
            name="category"
            displayEmpty
            required
          >
            <MenuItem value="" disabled>
              Chọn loại sản phẩm
            </MenuItem>
            {/* Map to CategoryEnum.TROUSERS */}
            <MenuItem value="quan">Quần secondhand</MenuItem>
            {/* Map to CategoryEnum.SHIRT */}
            <MenuItem value="ao">Áo secondhand</MenuItem>
            {/* Map to CategoryEnum.DRESS */}
            <MenuItem value="vay">Váy secondhand</MenuItem>
            {/* Map to CategoryEnum.JACKET */}
            <MenuItem value="ao-khoac">Áo khoác secondhand</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Kích thước & Số đo"
          margin="normal"
          name="size"
          value={formData.size}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          label="Chất liệu sản phẩm"
          margin="normal"
          name="material"
          value={formData.material}
          onChange={handleInputChange}
        />

        <Box mt={2}>
          <FormLabel component="legend">Tình trạng sản phẩm:</FormLabel>
          <RadioGroup
            row
            value={formData.percentage}
            onChange={handleInputChange}
            name="percentage"
          >
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
        <TextField
          fullWidth
          required
          type="text"
          label="Nhập giá bán..."
          margin="normal"
          name="price"
          value={formData.price}
          onChange={handlePriceChange}
          error={parseInt(formData.price) <= 0}
          helperText={
            parseInt(formData.price) <= 0
              ? "Giá bán phải lớn hơn 0"
              : "Chỉ được nhập số và không được âm"
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">đ</InputAdornment>,
          }}
        />

        <Box mt={3} textAlign="right">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#f5cc9b",
              color: "black",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e5bc8b",
              },
            }}
          >
            {loading ? "Đang xử lý..." : "Đăng bán"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminCreateProduct;
