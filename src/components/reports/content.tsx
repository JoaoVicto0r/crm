"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, TrendingUp, MessageSquare, Clock, Star } from "lucide-react"

const performanceData = [
  { month: "Jan", tickets: 120, resolved: 110, avgTime: 4.2 },
  { month: "Fev", tickets: 135, resolved: 125, avgTime: 3.8 },
  { month: "Mar", tickets: 148, resolved: 140, avgTime: 4.1 },
  { month: "Abr", tickets: 162, resolved: 155, avgTime: 3.9 },
  { month: "Mai", tickets: 178, resolved: 170, avgTime: 3.6 },
  { month: "Jun", tickets: 195, resolved: 188, avgTime: 3.4 },
]

const userPerformanceData = [
  { name: "João Silva", tickets: 45, resolved: 43, avgTime: "3m 20s", satisfaction: 4.8 },
  { name: "Maria Santos", tickets: 52, resolved: 50, avgTime: "2m 45s", satisfaction: 4.9 },
  { name: "Pedro Costa", tickets: 38, resolved: 36, avgTime: "4m 10s", satisfaction: 4.6 },
  { name: "Ana Oliveira", tickets: 41, resolved: 39, avgTime: "3m 55s", satisfaction: 4.7 },
  { name: "Carlos Lima", tickets: 29, resolved: 28, avgTime: "5m 30s", satisfaction: 4.5 },
]

const channelData = [
  { name: "WhatsApp", value: 65, color: "#25d366" },
  { name: "Telegram", value: 20, color: "#0088cc" },
  { name: "Instagram", value: 10, color: "#e4405f" },
  { name: "Email", value: 5, color: "#ea4335" },
]

const satisfactionData = [
  { period: "Sem 1", score: 4.2 },
  { period: "Sem 2", score: 4.4 },
  { period: "Sem 3", score: 4.6 },
  { period: "Sem 4", score: 4.8 },
]

export function ReportsContent() {
  const [dateRange, setDateRange] = useState("30days")
  const [reportType, setReportType] = useState("performance")

  const handleExport = (format: string) => {
    // In a real app, this would trigger the export functionality
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-gray-400">Análise detalhada de performance e métricas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            Performance
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            Usuários
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-blue-600">
            Canais
          </TabsTrigger>
          <TabsTrigger value="satisfaction" className="data-[state=active]:bg-blue-600">
            Satisfação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total de Tickets</p>
                    <p className="text-2xl font-bold text-white">1,238</p>
                    <p className="text-sm text-green-400">+12.5% vs período anterior</p>
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
                    <p className="text-sm text-gray-400">Taxa de Resolução</p>
                    <p className="text-2xl font-bold text-white">94.2%</p>
                    <p className="text-sm text-green-400">+2.1% vs período anterior</p>
                  </div>
                  <div className="bg-green-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tempo Médio</p>
                    <p className="text-2xl font-bold text-white">3m 42s</p>
                    <p className="text-sm text-green-400">-15.3% vs período anterior</p>
                  </div>
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Satisfação Média</p>
                    <p className="text-2xl font-bold text-white">4.7</p>
                    <p className="text-sm text-green-400">+0.3 vs período anterior</p>
                  </div>
                  <div className="bg-yellow-600 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="tickets" fill="#4f46e5" name="Total de Tickets" />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolvidos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance por Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Usuário</TableHead>
                    <TableHead className="text-gray-300">Tickets</TableHead>
                    <TableHead className="text-gray-300">Resolvidos</TableHead>
                    <TableHead className="text-gray-300">Taxa de Resolução</TableHead>
                    <TableHead className="text-gray-300">Tempo Médio</TableHead>
                    <TableHead className="text-gray-300">Satisfação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPerformanceData.map((user, index) => (
                    <TableRow key={index} className="border-gray-800">
                      <TableCell className="text-white font-medium">{user.name}</TableCell>
                      <TableCell className="text-white">{user.tickets}</TableCell>
                      <TableCell className="text-white">{user.resolved}</TableCell>
                      <TableCell className="text-white">{((user.resolved / user.tickets) * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-white">{user.avgTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-white">{user.satisfaction}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Distribuição por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {channelData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
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

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Performance por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{channel.name}</span>
                        <span className="text-gray-400">{channel.value}% do total</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${channel.value}%`,
                            backgroundColor: channel.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Evolução da Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis domain={[0, 5]} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
