import { DashboardLayout } from "../../components/dashboard/layout"
import { KanbanInterface } from "../../components/kanban/kanban-interface"

export default function KanbanPage() {
  return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <KanbanInterface />
        </div>
      </DashboardLayout>
  )
}
