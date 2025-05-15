// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Đặt biến môi trường để linh hoạt
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi chung (ví dụ: hết hạn phiên)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect hoặc logout nếu cần
      console.warn("Phiên đã hết hạn hoặc không hợp lệ.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
