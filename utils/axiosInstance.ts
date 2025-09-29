import { openRateLimitModal } from "@/store/modalSlice";
import { store } from "@/store/store";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 429) {
        console.log("Rate limit exceeded - please try again later.");
      } else if (status === 401) {
        console.error("Unauthorized - please log in again");
        window.location.href = "/";
      } else if (status === 403) {
        console.error("Forbidden access - you do not have permission");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timed out. Please try again later.");
      } else if (status >= 500) {
        console.error("Server error - please try again later");
      } else {
        console.error(`Error: ${data.message || "An error occurred"}`);
      }
      return Promise.reject(error);
    }
    // Eğer response yoksa (örn: network error)
    return Promise.reject(error);
  }
);

export default axiosInstance;
