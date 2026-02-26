/**
 * Tasks Route
 * Main tasks page for viewing, filtering, sorting, and managing tasks
 */

import { createFileRoute } from '@tanstack/react-router'
import TasksPage from '@/features/tasks/pages/TasksPage'

export const Route = createFileRoute('/$tenant/tasks')({
    component: TasksRouteComponent,
})

function TasksRouteComponent() {
    return <TasksPage />
}

