import DocumentViewPage from '@/features/documents/pages/DocumentViewPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/$tenant/documents/$id')({
    beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
    component: DocumentViewPage,
})
