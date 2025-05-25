import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f0f0d6",
        borderTop: "1px solid #d9d9b9",
        color: "#1a1a1a",
        fontSize: { xs: "0.75rem", md: "0.875rem" },
        width: "100vw", // Đảm bảo full chiều ngang
        position: "relative", // Đảm bảo không bị tràn ngang khi scroll
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4} fontFamily="'Roboto Slab', serif">
          {/* Cột 1 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Wear.2ndChance
            </Typography>
            <Typography sx={{ color: "#4a4a4a", lineHeight: 1.7 }}>
              Nền tảng mua bán quần áo secondhand tiện lợi, giúp bạn tiết kiệm
              chi phí và bảo vệ môi trường.
            </Typography>
          </Grid>

          {/* Cột 2 */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Về chúng tôi
            </Typography>
            <Stack spacing={0.5} sx={{ color: "#4a4a4a" }}>
              <div>Giới thiệu</div>
              <div>Sứ mệnh</div>
              <div>Blog</div>
            </Stack>
          </Grid>

          {/* Cột 3 */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Hỗ trợ khách hàng
            </Typography>
            <Stack spacing={0.5} sx={{ color: "#4a4a4a" }}>
              <div>Câu hỏi thường gặp</div>
              <div>Chính sách đổi trả</div>
              <div>Hướng dẫn mua bán</div>
              <div>Điều khoản sử dụng</div>
            </Stack>
          </Grid>

          {/* Cột 4 */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Liên hệ
            </Typography>
            <Stack spacing={1} sx={{ color: "#4a4a4a" }}>
              <Box display="flex" alignItems="center">
                <span>📍</span>
                <Typography ml={1}>
                  CN: D1, Long Thanh My, Thu Duc, Ho Chi Minh City
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <span>📞</span>
                <Typography ml={1}>Hotline: 0941739973</Typography>
              </Box>

              <Box display="flex" gap={2} mt={1}>
                <MuiLink
                  href="#"
                  aria-label="Facebook"
                  sx={{ color: "#4a4a4a", "&:hover": { color: "#1877f2" } }}
                >
                  <FacebookIcon fontSize="small" />
                </MuiLink>
                <MuiLink
                  href="#"
                  aria-label="YouTube"
                  sx={{ color: "#4a4a4a", "&:hover": { color: "#ff0000" } }}
                >
                  <YouTubeIcon fontSize="small" />
                </MuiLink>
                <MuiLink
                  href="#"
                  aria-label="Instagram"
                  sx={{ color: "#4a4a4a", "&:hover": { color: "#e4405f" } }}
                >
                  <InstagramIcon fontSize="small" />
                </MuiLink>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
