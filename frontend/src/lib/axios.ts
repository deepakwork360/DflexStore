import axios from "axios";
import Cookies from "js-cookie";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Check local storage or cookies for the token
    const token =
      Cookies.get("token") ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle Network Errors (No response from server)
    if (!error.response) {
      const networkError = {
        message:
          "Server is unreachable. Please check your connection or try again later.",
        isNetworkError: true,
      };
      // We still reject with the original error but can attach a custom message
      (error as any).customMessage = networkError.message;
      return Promise.reject(error);
    }

    // Handle global 401 Unauthorized
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
