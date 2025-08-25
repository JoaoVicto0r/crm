import { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  contactId: number;
  status: string;
  Messages: Message[];
}

export default function TicketsContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Erro ao buscar tickets:', err);
    }
  };

  const sendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      await axios.post(`/api/tickets/${selectedTicket.id}/messages`, {
        body: newMessage,
        fromMe: true,
        userId: null, // ajuste conforme usuário logado
      });
      setNewMessage('');
      fetchTickets();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  return (
    <div className="flex gap-4 p-4 h-full">
      {/* Lista de Tickets */}
      <div className="w-1/3 border-r border-gray-200 h-full overflow-y-auto">
        <h2 className="font-bold mb-2">Tickets</h2>
        {tickets.map(ticket => (
          <div
            key={ticket.id}
            className="p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedTicket(ticket)}
          >
            {ticket.contactId} - {ticket.status}
          </div>
        ))}
      </div>

      {/* Mensagens do ticket */}
      <div className="w-2/3 p-2 flex flex-col h-full">
        {selectedTicket ? (
          <>
            <h2 className="font-bold mb-2">Mensagens</h2>
            <div className="flex-1 overflow-y-auto border p-2 mb-2">
              {selectedTicket.Messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded ${
                    msg.fromMe ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
                  }`}
                >
                  {msg.body}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <p>Selecione um ticket</p>
        )}
      </div>
    </div>
  );
}
