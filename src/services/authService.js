import { publicApi, privateApi } from "./api";

export const login = async (credentials) => {
  try {
    const response = await publicApi.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await publicApi.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await privateApi.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await privateApi.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};
