import { createFileRoute } from '@tanstack/react-router'
import FavoritesPage from '@/features/documents/pages/FavoritesPage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/favorites/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: FavoritesPage,
})
