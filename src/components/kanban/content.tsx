"use client"

export function KanbanContent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative flex flex-col items-center">
        {/* Engrenagem girando */}
        <div className="w-24 h-24 border-8 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>

        {/* Texto */}
        <p className="mt-8 text-2xl font-bold text-gray-700">
          🚧 Kanban em Construção 🚧
        </p>

        {/* Barras de progresso tipo construção */}
        <div className="mt-6 flex space-x-2">
          <div className="w-4 h-8 bg-yellow-500 animate-bounce delay-75"></div>
          <div className="w-4 h-8 bg-yellow-500 animate-bounce delay-150"></div>
          <div className="w-4 h-8 bg-yellow-500 animate-bounce delay-300"></div>
          <div className="w-4 h-8 bg-yellow-500 animate-bounce delay-450"></div>
        </div>
      </div>
    </div>
  )
}
