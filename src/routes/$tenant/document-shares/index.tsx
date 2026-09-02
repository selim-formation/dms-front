import { createFileRoute } from '@tanstack/react-router'
import DocumentSharesPage from '@/features/documents/pages/DocumentSharesPage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/$tenant/document-shares/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentSharesPage,
})
