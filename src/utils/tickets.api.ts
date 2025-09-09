import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export const getTickets = async (tenantId: number) => {
  const response = await axios.get(`${API_BASE}/tickets`, {
    params: { tenantId },
  });
  return response.data;
};

export const getTicketById = async (id: number, tenantId: number) => {
  const response = await axios.get(`${API_BASE}/tickets/${id}`, {
    params: { tenantId },
  });
  return response.data;
};

export const updateTicketStatus = async (
  id: number,
  status: string,
  tenantId: number
) => {
  const response = await axios.patch(
    `${API_BASE}/tickets/${id}/status`,
    { status },
    { params: { tenantId } }
  );
  return response.data;
};
