import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Container,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { cartService } from "../../services/cartService";
import { userService } from "../../services/api";
import { useCartContext } from "../../contexts/CartContext";
import { getImageUrl } from "../../utils/imageUtils";
import { usePayOS } from "@payos/payos-checkout";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { fetchCartCount } = useCartContext();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod", // Default to cash on delivery
  });

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: null,
    embedded: true,
    onSuccess: async (event) => {
      setIsPaymentOpen(false);
      setPaymentMessage("Đang xác nhận thanh toán...");
      
      try {
        // Call payment confirmation API with orderCode from event
        await userService.confirmPayment(event.orderCode);
        setPaymentMessage("Thanh toán thành công!");
        
        // Navigate to thank you page after successful confirmation
        setTimeout(() => {
          navigate("/thank-you");
        }, 1500);
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        setPaymentMessage("Thanh toán thành công nhưng xác nhận thất bại. Vui lòng liên hệ hỗ trợ.");
      }
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile(user.id);
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          fullName: response.data.fullName || "",
          phone: response.data.phoneNumber || "",
          email: response.data.email || "",
          address: response.data.address || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Không thể tải thông tin người dùng");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchCartItems();
  }, [user, navigate]);

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null && isPaymentOpen) {
      // Add a small delay to ensure the DOM element is rendered
      const timer = setTimeout(() => {
        const element = document.getElementById("embedded-payment-container");
        if (element) {
          open();
        } else {
          console.error("Payment container element not found");
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [payOSConfig, isPaymentOpen, open]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      const selectedItems = response.filter((item) =>
        location.state?.selectedItems?.includes(item.id)
      );
      if (selectedItems.length === 0) {
        setError("Không có sản phẩm nào được chọn");
        return;
      }
      setCartItems(selectedItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Không thể tải thông tin giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const orderData = {
        note: formData.note || "Đơn hàng mới",
        cartIds: cartItems.map((item) => item.id),
        phoneNumber: formData.phone,
        address: formData.address,
        receiver: formData.fullName,
        email: formData.email,
      };

      const orderResponse = await userService.createOrder(orderData);
      
      // Check if orderId exists in response
      if (orderResponse.data && orderResponse.data.orderId !== undefined) {
        const { orderId } = orderResponse.data;
        
        // If payment method is bank transfer, create payment link
        if (formData.paymentMethod === "bank_transfer") {
          try {
            const paymentResponse = await userService.createPaymentLink(orderId);
            console.log("Payment link created:", paymentResponse);
            
            // Set up embedded payment instead of redirecting
            if (paymentResponse.checkoutUrl) {
              setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: paymentResponse.checkoutUrl,
              }));
              setIsPaymentOpen(true);
              await fetchCartCount();
              return; // Don't navigate to thank-you page yet
            }
          } catch (paymentError) {
            console.error("Payment link creation failed:", paymentError);
            setError("Đặt hàng thành công nhưng không thể tạo liên kết thanh toán. Vui lòng liên hệ hỗ trợ.");
          }
        }
      }

      await fetchCartCount();
      //navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Không thể đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    exit();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/cart")}
          sx={{
            bgcolor: "#9e9e5a",
            "&:hover": {
              bgcolor: "#7a7a45",
            },
          }}
        >
          Quay lại giỏ hàng
        </Button>
      </Container>
    );
  }

  if (paymentMessage) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, color: "green", fontWeight: 600 }}>
            {paymentMessage}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Đang chuyển hướng...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} width="100%">
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 600,
          textAlign: "center",
          color: "#4a3a2a",
        }}
      >
        Đặt hàng
      </Typography>

      {!isPaymentOpen ? (
        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Đơn hàng của bạn
            </Typography>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={getImageUrl(item.product.images[0]?.url)}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "#f5f5f5",
                    "& img": {
                      objectFit: "contain",
                    },
                  }}
                />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {item.product.size}
                  </Typography>
                  <Typography variant="body2" color="error" fontWeight={600}>
                    {formatPrice(item.product.price)}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tạm tính:</Typography>
              <Typography fontWeight={600}>
                {formatPrice(calculateTotal())}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Phí vận chuyển:</Typography>
              <Typography fontWeight={600}>Miễn phí</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6" color="error" fontWeight={600}>
                {formatPrice(calculateTotal())}
              </Typography>
            </Box>
          </Grid>

          {/* Order Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Thông tin nhận hàng
              </Typography>
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "700px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  size="large"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
                
                <FormControl component="fieldset">
                  <FormLabel 
                    component="legend" 
                    sx={{ 
                      color: "#4a3a2a", 
                      fontWeight: 600,
                      "&.Mui-focused": {
                        color: "#4a3a2a",
                      }
                    }}
                  >
                    Phương thức thanh toán
                  </FormLabel>
                  <RadioGroup
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value="cod"
                      control={
                        <Radio 
                          sx={{
                            color: "#9e9e5a",
                            "&.Mui-checked": {
                              color: "#9e9e5a",
                            },
                          }}
                        />
                      }
                      label="Thanh toán khi nhận hàng"
                    />
                    <FormControlLabel
                      value="bank_transfer"
                      control={
                        <Radio 
                          sx={{
                            color: "#9e9e5a",
                            "&.Mui-checked": {
                              color: "#9e9e5a",
                            },
                          }}
                        />
                      }
                      label="Thanh toán chuyển khoản"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: "120px",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 2,
                    fontSize: 18,
                    fontWeight: 600,
                    background: "linear-gradient(to bottom, #d94a4a, #b93a3a)",
                    color: "white",
                    height: "56px",
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "ĐẶT HÀNG"}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600} textAlign="center">
            Thanh toán đơn hàng
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClosePayment}
              sx={{
                color: "#9e9e5a",
                borderColor: "#9e9e5a",
                "&:hover": {
                  borderColor: "#7a7a45",
                  backgroundColor: "rgba(158, 158, 90, 0.04)",
                },
              }}
            >
              Đóng thanh toán
            </Button>
          </Box>
          <Box sx={{ maxWidth: "600px", margin: "0 auto", mb: 2 }}>
            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
              hệ thống tự động cập nhật.
            </Typography>
          </Box>
          <Box
            id="embedded-payment-container"
            sx={{
              height: "500px",
              maxWidth: "600px",
              margin: "0 auto",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          ></Box>
        </Box>
      )}
    </Container>
  );
};

export default CheckoutPage;
