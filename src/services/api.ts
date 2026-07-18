import axios from "axios";
import { useAuthStore } from "@/src/store/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — auto-logout on expired / invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;

/* ─── Typed API helpers ─────────────────────────────────── */

export async function get<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await api.get<T>(url, { params });
  return data;
}

export async function post<T>(url: string, body?: unknown) {
  const { data } = await api.post<T>(url, body);
  return data;
}

export async function put<T>(url: string, body?: unknown) {
  const { data } = await api.put<T>(url, body);
  return data;
}

export async function del<T>(url: string) {
  const { data } = await api.delete<T>(url);
  return data;
}
