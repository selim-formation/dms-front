import { createFileRoute } from '@tanstack/react-router'
import DocumentsPage from '@/features/documents/pages/DocumentListPage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/documents/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentsPage,
})
