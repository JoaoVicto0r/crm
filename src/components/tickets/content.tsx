// src/components/tickets/content.tsx
"use client"
import { useEffect, useState } from "react"
import api, { DashboardData } from "../../utils/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  MessageSquare,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  User,
  MoreHorizontal,
} from "lucide-react"

// Tipagem do Ticket da API
interface Ticket {
  id: number
  title: string
  status: string
  assignedTo?: string
  createdAt: string
}

export default function TicketsContent() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all")

  // Fetch tickets da API
  const fetchTickets = async () => {
    try {
      const data = await api.get<DashboardData>("/dashboard").then(res => res.data)
      setDashboardData(data)
      setTickets(data.ticketsTable || [])
    } catch (err) {
      console.error("Erro ao buscar tickets:", err)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // Filtros
  const filteredTickets = (tickets || []).filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-600"
      case "pending":
        return "bg-yellow-500"
      case "closed":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

      {/* Filtros */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Título</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Responsável</TableHead>
                  <TableHead className="text-gray-300">Criado em</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-gray-800 hover:bg-gray-800">
                    <TableCell className="text-white font-medium">#{ticket.id}</TableCell>
                    <TableCell className="text-white">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(ticket.status)} text-white flex items-center gap-1`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status === "pending"
                          ? "Pendente"
                          : ticket.status === "open"
                          ? "Aberto"
                          : "Fechado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{ticket.assignedTo || "Não atribuído"}</TableCell>
                    <TableCell className="text-gray-400">{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer select-none">Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer select-none">Atribuir</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer select-none">Fechar ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
