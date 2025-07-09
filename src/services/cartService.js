import { privateApi } from "./api";

const cartService = {
  getCart: async () => {
    try {
      const response = await privateApi.get("/cart");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addToCart: async (productId) => {
    try {
      const response = await privateApi.post("/cart", { productId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const response = await privateApi.delete(`/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { cartService };
