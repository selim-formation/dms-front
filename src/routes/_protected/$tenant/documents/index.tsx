import { createFileRoute } from '@tanstack/react-router'
import DocumentsPage from '@/features/documents/pages/DocumentListPage'

export const Route = createFileRoute('/_protected/$tenant/documents/')({
  component: DocumentsPage,
})
