"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
} from "recharts"
import { Users, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { getDashboardData, DashboardData } from "../../utils/api"

// ====================== COMPONENTS ======================
function CustomPieChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm font-medium flex items-center justify-between">
          {title}
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-300">{entry.name}</span>
              </div>
              <span className="text-white font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down"
}) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <p className={`text-sm mt-1 ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
              {change} vs. período anterior
            </p>
          </div>
          <div className="bg-blue-600 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyChart({ data }: { data: { day: string; tickets: number; messages: number }[] }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Performance Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="tickets" stroke="#4f46e5" strokeWidth={2} name="Tickets" />
              <Line type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={2} name="Mensagens" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function HourlyChart({ data }: { data: { hour: string; count: number }[] }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Distribuição por Horário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// ====================== DASHBOARD MAIN ======================
export function DashboardContent() {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboardData()
        setDashboard(res)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-white">Carregando...</p>
  if (!dashboard) return <p className="text-red-500">Erro ao carregar dados</p>

  // Mock data para gráficos caso a API não forneça todos
  const weeklyData = dashboard.weeklyData || []
  const hourlyData = dashboard.hourlyData || []
  const statusData = dashboard.statusData || []
  const userAttendanceData = dashboard.userAttendanceData || []
  const channelData = dashboard.channelData || []
  const connectionData = dashboard.connectionData || []
  const demandData = dashboard.demandData || []

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total de Tickets" value={dashboard.totalTickets?.toString() || "0"} change="+12.5%" icon={MessageSquare} trend="up" />
        <MetricCard title="Contatos Ativos" value={dashboard.contatosAtivos?.toString() || "0"} change="+8.2%" icon={Users} trend="up" />
        <MetricCard title="Tempo Médio" value={dashboard.tempoMedio || "0m"} change="-15.3%" icon={Clock} trend="down" />
        <MetricCard title="Taxa de Resolução" value={`${dashboard.taxaResolucao?.toFixed(1) || 0}%`} change="+2.1%" icon={CheckCircle} trend="up" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart data={weeklyData} />
        <HourlyChart data={hourlyData} />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CustomPieChart data={statusData} title="Atendimento por Status" />
        <CustomPieChart data={userAttendanceData} title="Atendimento por Usuário" />
        <CustomPieChart data={channelData} title="Atendimento por Canal" />
        <CustomPieChart data={connectionData} title="Status das Conexões" />
        <CustomPieChart data={demandData} title="Atendimento por Demanda" />
      </div>
    </div>
  )
}
