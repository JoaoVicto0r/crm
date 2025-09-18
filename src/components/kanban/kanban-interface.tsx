"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Plus, Calendar, MoreHorizontal, GripVertical, Clock } from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useKanban } from "../../hooks/use-kanban"
import { CreateCardModal } from "./create-card-modal"
import React from "react";

export interface Ticket{
    id:number;
    title:string;
    status:string;
    contactId:number;
}

export interface KanbanCard {
  id: string
  title: string
  description?: string
  assignedTo?: string
  priority: "low" | "medium" | "high"
  estimatedHours?: number
  dueDate?: string
  tags: string[]
  avatar?: string
  ticketId?: string
  status?: "todo" | "in-progress" | "review" | "done"
  createdAt?: string
  completedAt?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color: string
}

function DraggableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: KanbanCard["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityLabel = (priority: KanbanCard["priority"]) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Desconhecida"
    }
  }

  const formatHours = (hours: number) => {
    return `${hours}h`
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
        isDragging ? "opacity-50 rotate-3 scale-105" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium line-clamp-2 flex-1">{card.title}</h4>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        {card.description && <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>}

        <div className="flex items-center justify-between">
          <Badge variant={getPriorityColor(card.priority)} className="text-xs">
            {getPriorityLabel(card.priority)}
          </Badge>
          {card.estimatedHours && (
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <Clock className="h-3 w-3" />
              <span>{formatHours(card.estimatedHours)}</span>
            </div>
          )}
        </div>

        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          {card.assignedTo && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={card.avatar || "/placeholder.svg"} alt={card.assignedTo} />
                <AvatarFallback className="text-xs">
                  {card.assignedTo
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{card.assignedTo}</span>
            </div>
          )}

          {card.dueDate && (
            <div
              className={`flex items-center space-x-1 text-xs ${
                isOverdue(card.dueDate) ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>{new Date(card.dueDate).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function DroppableColumn({ column, onAddCard }: { column: KanbanColumn; onAddCard: (columnId: string) => void }) {
  const totalHours = column.cards.reduce((sum, card) => sum + (card.estimatedHours || 0), 0)

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${column.color}`}></div>
              <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {column.cards.length}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{totalHours}h estimadas</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
          <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
            {column.cards.map((card) => (
              <DraggableCard key={card.id} card={card} />
            ))}
          </SortableContext>

          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => onAddCard(column.id)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar tarefa
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function KanbanInterface() {
  const { columns, loading, loadKanbanData, createCard, moveCard } = useKanban()
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    loadKanbanData()
  }, [loadKanbanData])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = columns.flatMap((col) => col.cards).find((card) => card.id === active.id)

    setActiveCard(card || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveCard(null)
      return
    }

    const activeCardId = active.id as string
    const overColumnId = over.id as string

    const sourceColumn = columns.find((col) => col.cards.some((card) => card.id === activeCardId))

    if (!sourceColumn || sourceColumn.id === overColumnId) {
      setActiveCard(null)
      return
    }

    try {
      await moveCard(activeCardId, sourceColumn.id, overColumnId)
    } catch (error) {
      console.error("Erro ao mover card:", error)
    }

    setActiveCard(null)
  }

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId)
    setCreateModalOpen(true)
  }

  const handleCreateCard = async (cardData: Omit<KanbanCard, "id">) => {
    try {
      await createCard(selectedColumnId, cardData)
    } catch (error) {
      console.error("Erro ao criar card:", error)
    }
  }

  const totalTasks = columns.reduce((sum, column) => sum + column.cards.length, 0)
  const totalHours = columns.reduce(
    (sum, column) => sum + column.cards.reduce((cardSum, card) => cardSum + (card.estimatedHours || 0), 0),
    0,
  )
  const completedTasks = columns.find((col) => col.id === "done")?.cards.length || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gerenciador de Tarefas</h1>
              <p className="text-muted-foreground">
                {totalTasks} tarefas • {totalHours}h estimadas • {completedTasks} concluídas
              </p>
            </div>
            <Button onClick={() => handleAddCard("todo")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>

          <div className="flex space-x-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <DroppableColumn key={column.id} column={column} onAddCard={handleAddCard} />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="rotate-3 scale-105">
                <DraggableCard card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>

      <CreateCardModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateCard={handleCreateCard}
        columnId={selectedColumnId}
      />
    </>
  )
}
