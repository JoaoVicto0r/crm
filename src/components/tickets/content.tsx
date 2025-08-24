"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  MessageSquare,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Ticket {
  id: number
  status: "pending" | "open" | "closed"
  priority: "low" | "medium" | "high"
  subject: string
  contact: {
    name: string
    number: string
    channel: "whatsapp" | "telegram" | "email" | "phone"
  }
  assignedTo?: string
  lastMessage: string
  unreadMessages: number
  createdAt: string
  updatedAt: string
}

const mockTickets: Ticket[] = [
  {
    id: 1001,
    status: "open",
    priority: "high",
    subject: "Problema com pagamento",
    contact: {
      name: "João Silva",
      number: "+55 11 99999-9999",
      channel: "whatsapp",
    },
    assignedTo: "Maria Santos",
    lastMessage: "Preciso de ajuda urgente com o pagamento",
    unreadMessages: 3,
    createdAt: "2025-08-23T10:30:00Z",
    updatedAt: "2025-08-23T11:45:00Z",
  },
  {
    id: 1002,
    status: "pending",
    priority: "medium",
    subject: "Dúvida sobre produto",
    contact: {
      name: "Ana Costa",
      number: "ana@email.com",
      channel: "email",
    },
    lastMessage: "Gostaria de saber mais sobre os planos disponíveis",
    unreadMessages: 1,
    createdAt: "2025-08-23T09:15:00Z",
    updatedAt: "2025-08-23T09:15:00Z",
  },
  {
    id: 1003,
    status: "closed",
    priority: "low",
    subject: "Solicitação de informações",
    contact: {
      name: "Pedro Oliveira",
      number: "@pedro_oliveira",
      channel: "telegram",
    },
    assignedTo: "Carlos Lima",
    lastMessage: "Obrigado pela ajuda!",
    unreadMessages: 0,
    createdAt: "2025-08-22T14:20:00Z",
    updatedAt: "2025-08-23T08:30:00Z",
  },
  {
    id: 1004,
    status: "open",
    priority: "high",
    subject: "Problema técnico urgente",
    contact: {
      name: "Empresa ABC",
      number: "+55 11 88888-8888",
      channel: "phone",
    },
    assignedTo: "João Silva",
    lastMessage: "Sistema não está funcionando",
    unreadMessages: 5,
    createdAt: "2025-08-23T08:00:00Z",
    updatedAt: "2025-08-23T11:30:00Z",
  },
  {
    id: 1005,
    status: "pending",
    priority: "medium",
    subject: "Renovação de contrato",
    contact: {
      name: "Maria Fernanda",
      number: "+55 11 77777-7777",
      channel: "whatsapp",
    },
    lastMessage: "Preciso renovar meu contrato",
    unreadMessages: 2,
    createdAt: "2025-08-23T07:45:00Z",
    updatedAt: "2025-08-23T10:20:00Z",
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "open":
      return <AlertCircle className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "closed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <XCircle className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "bg-blue-600"
    case "pending":
      return "bg-yellow-600"
    case "closed":
      return "bg-green-600"
    default:
      return "bg-gray-600"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-600"
    case "medium":
      return "bg-yellow-600"
    case "low":
      return "bg-green-600"
    default:
      return "bg-gray-600"
  }
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="h-4 w-4 text-green-500" />
    case "telegram":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "email":
      return <Mail className="h-4 w-4 text-red-500" />
    case "phone":
      return <Phone className="h-4 w-4 text-purple-500" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TicketsContent() {
  const [tickets] = useState<Ticket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Tickets</h1>
          <p className="text-gray-400">Gerencie todos os atendimentos em um só lugar</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-600 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Abertos</p>
                <p className="text-2xl font-bold text-white">{stats.open}</p>
              </div>
              <div className="bg-blue-600 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <div className="bg-yellow-600 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Fechados</p>
                <p className="text-2xl font-bold text-white">{stats.closed}</p>
              </div>
              <div className="bg-green-600 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, assunto ou contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Lista de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Prioridade</TableHead>
                <TableHead className="text-gray-300">Contato</TableHead>
                <TableHead className="text-gray-300">Assunto</TableHead>
                <TableHead className="text-gray-300">Responsável</TableHead>
                <TableHead className="text-gray-300">Última Mensagem</TableHead>
                <TableHead className="text-gray-300">Criado em</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-gray-800 hover:bg-gray-800">
                  <TableCell className="text-white font-medium">#{ticket.id}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(ticket.status)}
                        {ticket.status === "pending" ? "Pendente" : ticket.status === "open" ? "Aberto" : "Fechado"}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                      {ticket.priority === "high" ? "Alta" : ticket.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(ticket.contact.channel)}
                      <div>
                        <p className="text-white font-medium">{ticket.contact.name}</p>
                        <p className="text-gray-400 text-sm">{ticket.contact.number}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white max-w-xs truncate">{ticket.subject}</TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{ticket.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-white text-sm truncate">{ticket.lastMessage}</p>
                      {ticket.unreadMessages > 0 && (
                        <Badge className="bg-red-600 text-white text-xs mt-1">{ticket.unreadMessages} não lidas</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Atribuir</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Transferir</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Fechar ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
