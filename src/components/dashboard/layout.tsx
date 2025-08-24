"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Phone,
  BarChart3,
  LogOut,
  Menu,
  X,
  Ticket,
  UserCheck,
  Zap,
  Calendar,
  Target,
  Send,
  FileText,
  Bell,
} from "lucide-react"
import { cn } from "../../lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", href: "/dashboard", active: false },
  { icon: Ticket, label: "Atendimentos", href: "/tickets", active: false },
  { icon: Users, label: "Contatos", href: "/contacts", active: false },
  { icon: MessageSquare, label: "Chat", href: "/chat", active: false },
  { icon: Target, label: "Funil", href: "/pipeline", active: false },
  { icon: BarChart3, label: "Kanban", href: "/kanban", active: false },
  { icon: Calendar, label: "Tarefas", href: "/tasks", active: false },
  { icon: Send, label: "Disparo em Massa", href: "/campaigns", active: false },
  { icon: Zap, label: "Campanha", href: "/marketing", active: false },
  { icon: UserCheck, label: "Grupos", href: "/groups", active: false },
  { icon: Phone, label: "Canais", href: "/channels", active: false },
  { icon: LayoutDashboard, label: "Painel Atendimentos", href: "/support-panel", active: false },
  { icon: FileText, label: "Relatórios", href: "/reports", active: false },
  { icon: Users, label: "Usuários", href: "/users", active: false },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPath = typeof window !== "undefined" ? window.location.pathname : ""
  const updatedMenuItems = menuItems.map((item) => ({
    ...item,
    active: item.href === currentPath,
  }))

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-bold text-lg">ROYAL</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {updatedMenuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">admin@royal.com</p>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">
              {currentPath === "/dashboard" && "Painel de Controle"}
              {currentPath === "/tickets" && "Gestão de Tickets"}
              {currentPath === "/contacts" && "Gestão de Contatos"}
              {currentPath === "/chat" && "Chat"}
              {!currentPath.includes("/dashboard") &&
                !currentPath.includes("/tickets") &&
                !currentPath.includes("/contacts") &&
                !currentPath.includes("/chat") &&
                "ROYAL CRM"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Data/Hora</span>
              <input
                type="date"
                defaultValue="2025-08-17"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              />
              <input
                type="date"
                defaultValue="2025-08-23"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                GERAR
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
