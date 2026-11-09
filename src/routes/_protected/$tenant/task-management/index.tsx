import TaskManagementPage from '@/features/task-management/pages/TaskManagementPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/task-management/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: TaskManagementPage,
})
