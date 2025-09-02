import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // Your backend API URL (Change if needed)
});

// Add request interceptor (conditionally attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage

    // Only attach Authorization if request is to your backend, not external APIs
    if (token && config.baseURL.includes("localhost")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
