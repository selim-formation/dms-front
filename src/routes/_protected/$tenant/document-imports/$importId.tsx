import DocumentImportDetailPage from '@/features/document-imports/pages/DocumentImportDetailPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-imports/$importId')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentImportDetailPage,
})
