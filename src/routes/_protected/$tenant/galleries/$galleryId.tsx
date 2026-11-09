import GalleryDetailPage from '@/features/galleries/pages/GalleryDetailPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/galleries/$galleryId')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: GalleryDetailPage,
})
