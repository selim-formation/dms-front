import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/features/profile/pages/ProfilePage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/profile')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: ProfilePage,
})
