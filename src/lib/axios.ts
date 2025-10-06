import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 👈 دا المهم جداً
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor للأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🛑 Unauthorized, redirecting...");
      if (typeof window !== "undefined") {
        localStorage.clear();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setTimeout(() => (window.location.href = "/login"), 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
