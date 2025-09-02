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
  totalTickets: number;
  contatosAtivos: number;
  tempoMedio: string;
  taxaResolucao: number;

  // Gráficos
  weeklyData: { day: string; tickets: number; messages: number }[];
  hourlyData: { hour: string; count: number }[];

  // Pies
  statusData: { name: string; value: number; color: string }[];
  userAttendanceData: { name: string; value: number; color: string }[];
  channelData: { name: string; value: number; color: string }[];
  connectionData: { name: string; value: number; color: string }[];
  demandData: { name: string; value: number; color: string }[];

  // Tabelas (exemplo)
  ticketsTable: {
    id: number;
    title: string;
    status: string;
    assignedTo: string;
    createdAt: string;
  }[];

  usersTable: {
    id: number;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
  }[];
}

export interface Contact {
  id: number;
  name: string;
  number?: string | null;
  email?: string | null;
  pushname?: string | null;
  isWAContact?: boolean | null;
  isUser?: boolean | null;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}


// ====================== INSTANCE ======================
const api = axios.create({
  baseURL: "https://api-royal-hngp.onrender.com",
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

// ====================== CONTACTS ======================

export const getContacts = async (): Promise<Contact[]> => {
  const { data } = await api.get<Contact[]>("/contacts");
  return data;
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
          window.location.href = "/";
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
