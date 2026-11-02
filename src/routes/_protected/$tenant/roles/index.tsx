import RolesPage from '@/features/roles/pages/RolesPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/roles/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: RolesPage,
})
