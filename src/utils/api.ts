import axios from 'axios';

// ====================== INSTANCE ======================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true,
});

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

  weeklyData: { day: string; tickets: number; messages: number }[];
  hourlyData: { hour: string; count: number }[];

  statusData: { name: string; value: number; color: string }[];
  userAttendanceData: { name: string; value: number; color: string }[];
  channelData: { name: string; value: number; color: string }[];
  connectionData: { name: string; value: number; color: string }[];
  demandData: { name: string; value: number; color: string }[];

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



/*=================================================
                     KANBAN
  ================================================= */
export const showAllTicketInformation = async () => {
  const { data } = await api.get('/tickets'); 
  return data;
};

export const showContact = async (contactId: number) => {
  const { data } = await api.get(`/contacts/${contactId}`);
  return data;
};

// ====================== USERS ======================
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', { email, password });
  return data;
};

// ====================== DASHBOARD ======================
export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await api.get('/dashboard');
  if (data.dashboard) return data.dashboard as DashboardData;
  return data as DashboardData;
};

// ====================== CONTACTS ======================
export const getContacts = async (): Promise<Contact[]> => {
  const { data } = await api.get<Contact[]>('/contacts');
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
/*===================== KANBAN - HOOKS ====================== */
export async function createTicket(ticketData: any) {
  return api.post("/tickets", ticketData);
}
export async function setQueue(ticketId: number, queueId: number) {
  return api.put(`/tickets/${ticketId}/queue`, { queueId });
}

export async function setTicketInfo(ticketId: number, info: any) {
  return api.put(`/tickets/${ticketId}/info`, info);
}

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.post('/auth/refresh');
          isRefreshing = false;
          onTokenRefreshed();
        } catch (err) {
          isRefreshing = false;
          await api.post('/auth/logout');
          window.location.href = '/';
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
