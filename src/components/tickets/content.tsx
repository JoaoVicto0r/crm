"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Search, MoreHorizontal, MessageSquare, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"

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
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Buscar tickets da API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get<Ticket[]>(`${API_URL}/tickets`, { withCredentials: true })
        setTickets(data)
      } catch (err) {
        console.error("Erro ao buscar tickets:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [API_URL])

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

  if (loading) {
    return <p className="text-white">Carregando tickets...</p>
  }

  return (
    <div className="space-y-6">
      {/* ...restante do JSX do seu componente, mantendo cards, filtros e tabela */}
      {/* Use filteredTickets no lugar do mockTickets */}
    </div>
  )
}
