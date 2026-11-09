import DocumentVersionsPage from '@/features/document-management/pages/DocumentVersionsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-management/$documentId/versions')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentVersionsPage,
})
