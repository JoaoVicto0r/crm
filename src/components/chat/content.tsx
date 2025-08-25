"use client"

import { useState, useRef, useEffect } from "react"
import io from "socket.io-client"
import QRCode from "qrcode.react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  UserX,
  MessageSquare,
  Clock,
  Check,
  CheckCheck,
  ImageIcon,
  FileText,
  Mic,
} from "lucide-react"
import { cn } from "../../lib/utils"

// ----------- Tipagem de mensagens e tickets -----------
interface Message {
  id: string
  body: string
  fromMe: boolean
  timestamp: string
  ack: number
  mediaType?: "image" | "document" | "audio" | "video"
  mediaUrl?: string
  contactId: number
}

interface ChatTicket {
  id: number
  contactId: number
  contact: {
    name: string
    number: string
    profilePicUrl?: string
    isOnline: boolean
    lastSeen?: string
  }
  status: "open" | "pending" | "closed"
  unreadMessages: number
  lastMessage: string
  lastMessageTime: string
  messages: Message[]
  channel: "whatsapp" | "telegram" | "instagram" | "email"
}

// ----------- Mock tickets -----------
const mockTickets: ChatTicket[] = [
  // ... seus tickets mock
]

// ----------- Helpers -----------
function getChannelIcon(channel: string) {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="h-4 w-4 text-green-500" />
    case "telegram":
      return <Send className="h-4 w-4 text-blue-500" />
    case "instagram":
      return <ImageIcon className="h-4 w-4 text-pink-500" />
    case "email":
      return <FileText className="h-4 w-4 text-red-500" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

function getStatusIcon(ack: number) {
  switch (ack) {
    case 0:
      return <Clock className="h-3 w-3 text-gray-400" />
    case 1:
      return <Check className="h-3 w-3 text-gray-400" />
    case 2:
      return <CheckCheck className="h-3 w-3 text-gray-400" />
    case 3:
      return <CheckCheck className="h-3 w-3 text-blue-500" />
    default:
      return null
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

function formatLastSeen(timestamp?: string) {
  if (!timestamp) return "Offline"
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  if (diffInMinutes < 1) return "Agora mesmo"
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
  return date.toLocaleDateString("pt-BR")
}

// ----------- Componente ChatContent -----------
export function ChatContent() {
  const [tickets] = useState<ChatTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<ChatTicket | null>(tickets[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollToBottom() }, [selectedTicket?.messages])

  // ----------- Conexão WebSocket -----------
  useEffect(() => {
  socketRef.current = io("https://api-royal-production.up.railway.app"); // URL do backend

  // Recebe nova mensagem
  socketRef.current.on("newMessage", (msg: any) => {
    console.log("Nova mensagem:", msg);
    // Atualize o ticket correspondente aqui se quiser
  });

  // Recebe QR code
  socketRef.current.on("qrCode", (qr: string) => {
    console.log("QR recebido:", qr);
    if (qr) {
      // Pega apenas a primeira parte do QR code
      const cleanQr = qr.split(',')[0];
      setQrCode(cleanQr);
    }
  });

  // Recebe status de conexão
  socketRef.current.on("whatsapp:connected", () => {
    setWhatsappConnected(true);
    setQrCode(null);
  });

  return () => socketRef.current.disconnect();
}, []);


  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.contact.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return

    const message: Message = {
      id: Date.now().toString(),
      body: newMessage,
      fromMe: true,
      timestamp: new Date().toISOString(),
      ack: 0,
      contactId: selectedTicket.contactId,
    }

    selectedTicket.messages.push(message)
    setNewMessage("")
    scrollToBottom()

    // Envia para backend
    socketRef.current.emit("sendMessage", message)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* QR Code WhatsApp */}
      {!whatsappConnected && (
        <Card className="flex flex-col items-center justify-center p-4 bg-gray-900 border-gray-800 w-80">
          <p className="text-white mb-2">Escaneie o QR code com WhatsApp Web</p>
         {qrCode ? (
          <QRCode value={qrCode} size={200} />
        ) : (
          <p className="text-gray-400">Aguardando QR code...</p>
        )}
        </Card>
      )}

      {/* Chat List */}
      <Card className="w-80 bg-gray-900 border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={cn(
                "p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors",
                selectedTicket?.id === ticket.id && "bg-gray-800",
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={ticket.contact.profilePicUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {ticket.contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {ticket.contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  )}
                  <div className="absolute -bottom-1 -right-1">{getChannelIcon(ticket.channel)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium truncate">{ticket.contact.name}</h3>
                    <span className="text-xs text-gray-400">{formatTime(ticket.lastMessageTime)}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-1">{ticket.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        ticket.status === "open" && "bg-blue-600",
                        ticket.status === "pending" && "bg-yellow-600",
                        ticket.status === "closed" && "bg-green-600",
                      )}
                    >
                      {ticket.status === "open"
                        ? "Aberto"
                        : ticket.status === "pending"
                        ? "Pendente"
                        : "Fechado"}
                    </Badge>
                    {ticket.unreadMessages > 0 && (
                      <Badge className="bg-red-600 text-white text-xs">{ticket.unreadMessages}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Area */}
      {selectedTicket ? (
        <Card className="flex-1 bg-gray-900 border-gray-800 flex flex-col">
          {/* Chat Header e Messages... */}
          {/* Mantenha o resto do seu layout de chat aqui */}
        </Card>
      ) : (
        <Card className="flex-1 bg-gray-900 border-gray-800 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Selecione uma conversa</h3>
            <p className="text-gray-400">Escolha uma conversa da lista para começar a conversar</p>
          </div>
        </Card>
      )}
    </div>
  )
}
