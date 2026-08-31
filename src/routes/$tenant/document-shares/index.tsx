import { createFileRoute } from '@tanstack/react-router'
import DocumentSharesPage from '@/features/documents/pages/DocumentSharesPage'

export const Route = createFileRoute('/$tenant/document-shares/')({
  component: DocumentSharesPage,
})
