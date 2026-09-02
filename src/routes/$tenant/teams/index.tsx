import TeamPage from '@/features/teams/pages/TeamPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/$tenant/teams/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: TeamPage,
})
