import axios from "axios";

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Check if window exists (to avoid SSR issues)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;
