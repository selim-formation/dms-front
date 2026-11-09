import DocumentEditPage from '@/features/document-management/pages/DocumentEditPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-management/$documentId/edit')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentEditPage,
})
