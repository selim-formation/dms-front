import { createFileRoute } from '@tanstack/react-router'
import PinnedDocumentsPage from '@/features/documents/pages/PinnedDocumentsPage'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/pinned-documents/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: PinnedDocumentsPage,
})
