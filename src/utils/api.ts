// src/utils/api.ts
import axios from "axios";

// ====================== TYPES ======================
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

// ====================== INSTANCE ======================
const api = axios.create({
  baseURL: "https://api-royal-production.up.railway.app",
  withCredentials: true,
});

// ====================== USERS ======================
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
};

// ====================== DASHBOARD ======================
export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await api.get("/dashboard");
  // Suporte para wrapper { dashboard: {...} } ou objeto direto
  if (data.dashboard) return data.dashboard as DashboardData;
  return data as DashboardData;
};

// ====================== REFRESH TOKEN ======================
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.post("/auth/refresh");
          isRefreshing = false;
          onTokenRefreshed();
        } catch (err) {
          isRefreshing = false;
          await api.post("/auth/logout");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
