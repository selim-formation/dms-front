import UserManagementPage from '@/features/users/pages/UserManagementPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/users/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: UserManagementPage,
})
