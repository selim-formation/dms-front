import TypesPage from '@/features/types/pages/TypesPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/types/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: TypesPage,
})
