import axios from "axios";
import { headers } from "next/headers";

const authAxios = axios.create({
  baseURL: "http://localhost:3000/",
  headers: { "Content-Type": "application/json" },
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:3000/refresh", {
            token: refreshToken,
          });
          localStorage.setItem("accessToken", res.data.accessToken);
          return authAxios(originalRequest);
        } catch (err) {
          console.error(err);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default authAxios;
