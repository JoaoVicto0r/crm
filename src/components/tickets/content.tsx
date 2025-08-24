import React, { useEffect, useState } from 'react';
import { getTickets, updateTicketStatus } from '../../utils/tickets.api';

interface Contact {
  id: number;
  name: string;
  number: string;
}

interface User {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  lastMessage: string;
  status: string;
  unreadMessages: number;
  answered: boolean;
  Contacts: Contact;
  Users?: User;
  createdAt: string;
  updatedAt: string;
}

interface TicketsComponentProps {
  tenantId: number;
}

export const TicketsComponent: React.FC<TicketsComponentProps> = ({ tenantId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets(tenantId);
      setTickets(data);
    } catch (err) {
      console.error('Erro ao buscar tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: number, status: string) => {
    try {
      await updateTicketStatus(ticketId, status, tenantId);
      fetchTickets();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Carregando tickets...</p>;

  return (
    <div className="tickets-container">
      <h2>Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Contato</th>
            <th>Última Mensagem</th>
            <th>Status</th>
            <th>Mensagens Não Lidas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.Contacts?.name || ticket.Contacts?.number}</td>
              <td>{ticket.lastMessage}</td>
              <td>{ticket.status}</td>
              <td>{ticket.unreadMessages}</td>
              <td>
                {ticket.status !== 'closed' && (
                  <>
                    <button onClick={() => handleStatusChange(ticket.id, 'pending')}>
                      Pendente
                    </button>
                    <button onClick={() => handleStatusChange(ticket.id, 'open')}>
                      Aberto
                    </button>
                    <button onClick={() => handleStatusChange(ticket.id, 'closed')}>
                      Fechado
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
