# Chức năng Đánh giá Sản phẩm

## Tổng quan

Chức năng đánh giá sản phẩm cho phép người dùng đánh giá các sản phẩm đã mua và nhận hàng, giúp cải thiện trải nghiệm mua sắm và cung cấp thông tin hữu ích cho các khách hàng khác.

## Tính năng chính

### 1. Trang Sản phẩm đã mua (`/purchased-products`)

- Hiển thị danh sách các sản phẩm đã mua và nhận hàng
- Cho phép người dùng đánh giá từng sản phẩm
- Hiển thị trạng thái đã đánh giá hay chưa
- Phân trang và tìm kiếm

### 2. Đánh giá sản phẩm

- Hệ thống đánh giá 5 sao
- Nhận xét tùy chọn
- Kiểm tra trùng lặp đánh giá
- Validation dữ liệu

### 3. Hiển thị đánh giá trong trang chi tiết sản phẩm

- Thống kê đánh giá (điểm trung bình, phân bố sao)
- Danh sách đánh giá với thông tin người dùng
- Nút viết đánh giá cho người dùng đã đăng nhập

### 4. Quản lý đánh giá (Admin)

- Xem tất cả đánh giá trong hệ thống
- Tìm kiếm và lọc đánh giá
- Xem chi tiết đánh giá
- Xóa đánh giá không phù hợp

## Cấu trúc API

### Endpoints chính:

- `POST /reviews` - Tạo đánh giá mới
- `GET /reviews/product/{productId}` - Lấy đánh giá của sản phẩm
- `GET /reviews/user/{productId}/{orderId}` - Kiểm tra đánh giá của người dùng
- `GET /reviews/stats/{productId}` - Thống kê đánh giá sản phẩm
- `GET /reviews` - Lấy tất cả đánh giá (admin)
- `DELETE /reviews/{reviewId}` - Xóa đánh giá

## Cách sử dụng

### Cho người dùng:

1. Đăng nhập vào tài khoản
2. Vào menu "Sản phẩm đã mua" từ dropdown tài khoản
3. Chọn sản phẩm muốn đánh giá
4. Nhấn nút "Đánh giá sản phẩm"
5. Chọn số sao và viết nhận xét (tùy chọn)
6. Nhấn "Gửi đánh giá"

### Cho admin:

1. Đăng nhập vào trang admin
2. Vào menu "Đánh giá" trong sidebar
3. Xem danh sách tất cả đánh giá
4. Sử dụng thanh tìm kiếm để lọc
5. Nhấn icon mắt để xem chi tiết
6. Nhấn icon thùng rác để xóa đánh giá

## Các file chính

### Components:

- `src/pages/user/PurchasedProductsPage.jsx` - Trang sản phẩm đã mua
- `src/components/ReviewSection.jsx` - Component hiển thị đánh giá
- `src/pages/admin/AdminReviews.jsx` - Trang quản lý đánh giá

### Services:

- `src/services/reviewService.js` - API calls cho đánh giá

### Routes:

- `/purchased-products` - Trang sản phẩm đã mua
- `/admin/reviews` - Trang quản lý đánh giá

## Tính năng bảo mật

1. **Xác thực người dùng**: Chỉ người dùng đã đăng nhập mới có thể đánh giá
2. **Kiểm tra quyền sở hữu**: Chỉ đánh giá sản phẩm đã mua và nhận hàng
3. **Tránh đánh giá trùng lặp**: Mỗi đơn hàng chỉ được đánh giá một lần
4. **Phân quyền admin**: Chỉ admin mới có thể quản lý đánh giá

## Validation

1. **Rating bắt buộc**: Phải chọn ít nhất 1 sao
2. **Comment tùy chọn**: Có thể để trống
3. **Kiểm tra sản phẩm**: Chỉ đánh giá sản phẩm tồn tại
4. **Kiểm tra đơn hàng**: Chỉ đánh giá đơn hàng đã nhận

## Giao diện

### Thiết kế responsive:

- Hiển thị tốt trên desktop, tablet và mobile
- Grid layout linh hoạt
- Cards design hiện đại
- Màu sắc phù hợp với theme chung

### UX/UI:

- Loading states
- Error handling
- Success notifications
- Confirmation dialogs
- Hover effects và animations

## Tương lai

### Tính năng có thể mở rộng:

1. **Đánh giá có hình ảnh**: Cho phép upload ảnh sản phẩm thực tế
2. **Reply từ admin**: Admin có thể trả lời đánh giá
3. **Filter đánh giá**: Lọc theo số sao, ngày tháng
4. **Report đánh giá**: Người dùng có thể báo cáo đánh giá không phù hợp
5. **Review helpful**: Người dùng có thể vote đánh giá hữu ích
6. **Email notification**: Thông báo khi có đánh giá mới

## Lưu ý kỹ thuật

1. **Performance**: Sử dụng pagination để tối ưu hiệu suất
2. **Caching**: Có thể cache thống kê đánh giá
3. **Database**: Cần index cho các trường tìm kiếm
4. **Security**: Validate input và sanitize data
5. **Error handling**: Xử lý lỗi gracefully

## Hướng dẫn triển khai

1. Đảm bảo backend API đã sẵn sàng
2. Cập nhật database schema nếu cần
3. Test các tính năng trên môi trường development
4. Deploy lên production
5. Monitor performance và errors
