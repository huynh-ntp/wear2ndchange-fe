import { privateApi, publicApi } from "./api";

export const reviewService = {
  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    try {
      const response = await privateApi.post("/review", {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      return response.data;
    } catch (error) {
      console.error("Create Review Error:", error);
      throw error;
    }
  },

  // Lấy tất cả đánh giá với phân trang
  getAllReviews: async (params = {}) => {
    try {
      const response = await publicApi.get("/review", { params });
      return response.data;
    } catch (error) {
      console.error("Get All Reviews Error:", error);
      throw error;
    }
  },

  // Lấy danh sách đánh giá của sản phẩm với phân trang
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await publicApi.get(`/review/product/${productId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Get Product Reviews Error:", error);
      throw error;
    }
  },

  // Lấy đánh giá của người dùng cho sản phẩm
  getUserProductReview: async (productId, orderId) => {
    try {
      const response = await privateApi.get(
        `/reviews/user/${productId}/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Get User Product Review Error:", error);
      throw error;
    }
  },

  // Cập nhật đánh giá
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await privateApi.put(`/reviews/${reviewId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      return response.data;
    } catch (error) {
      console.error("Update Review Error:", error);
      throw error;
    }
  },

  // Xóa đánh giá
  deleteReview: async (reviewId) => {
    try {
      const response = await privateApi.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Delete Review Error:", error);
      throw error;
    }
  },

  // Lấy tất cả đánh giá của người dùng
  getUserReviews: async (params = {}) => {
    try {
      const response = await privateApi.get("/reviews/user", { params });
      return response.data;
    } catch (error) {
      console.error("Get User Reviews Error:", error);
      throw error;
    }
  },

  // Kiểm tra xem người dùng đã đánh giá sản phẩm chưa
  checkUserHasReviewed: async (productId) => {
    try {
      // Get reviews for the product and check if current user has reviewed
      const response = await privateApi.get(`/review/product/${productId}`, {
        params: { size: 100 } // Get enough reviews to check
      });
      
      // Get current user info from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = user.id;
      
      if (!currentUserId) {
        return false;
      }
      
      // Check if any review is from the current user
      const userReview = response.data.content?.find(
        review => review.accountId === currentUserId
      );
      
      return !!userReview;
    } catch (error) {
      console.error("Check User Review Error:", error);
      return false; // Default to false if error occurs
    }
  },

  // Lấy thống kê đánh giá của sản phẩm (public)
  getProductReviewStats: async (productId) => {
    try {
      const response = await publicApi.get(`/reviews/stats/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Get Product Review Stats Error:", error);
      throw error;
    }
  },
};
