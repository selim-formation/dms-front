import GalleriesPage from '@/features/galleries/pages/GalleriesPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/galleries/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: GalleriesPage,
})
