import EntitiesPage from '@/features/entities/pages/EntitiesPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/entities/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: EntitiesPage,
})
