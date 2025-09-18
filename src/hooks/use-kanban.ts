"use client"

import { useState, useCallback } from "react"
import type { KanbanCard, KanbanColumn } from "../components/kanban/kanban-interface"
import api, { showAllTicketInformation, showContact}  from "../utils/api"
import { useToast } from "../hooks/use-toast"
import {
  createTicket,
  setQueue,
  setTicketInfo,
} from "../utils/api"

export function useKanban() {
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const loadKanbanData = useCallback(async () => {
    try {
      setLoading(true)

      // Carregar dados da API
      const [ticketsResponse, contactsResponse] = await Promise.all([
        showAllTicketInformation().catch(() => ({ data: [] })),
        showContact(0).catch(() => ({ data: [] })),
      ])

      const initialColumns: KanbanColumn[] = [
        {
          id: "todo",
          title: "A Fazer",
          color: "bg-gray-500",
          cards: [],
        },
        {
          id: "in-progress",
          title: "Em Progresso",
          color: "bg-blue-500",
          cards: [],
        },
        {
          id: "review",
          title: "Em Revisão",
          color: "bg-yellow-500",
          cards: [],
        },
        {
          id: "done",
          title: "Concluído",
          color: "bg-green-500",
          cards: [],
        },
      ]

      const columnsWithCards = initialColumns

      setColumns(columnsWithCards)
    } catch (error) {
      console.error("Erro ao carregar dados do Kanban:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do Kanban",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const createCard = useCallback(
    async (columnId: string, cardData: Omit<KanbanCard, "id">) => {
      try {
        
        const newCard: KanbanCard = {
          ...cardData,
          id: `task-${Date.now()}`,
          avatar: "/placeholder.svg?height=32&width=32",
          status: columnId as KanbanCard["status"],
          createdAt: new Date().toISOString(),
        }

        
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col)),
        )

        if (cardData.title) {
          await createTicket({
            id: newCard.id,
            title: cardData.title,
            description: cardData.description || "",
            priority: cardData.priority,
            status: "open",
            contactId: "1", 
            assignedTo: cardData.assignedTo,
          })
        }

        toast({
          title: "Sucesso",
          description: "Tarefa criada com sucesso",
        })

        return newCard
      } catch (error) {
        console.error("Erro ao criar card:", error)
        toast({
          title: "Erro",
          description: "Não foi possível criar a tarefa",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  const moveCard = useCallback(
    async (cardId: string, sourceColumnId: string, targetColumnId: string) => {
      try {
        
        const sourceColumn = columns.find((col) => col.id === sourceColumnId)
        const card = sourceColumn?.cards.find((c) => c.id === cardId)

        if (!card) return false

        const updatedCard = {
          ...card,
          status: targetColumnId as KanbanCard["status"],
          ...(targetColumnId === "done" && !card.completedAt ? { completedAt: new Date().toISOString() } : {}),
        }

        // Atualizar estado local
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === sourceColumnId) {
              return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            }
            if (col.id === targetColumnId) {
              return { ...col, cards: [...col.cards, updatedCard] }
            }
            return col
          }),
        )

        // Atualizar na API
        if (card.ticketId) {
          await setQueue(Number(card.ticketId), Number(targetColumnId))
        }

        return true
      } catch (error) {
        console.error("Erro ao mover card:", error)
        // Reverter mudança
        loadKanbanData()
        throw error
      }
    },
    [columns, loadKanbanData],
  )

  const updateCard = useCallback(
    async (cardId: string, updates: Partial<KanbanCard>) => {
      try {
        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            cards: col.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
          })),
        )

        const card = columns.flatMap((col) => col.cards).find((c) => c.id === cardId)
        if (card?.ticketId && updates.title) {
          await setTicketInfo(Number(card.ticketId), {
            title: updates.title,
            description: updates.description || "",
          })
        }

        toast({
          title: "Sucesso",
          description: "Tarefa atualizada com sucesso",
        })
      } catch (error) {
        console.error("Erro ao atualizar card:", error)
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a tarefa",
          variant: "destructive",
        })
        throw error
      }
    },
    [columns, toast],
  )

  const deleteCard = useCallback(
    async (cardId: string) => {
      try {
        const card = columns.flatMap((col) => col.cards).find((c) => c.id === cardId)

        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            cards: col.cards.filter((c) => c.id !== cardId),
          })),
        )

        
        if (card?.ticketId) {
          
        }

        toast({
          title: "Sucesso",
          description: "Tarefa removida com sucesso",
        })
      } catch (error) {
        console.error("Erro ao deletar card:", error)
        toast({
          title: "Erro",
          description: "Não foi possível remover a tarefa",
          variant: "destructive",
        })
        throw error
      }
    },
    [columns, toast],
  )

  return {
    columns,
    loading,
    loadKanbanData,
    createCard,
    moveCard,
    updateCard,
    deleteCard,
  }
}
