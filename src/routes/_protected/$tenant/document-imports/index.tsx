import DocumentImportsPage from '@/features/document-imports/pages/DocumentImportsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-imports/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentImportsPage,
})
