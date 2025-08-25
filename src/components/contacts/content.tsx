"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Search, MoreHorizontal, MessageSquare, Phone, Mail, Users, UserPlus, Calendar, Building, Instagram, Send } from "lucide-react"
import { getContacts } from "../../utils/api"

// Tipagem de Ticket
interface Ticket {
  id: number
  title: string
  status: string
  assignedTo?: string
  createdAt: string
}

// Tipagem do contato
interface Contact {
  id: number
  name: string
  firstName?: string
  lastName?: string
  businessName?: string
  number?: string
  email?: string
  profilePicUrl?: string
  isGroup: boolean
  isWAContact: boolean
  pushname?: string
  telegramId?: string
  instagramPK?: string
  messengerId?: string
  birthdayDate?: string
  cpf?: string
  tags: string[]
  channels: {
    whatsapp?: string
    telegram?: string
    instagram?: string
    email?: string
    phone?: string
  }
  lastInteraction: string
  totalTickets: number
  createdAt: string
  Tickets?: Ticket[]
}

// Ícones dos canais
function getChannelIcons(channels: Contact["channels"]) {
  const icons = []
  if (channels.whatsapp) icons.push(<MessageSquare key="wa" className="h-4 w-4 text-green-500" />)
  if (channels.telegram) icons.push(<Send key="tg" className="h-4 w-4 text-blue-500" />)
  if (channels.instagram) icons.push(<Instagram key="ig" className="h-4 w-4 text-pink-500" />)
  if (channels.email) icons.push(<Mail key="email" className="h-4 w-4 text-red-500" />)
  if (channels.phone) icons.push(<Phone key="phone" className="h-4 w-4 text-purple-500" />)
  return icons
}

// Formatações de datas
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

function formatBirthday(dateString?: string) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContacts()
      .then((data) => {
        const contactsFromApi: Contact[] = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          firstName: c.firstName,
          lastName: c.lastName,
          businessName: c.businessName,
          number: c.number ?? undefined, // garante que não seja null
          email: c.email ?? undefined,
          profilePicUrl: c.profilePicUrl,
          isGroup: c.isGroup ?? false,
          isWAContact: c.isWAContact ?? false,
          pushname: c.pushname,
          telegramId: c.telegramId ?? undefined,
          instagramPK: c.instagramPK ?? undefined,
          messengerId: c.messengerId,
          birthdayDate: c.birthdayDate,
          cpf: c.cpf,
          tags: c.tags ?? [],
          channels: {
            whatsapp: c.isWAContact ? c.number ?? undefined : undefined,
            email: c.email ?? undefined,
            telegram: c.telegramId ?? undefined,
            instagram: c.instagramPK ?? undefined,
            phone: c.number ?? undefined,
          },
          lastInteraction: c.updatedAt ?? c.createdAt,
          totalTickets: c.Tickets?.length ?? 0,
          createdAt: c.createdAt,
          Tickets: c.Tickets ?? [],
        }))
        setContacts(contactsFromApi)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.id.toString().includes(searchTerm)

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "individual" && !contact.isGroup && !contact.businessName) ||
      (typeFilter === "group" && contact.isGroup) ||
      (typeFilter === "business" && contact.businessName)

    const matchesChannel =
      channelFilter === "all" ||
      (channelFilter === "whatsapp" && contact.channels.whatsapp) ||
      (channelFilter === "telegram" && contact.channels.telegram) ||
      (channelFilter === "instagram" && contact.channels.instagram) ||
      (channelFilter === "email" && contact.channels.email)

    return matchesSearch && matchesType && matchesChannel
  })

  const stats = {
    total: contacts.length,
    individual: contacts.filter((c) => !c.isGroup && !c.businessName).length,
    business: contacts.filter((c) => c.businessName).length,
    groups: contacts.filter((c) => c.isGroup).length,
  }

  if (loading) return <p className="text-white">Carregando contatos...</p>


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Contatos</h1>
          <p className="text-gray-400">Gerencie todos os seus contatos e relacionamentos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Contato
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
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pessoas</p>
                <p className="text-2xl font-bold text-white">{stats.individual}</p>
              </div>
              <div className="bg-green-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Empresas</p>
                <p className="text-2xl font-bold text-white">{stats.business}</p>
              </div>
              <div className="bg-purple-600 p-2 rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Grupos</p>
                <p className="text-2xl font-bold text-white">{stats.groups}</p>
              </div>
              <div className="bg-orange-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
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
                  placeholder="Buscar por nome, telefone, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="individual">Pessoas</SelectItem>
                <SelectItem value="business">Empresas</SelectItem>
                <SelectItem value="group">Grupos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os Canais</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Contato</TableHead>
                <TableHead className="text-gray-300">Informações</TableHead>
                <TableHead className="text-gray-300">Canais</TableHead>
                <TableHead className="text-gray-300">Tags</TableHead>
                <TableHead className="text-gray-300">Tickets</TableHead>
                <TableHead className="text-gray-300">Última Interação</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="border-gray-800 hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.profilePicUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {contact.isGroup ? <Users className="h-5 w-5" /> : contact.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">ID: #{contact.id}</p>
                        {contact.isGroup && <Badge className="bg-orange-600 text-white text-xs mt-1">Grupo</Badge>}
                        {contact.businessName && (
                          <Badge className="bg-purple-600 text-white text-xs mt-1">Empresa</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.number && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-white">{contact.number}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-white">{contact.email}</span>
                        </div>
                      )}
                      {contact.birthdayDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{formatBirthday(contact.birthdayDate)}</span>
                        </div>
                      )}
                      {contact.businessName && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{contact.businessName}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">{getChannelIcons(contact.channels)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-600 text-white text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="text-white font-medium">{contact.totalTickets}</span>
                      <p className="text-gray-400 text-xs">tickets</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">{formatDate(contact.lastInteraction)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Editar contato</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Ver histórico</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Gerenciar tags</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">Iniciar conversa</DropdownMenuItem>
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
