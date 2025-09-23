import { DashboardLayout } from "../../components/dashboard/layout";
import { KanbanContent } from "../../components/kanban/content";

export default function kanbanpage() {
    return (
        <DashboardLayout>
             <KanbanContent />
        </DashboardLayout>
    )
}