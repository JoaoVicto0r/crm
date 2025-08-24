"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Settings, Users, MessageSquare, Bell, Shield, Database, Save, RefreshCw } from "lucide-react"

export function SettingsContent() {
  const [settings, setSettings] = useState({
    general: {
      companyName: "ROYAL CRM",
      timezone: "America/Sao_Paulo",
      language: "pt-BR",
      dateFormat: "DD/MM/YYYY",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newTicketAlert: true,
      ticketAssignedAlert: true,
    },
    integrations: {
      whatsappEnabled: true,
      telegramEnabled: true,
      instagramEnabled: false,
      emailEnabled: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionDays: 30,
      backupLocation: "cloud",
    },
  })

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">
            <Settings className="mr-2 h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="mr-2 h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-blue-600">
            <Database className="mr-2 h-4 w-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-200">
                    Nome da Empresa
                  </Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, companyName: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-gray-200">
                    Fuso Horário
                  </Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-200">
                    Idioma
                  </Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, language: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat" className="text-gray-200">
                    Formato de Data
                  </Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, dateFormat: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Integrações de Canais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">WhatsApp</h3>
                  <p className="text-gray-400 text-sm">Integração com WhatsApp Business API</p>
                </div>
                <Switch
                  checked={settings.integrations.whatsappEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, whatsappEnabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Telegram</h3>
                  <p className="text-gray-400 text-sm">Integração com Telegram Bot API</p>
                </div>
                <Switch
                  checked={settings.integrations.telegramEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, telegramEnabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Instagram</h3>
                  <p className="text-gray-400 text-sm">Integração com Instagram Direct</p>
                </div>
                <Switch
                  checked={settings.integrations.instagramEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, instagramEnabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Email</h3>
                  <p className="text-gray-400 text-sm">Integração com servidor de email</p>
                </div>
                <Switch
                  checked={settings.integrations.emailEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, emailEnabled: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Notificações por Email</h3>
                  <p className="text-gray-400 text-sm">Receber notificações por email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Notificações Push</h3>
                  <p className="text-gray-400 text-sm">Receber notificações push no navegador</p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Alerta de Novo Ticket</h3>
                  <p className="text-gray-400 text-sm">Notificar quando um novo ticket for criado</p>
                </div>
                <Switch
                  checked={settings.notifications.newTicketAlert}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newTicketAlert: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Alerta de Ticket Atribuído</h3>
                  <p className="text-gray-400 text-sm">Notificar quando um ticket for atribuído a você</p>
                </div>
                <Switch
                  checked={settings.notifications.ticketAssignedAlert}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, ticketAssignedAlert: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Autenticação de Dois Fatores</h3>
                  <p className="text-gray-400 text-sm">Adicionar uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-gray-200">
                    Timeout de Sessão (minutos)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry" className="text-gray-200">
                    Expiração de Senha (dias)
                  </Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configurações de Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">Backup Automático</h3>
                  <p className="text-gray-400 text-sm">Realizar backups automáticos do sistema</p>
                </div>
                <Switch
                  checked={settings.backup.autoBackup}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      backup: { ...settings.backup, autoBackup: checked },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency" className="text-gray-200">
                    Frequência do Backup
                  </Label>
                  <Select
                    value={settings.backup.backupFrequency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        backup: { ...settings.backup, backupFrequency: value },
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionDays" className="text-gray-200">
                    Retenção (dias)
                  </Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={settings.backup.retentionDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backup: { ...settings.backup, retentionDays: Number.parseInt(e.target.value) },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Database className="mr-2 h-4 w-4" />
                  Fazer Backup Agora
                </Button>
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restaurar Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
