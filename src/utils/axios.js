import axios from "axios";

const api = axios.create({
  baseURL: "https://online-shopping-backend-qk2e.onrender.com",
  withCredentials: true, // 🔥 VERY IMPORTANT
});

export default api;