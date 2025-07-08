import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

const MissionPage = () => {
  return (
    <Box sx={{ backgroundColor: "#E9D6A6", p: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Box color="#3B2F1B">
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sứ mệnh của chúng tôi
              </Typography>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Wear.2ndChance - Kết Nối Đam Mê, Lan Tỏa Giá Trị
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Chúng tôi mang đến một nền tảng nơi người mua và người bán có
                thể kết nối nhanh chóng, an toàn và tiện lợi.
              </Typography>
              <Typography variant="body2">
                Hãy cùng chúng tôi viết tiếp hành trình của những bộ trang phục,
                để mỗi chiếc áo không chỉ là một món đồ, mà còn kể một câu
                chuyện mới!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://storage.googleapis.com/a1aa/image/6998fed3-0db6-4e35-3e3e-55d0c97853f8.jpg"
              alt="Interior of a clothing store with racks of clothes"
              sx={{
                width: "100%",
                borderRadius: 6,
                objectFit: "cover",
                height: { xs: 250, md: "auto" },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MissionPage;
