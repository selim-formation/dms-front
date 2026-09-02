import { createFileRoute } from '@tanstack/react-router'
import HomePage from '@/features/home/pages/HomePage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/$tenant/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: HomePage,
})
