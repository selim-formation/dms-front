import DocumentManagementPage from '@/features/document-management/pages/DocumentManagementPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/document-management/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentManagementPage,
})
