import axios from "axios";

// Permite definir a URL do backend via variável de ambiente da Cloudflare/Vercel (VITE_API_URL)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

export default API;
