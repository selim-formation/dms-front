/**
 * Tasks Route
 * Main tasks page for viewing, filtering, sorting, and managing tasks
 */

import { createFileRoute } from '@tanstack/react-router'
import TasksPage from '@/features/tasks/pages/TasksPage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/$tenant/tasks')({
    beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
    component: TasksRouteComponent,
})

function TasksRouteComponent() {
    return <TasksPage />
}

