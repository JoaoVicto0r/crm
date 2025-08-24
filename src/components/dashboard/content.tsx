"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from "recharts";
import { Users, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { getDashboardData, DashboardData } from "../../utils/api";

// MetricCard component
function MetricCard({ title, value, change, icon: Icon, trend }: any) {
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
  );
}

// DashboardContent consumindo API
export function DashboardContent() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  if (!dashboard) return <p className="text-white">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total de Usuários" value={dashboard.totalUsers.toString()} change="+12%" icon={Users} trend="up" />
        <MetricCard title="Usuários Ativos" value={dashboard.activeUsers.toString()} change="+8%" icon={CheckCircle} trend="up" />
        <MetricCard title="Usuários Inativos" value={dashboard.inactiveUsers.toString()} change="-5%" icon={Clock} trend="down" />
      </div>
    </div>
  );
}
