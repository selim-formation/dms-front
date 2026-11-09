import DocumentCreatePage from '@/features/document-management/pages/DocumentCreatePage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-management/new')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentCreatePage,
})
