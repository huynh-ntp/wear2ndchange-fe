import { publicApi, privateApi } from "./api";

export const productService = {
  // Public APIs
  getProductList: (params) => publicApi.get("/product", { params }),
  getProductById: (id) => publicApi.get(`/product/${id}`),

  // Private APIs that require authentication
  updateProduct: async (productId, formData) => {
    try {
      const response = await privateApi.put(`/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Update Product Error:", error);
      throw error;
    }
  },

  deleteProduct: (id) => privateApi.delete(`/product/${id}`),

  createProduct: async (productData, imageFiles) => {
    try {
      const formData = new FormData();

      // Append product form data as JSON string
      formData.append(
        "productForm",
        JSON.stringify({
          name: productData.name,
          category: productData.category,
          size: productData.size,
          material: productData.material,
          price: parseInt(productData.price),
          percentage: productData.percentage,
          status: "ACTIVE",
        })
      );

      // Append each image file
      imageFiles.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      const response = await privateApi.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Create Product Error:", error);
      throw error;
    }
  },

  deleteImage: (imageId) => privateApi.delete(`/productImage/${imageId}`),

  updateProductStatus: async (productId, status) => {
    try {
      return await privateApi.put(
        `/product/${productId}`,
        { status },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Create Product Error:", error);
      throw error;
    }
  },
};
