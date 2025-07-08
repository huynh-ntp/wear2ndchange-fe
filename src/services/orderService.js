import { privateApi } from "./api";

export const getOrders = async (params) => {
  try {
    const response = await privateApi.get("/orders", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await privateApi.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await privateApi.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await privateApi.post("/orders", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
