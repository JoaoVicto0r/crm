"use client"

import { useState, useRef, useEffect } from "react"
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

interface Message {
  id: string
  body: string
  fromMe: boolean
  timestamp: string
  ack: number // 0: sending, 1: sent, 2: delivered, 3: read
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

const mockTickets: ChatTicket[] = [
  {
    id: 1001,
    contactId: 1,
    contact: {
      name: "João Silva",
      number: "+55 11 99999-9999",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    status: "open",
    unreadMessages: 2,
    lastMessage: "Preciso de ajuda urgente com o pagamento",
    lastMessageTime: "2025-08-23T11:45:00Z",
    channel: "whatsapp",
    messages: [
      {
        id: "1",
        body: "Olá! Como posso ajudá-lo?",
        fromMe: true,
        timestamp: "2025-08-23T10:30:00Z",
        ack: 3,
        contactId: 1,
      },
      {
        id: "2",
        body: "Oi! Estou com problema no pagamento da minha fatura",
        fromMe: false,
        timestamp: "2025-08-23T10:32:00Z",
        ack: 3,
        contactId: 1,
      },
      {
        id: "3",
        body: "Vou verificar isso para você. Pode me informar o número da fatura?",
        fromMe: true,
        timestamp: "2025-08-23T10:35:00Z",
        ack: 3,
        contactId: 1,
      },
      {
        id: "4",
        body: "Claro! É a fatura #12345",
        fromMe: false,
        timestamp: "2025-08-23T10:37:00Z",
        ack: 3,
        contactId: 1,
      },
      {
        id: "5",
        body: "Preciso de ajuda urgente com o pagamento",
        fromMe: false,
        timestamp: "2025-08-23T11:45:00Z",
        ack: 2,
        contactId: 1,
      },
    ],
  },
  {
    id: 1002,
    contactId: 2,
    contact: {
      name: "Maria Santos",
      number: "+55 11 88888-8888",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      isOnline: false,
      lastSeen: "2025-08-23T09:30:00Z",
    },
    status: "pending",
    unreadMessages: 1,
    lastMessage: "Obrigada pela informação!",
    lastMessageTime: "2025-08-23T09:15:00Z",
    channel: "whatsapp",
    messages: [
      {
        id: "6",
        body: "Gostaria de saber mais sobre os planos disponíveis",
        fromMe: false,
        timestamp: "2025-08-23T09:00:00Z",
        ack: 3,
        contactId: 2,
      },
      {
        id: "7",
        body: "Claro! Temos 3 planos principais: Básico, Intermediário e Premium. Qual seria o seu interesse?",
        fromMe: true,
        timestamp: "2025-08-23T09:05:00Z",
        ack: 3,
        contactId: 2,
      },
      {
        id: "8",
        body: "Obrigada pela informação!",
        fromMe: false,
        timestamp: "2025-08-23T09:15:00Z",
        ack: 3,
        contactId: 2,
      },
    ],
  },
  {
    id: 1003,
    contactId: 3,
    contact: {
      name: "Pedro Costa",
      number: "@pedro_costa",
      isOnline: false,
      lastSeen: "2025-08-22T18:00:00Z",
    },
    status: "closed",
    unreadMessages: 0,
    lastMessage: "Problema resolvido, obrigado!",
    lastMessageTime: "2025-08-22T15:30:00Z",
    channel: "telegram",
    messages: [
      {
        id: "9",
        body: "Estou com dificuldades para acessar minha conta",
        fromMe: false,
        timestamp: "2025-08-22T15:00:00Z",
        ack: 3,
        contactId: 3,
      },
      {
        id: "10",
        body: "Vou ajudá-lo com isso. Pode tentar fazer o reset da senha?",
        fromMe: true,
        timestamp: "2025-08-22T15:05:00Z",
        ack: 3,
        contactId: 3,
      },
      {
        id: "11",
        body: "Problema resolvido, obrigado!",
        fromMe: false,
        timestamp: "2025-08-22T15:30:00Z",
        ack: 3,
        contactId: 3,
      },
    ],
  },
]

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
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
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

export function ChatContent() {
  const [tickets] = useState<ChatTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<ChatTicket | null>(tickets[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedTicket?.messages])

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

    // In a real app, this would be handled by state management
    selectedTicket.messages.push(message)
    setNewMessage("")
    scrollToBottom()
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
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
                      {ticket.status === "open" ? "Aberto" : ticket.status === "pending" ? "Pendente" : "Fechado"}
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
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedTicket.contact.profilePicUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {selectedTicket.contact.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedTicket.contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div>
                <h3 className="text-white font-medium">{selectedTicket.contact.name}</h3>
                <p className="text-sm text-gray-400">
                  {selectedTicket.contact.isOnline ? "Online" : formatLastSeen(selectedTicket.contact.lastSeen)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Info className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Archive className="mr-2 h-4 w-4" />
                    Arquivar conversa
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <UserX className="mr-2 h-4 w-4" />
                    Transferir atendimento
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Fechar ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedTicket.messages.map((message) => (
              <div key={message.id} className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                    message.fromMe ? "bg-blue-600 text-white" : "bg-gray-800 text-white border border-gray-700",
                  )}
                >
                  <p className="text-sm">{message.body}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    {message.fromMe && getStatusIcon(message.ack)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-gray-800 border-gray-700 text-white pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
