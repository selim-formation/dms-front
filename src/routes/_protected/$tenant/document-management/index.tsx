import DocumentManagementPage from '@/features/document-management/pages/DocumentManagementPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

interface ManagementSearch {
  /** Open this document's details on arrival (set after create / edit). */
  view?: number
  /** Other params (e.g. the global `error` banner param) pass through untouched. */
  [key: string]: unknown
}

export const Route = createFileRoute('/_protected/$tenant/document-management/')({
  validateSearch: (search: Record<string, unknown>): ManagementSearch => {
    const view = Number(search.view)
    const { view: _ignored, ...rest } = search
    void _ignored
    return Number.isInteger(view) && view > 0 ? { ...rest, view } : rest
  },
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DocumentManagementPage,
})
