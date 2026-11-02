import SectionsPage from '@/features/sections/pages/SectionsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/sections/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: SectionsPage,
})
