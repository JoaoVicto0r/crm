"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { Users, MessageSquare, Clock, CheckCircle } from "lucide-react"

const attendanceData = [
  { name: "Sem informação", value: 95.6, color: "#4f46e5" },
  { name: "Comercial", value: 4.4, color: "#7c3aed" },
]

const userAttendanceData = [
  { name: "João Silva", value: 27.1, color: "#4f46e5" },
  { name: "Maria Santos", value: 26.0, color: "#7c3aed" },
  { name: "Pedro Costa", value: 24.3, color: "#2563eb" },
  { name: "Ana Oliveira", value: 16.4, color: "#0891b2" },
  { name: "Carlos Lima", value: 6.2, color: "#059669" },
]

const statusData = [
  { name: "Aberto", value: 45, color: "#ef4444" },
  { name: "Em Andamento", value: 35, color: "#f59e0b" },
  { name: "Concluído", value: 20, color: "#10b981" },
]

const connectionData = [
  { name: "Conectado", value: 85, color: "#10b981" },
  { name: "Desconectado", value: 15, color: "#ef4444" },
]

const channelData = [
  { name: "WhatsApp", value: 70, color: "#25d366" },
  { name: "Telegram", value: 15, color: "#0088cc" },
  { name: "Instagram", value: 10, color: "#e4405f" },
  { name: "Email", value: 5, color: "#ea4335" },
]

const demandData = [
  { name: "Suporte Técnico", value: 40, color: "#4f46e5" },
  { name: "Vendas", value: 35, color: "#10b981" },
  { name: "Financeiro", value: 15, color: "#f59e0b" },
  { name: "Outros", value: 10, color: "#6b7280" },
]

const weeklyData = [
  { day: "Seg", tickets: 45, messages: 120 },
  { day: "Ter", tickets: 52, messages: 140 },
  { day: "Qua", tickets: 38, messages: 95 },
  { day: "Qui", tickets: 61, messages: 165 },
  { day: "Sex", tickets: 55, messages: 150 },
  { day: "Sáb", tickets: 28, messages: 75 },
  { day: "Dom", tickets: 15, messages: 40 },
]

const hourlyData = [
  { hour: "08h", count: 12 },
  { hour: "09h", count: 25 },
  { hour: "10h", count: 35 },
  { hour: "11h", count: 42 },
  { hour: "12h", count: 28 },
  { hour: "13h", count: 18 },
  { hour: "14h", count: 38 },
  { hour: "15h", count: 45 },
  { hour: "16h", count: 52 },
  { hour: "17h", count: 48 },
  { hour: "18h", count: 32 },
]

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

function WeeklyChart() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Performance Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
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

function HourlyChart() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Distribuição por Horário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
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

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total de Tickets" value="1,247" change="+12.5%" icon={MessageSquare} trend="up" />
        <MetricCard title="Contatos Ativos" value="3,891" change="+8.2%" icon={Users} trend="up" />
        <MetricCard title="Tempo Médio" value="4m 32s" change="-15.3%" icon={Clock} trend="up" />
        <MetricCard title="Taxa de Resolução" value="94.2%" change="+2.1%" icon={CheckCircle} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart />
        <HourlyChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CustomPieChart data={statusData} title="Atendimento por Status" />
        <CustomPieChart data={userAttendanceData} title="Atendimento por Usuário" />
        <CustomPieChart data={channelData} title="Atendimento por Canal" />
        <CustomPieChart data={connectionData} title="Status das Conexões" />
        <CustomPieChart data={demandData} title="Atendimento por Demanda" />
        <CustomPieChart data={attendanceData} title="Distribuição Geral" />
      </div>
    </div>
  )
}
