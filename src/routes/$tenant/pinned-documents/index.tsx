import { createFileRoute } from '@tanstack/react-router'
import PinnedDocumentsPage from '@/features/documents/pages/PinnedDocumentsPage'

export const Route = createFileRoute('/$tenant/pinned-documents/')({
  component: PinnedDocumentsPage,
})
